import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import { ReduxStoreType } from "../types/reduxTypes";
import useWindowDimentions from "../tools/windowDimentions";
import { InvoiceType } from "../types/app";
import getPaidInvoices from "../api/get/getPaidInvoices";
import refreshToken from "../api/post/refreshToken";
import { useSnackbar, VariantType } from "notistack";
import currencies from "../tools/currencies";

const Home = () => {
  const user = useSelector((state: ReduxStoreType) => state.user);
  const theme = useTheme();
  const { width, height } = useWindowDimentions();

  const [paidInvoices, setPaidInvoices] = useState<InvoiceType[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

  const loadInvoices = async (retry: boolean) => {
    try {
      const invoices: InvoiceType[] = await getPaidInvoices();
      setPaidInvoices(
        // invoices.filter(
        //   (invoice) =>
        //     invoice.paidAt &&
        //     invoice.paidAt >
        //       Date.parse(
        //         new Date(
        //           `${Date().split(" ")[1]} 1, ${Date().split(" ")[3]}`
        //         ).toString()
        //       )
        // )
        invoices.slice(0, 10)
      );
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await loadInvoices(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to load invoices");
        }
      }
    }
  };

  const beautyDate = (date: number, time: boolean) => {
    const datetime = new Date(Number(date));
    const dateStrArr = datetime.toString().split(" ");
    return `${dateStrArr[2]} ${dateStrArr[1]} ${dateStrArr[3]}${
      time ? `, ${dateStrArr[4].slice(0, 5)}` : ""
    }`;
  };

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  useEffect(() => void loadInvoices(true), []);

  return (
    <Grid container rowSpacing={2} p={3}>
      <Grid container item>
        <Grid item xs={12} md={9} p={2}>
          <Box
            p={2}
            sx={{
              backgroundColor: "primary.100",
              borderRadius: "10px",
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              This Month
            </Typography>
            <ResponsiveContainer
              height={height < width ? 0.25 * height : 0.4 * width}
            >
              <LineChart
                data={Array.apply(null, Array(Number(Date().split(" ")[2])))
                  .map(function (x, i) {
                    return i + 1;
                  })
                  .map((day, index) => {
                    const date = Date.parse(
                      new Date(
                        `${Date().split(" ")[1]} ${2}, ${Date().split(" ")[3]}` // 2 <= 1 + day: 1
                      ).toString()
                    );
                    if (index === 0) {
                      return date;
                    } else {
                      return date + index * 86400000;
                    }
                  })
                  .map((mill) =>
                    paidInvoices.filter(
                      (invoice) =>
                        invoice.paidAt && Number(invoice.paidAt) < mill
                    )
                  )
                  .map((invoices, index) => {
                    return {
                      day: index + 1,
                      amount:
                        invoices.length > 1
                          ? invoices
                              .map((invoice) => Number(invoice.amount))
                              .reduce((a, b) => a + b)
                          : invoices.length === 1
                          ? Number(invoices[0].amount)
                          : 0,
                    };
                  })}
              >
                <XAxis
                  dataKey="day"
                  stroke={theme.palette.text.secondary}
                  style={theme.typography.body2}
                />
                <YAxis
                  stroke={theme.palette.text.secondary}
                  style={theme.typography.body2}
                >
                  <Label
                    angle={270}
                    position="insideLeft"
                    style={{
                      textAnchor: "middle",
                      fill: theme.palette.text.primary,
                      ...theme.typography.body1,
                    }}
                  >
                    {`Income (${
                      paidInvoices.length > 0
                        ? currencies.find(
                            (cur) => cur.value === paidInvoices[0].currency
                          )?.label
                        : "$"
                    })`}
                  </Label>
                </YAxis>
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="amount"
                  stroke={theme.palette.primary.main}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} p={2}>
          <Box
            p={2}
            display="flex"
            flexDirection="column"
            height={height < width ? 0.25 * height + 39 : 0.4 * width + 39}
            sx={{
              backgroundColor: "primary.100",
              borderRadius: "10px",
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Recent Income
            </Typography>
            <Typography component="p" variant="h4">
              {`${
                paidInvoices.length > 0
                  ? currencies.find(
                      (cur) => cur.value === paidInvoices[0].currency
                    )?.label
                  : "$"
              } ${
                paidInvoices.length > 0
                  ? paidInvoices
                      .filter(
                        (invoice) =>
                          invoice.paidAt &&
                          Number(invoice.paidAt) >
                            Date.parse(
                              new Date(
                                `${Date().split(" ")[1]} ${1}, ${
                                  Date().split(" ")[3]
                                }` // 1 <= 1 + day: 0
                              ).toString()
                            )
                      )
                      .map((invoice) => Number(invoice.amount))
                      .reduce((a, b) => a + b)
                  : 0
              }`}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              this month
            </Typography>
            <Box sx={{ color: "primary.main" }}>
              <Link to="/invoices" style={{ color: "inherit" }}>
                View recent invoices
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container item>
        <Grid item justifyContent="center" xs={12} p={2}>
          <Box
            p={2}
            display="flex"
            flexDirection="column"
            sx={{
              backgroundColor: "primary.100",
              borderRadius: "10px",
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Recent Payments
            </Typography>{" "}
            <TableContainer component={Paper} sx={{ my: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Customer
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Invoiced At
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Paid At
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paidInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.createdAt}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {`${
                          currencies.find(
                            (cur) => cur.value === invoice.currency
                          )?.label
                        } ${invoice.amount}`}
                      </TableCell>
                      <TableCell align="right">
                        {invoice.customerName}
                      </TableCell>
                      <TableCell align="right">
                        {beautyDate(invoice.createdAt, true)}
                      </TableCell>
                      <TableCell align="right">
                        {invoice.paidAt
                          ? beautyDate(invoice.paidAt, true)
                          : "Date not found"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ color: "primary.main" }}>
              <Link to="/invoices" style={{ color: "inherit" }}>
                View recent invoices
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
