import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReduxStoreType } from "../types/reduxTypes";
import { useSnackbar, VariantType } from "notistack";
import { Link as LinkRouter } from "react-router-dom";

import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

import { InvoiceType, CustomerType, ProductType } from "../types/app";
import refreshToken from "../api/post/refreshToken";
import getInvoices from "../api/get/getInvoices";
import currencies from "../tools/currencies";
import getProducts from "../api/get/getProducts";
import getCustomers from "../api/get/getCustomers";
import createInvoice from "../api/post/createInvoice";

const Invoices = () => {
  const [openAddInvoicePopup, setOpenAddInvoicePopup] = useState(false);
  const [newInvoice, setNewInvoice] = useState<InvoiceType>({
    amount: 0,
    currency: "",
    createdAt: 0,
    customerEmail: "",
    customerName: "",
    dueAt: Date.parse(Date().toString()),
    products: [
      {
        product: "",
        productName: "",
        currency: "",
        price: 0,
        quantity: 1,
        archived: false,
        recurring: "one-time",
      },
    ],
    notes: "",
    paid: false,
    status: "",
  });
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [tab, setTab] = useState("all");

  const user = useSelector((state: ReduxStoreType) => state.user);

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

  const loadInvoices = async (retry: boolean) => {
    try {
      const invoices = await getInvoices();
      setInvoices(invoices);
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

  const loadProducts = async (retry: boolean) => {
    try {
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await loadProducts(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to save profile");
        }
      }
    }
  };

  const loadCustomers = async (retry: boolean) => {
    try {
      const customers = await getCustomers();
      setCustomers(customers);
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await loadCustomers(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to load customers");
        }
      }
    }
  };

  const addInvoice = async (retry: boolean) => {
    try {
      if (newInvoice.customerEmail === "") {
        throwNewSnackbar("warning", "No customer selected");
      } else if (newInvoice.products.length === 0) {
        throwNewSnackbar("warning", "No products selected");
      } else if (newInvoice.products.map((pr) => pr.product).includes("")) {
        throwNewSnackbar("warning", "You can not invoice an empty product");
      } else if (
        new Set(
          newInvoice.products
            .filter((pr) => pr.currency)
            .map((pr) => pr.currency)
        ).size !== 1
      ) {
        throwNewSnackbar(
          "warning",
          "All products should have the same currency"
        );
      } else {
        throwNewSnackbar("info", "Saving...");
        const createdInvoice: InvoiceType = await createInvoice(newInvoice);
        setInvoices([...invoices, createdInvoice]);
        setOpenAddInvoicePopup(false);
        setNewInvoice({
          amount: 0,
          currency: "",
          createdAt: 0,
          customerEmail: "",
          customerName: "",
          dueAt: Date.parse(Date().toString()),
          products: [
            {
              product: "",
              productName: "",
              currency: "",
              price: 0,
              quantity: 1,
              archived: false,
              recurring: "one-time",
            },
          ],
          notes: "",
          paid: false,
          status: "",
        });
        throwNewSnackbar("success", "Saved!");
      }
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await addInvoice(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to send invoice");
        }
      } else {
        throwNewSnackbar("error", "Failed to send invoice");
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

  useEffect(() => {
    loadInvoices(true);
    loadProducts(true);
    loadCustomers(true);
  }, []);

  useEffect(() => {
    if (openAddInvoicePopup) {
      loadProducts(true);
      loadCustomers(true);
    }
  }, [openAddInvoicePopup]);

  return (
    <Container maxWidth="xl">
      <Grid
        container
        flexDirection={{ xs: "column-reverse", md: "unset" }}
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid
          sx={{
            my: 2,
            width: "100%",
            overflowX: { xs: "auto", sm: "visible" },
          }}
        >
          <Tabs
            value={tab}
            onChange={(event: React.SyntheticEvent, newValue: string) => {
              setTab(newValue);
            }}
            textColor="primary"
            indicatorColor="primary"
            sx={{ width: "max-content" }}
          >
            <Tab value="all" label="All Invoices" />
            <Tab value="outstanding" label="Outstanding" />
            <Tab value="past-due" label="Past Due" />
            <Tab value="paid" label="Paid" />
          </Tabs>
        </Grid>
        <Grid
          item
          container
          flexDirection={{ xs: "column-reverse", md: "unset" }}
          justifyContent={{ xs: "center", md: "flex-end" }}
          rowSpacing={1}
          columnSpacing={{ xs: 1, md: 2 }}
          sx={{ my: 2 }}
        >
          <Grid item xs={12} md="auto" display={{ xs: "grid", md: "auto" }}>
            <Link
              href={`${process.env.REACT_APP_BE_URL}/invoices/CSV`}
              target="_blank"
              underline="none"
            >
              <Button variant="outlined" size="small" sx={{ width: "100%" }}>
                Export Invoices
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} md="auto" display={{ xs: "grid", md: "auto" }}>
            <Button
              variant="contained"
              size="small"
              sx={{ color: "secondary.light" }}
              onClick={() => setOpenAddInvoicePopup(true)}
            >
              Create Invoice
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              {tab === "all" && (
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              )}
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Customer
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Due
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Created
              </TableCell>
              {/* <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices
              .filter((invoice) => {
                switch (tab) {
                  case "all":
                    return true;
                  case "outstanding":
                    return invoice.status === "Outstanding";
                  case "past-due":
                    return invoice.status === "Past Due";
                  case "paid":
                    return invoice.status === "Paid";
                  default:
                    return true;
                }
              })
              .map((invoice) => (
                <TableRow
                  key={invoice.createdAt}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {`${
                      currencies.find((cur) => cur.value === invoice.currency)
                        ?.label
                    } ${invoice.amount}`}
                  </TableCell>
                  {tab === "all" && (
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        variant="outlined"
                        size="small"
                        color={
                          invoice.status === "Outstanding"
                            ? "info"
                            : invoice.status === "Past Due"
                            ? "error"
                            : invoice.status === "Paid"
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell align="right">{invoice.customerName}</TableCell>
                  <TableCell align="right">
                    {Boolean(Number(invoice.dueAt))
                      ? beautyDate(invoice.dueAt, true)
                      : "No Due Date"}
                  </TableCell>
                  <TableCell align="right">
                    {beautyDate(invoice.createdAt, false)}
                  </TableCell>
                  {/* <TableCell align="right">
                    <Button
                      variant="text"
                      // onClick={() => {
                      //   setEditInvoice({ ...invoice });
                      //   setOpenEditInvoicePopup(true);
                      // }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        fullWidth
        open={openAddInvoicePopup}
        onClose={() => setOpenAddInvoicePopup(false)}
      >
        <DialogTitle>Invoice Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="customer"
            label="Customer"
            type="text"
            select
            fullWidth
            error={!Boolean(newInvoice.customerEmail)}
            variant="standard"
            SelectProps={{
              native: true,
            }}
            value={newInvoice.customerEmail || "Select a customer"}
            onChange={(event) =>
              setNewInvoice({
                ...newInvoice,
                customerEmail:
                  customers.find(
                    (cust) => cust.customerEmail === event.target.value
                  )?.customerEmail || "",
                customerName:
                  customers.find(
                    (cust) => cust.customerEmail === event.target.value
                  )?.customerName || "",
              })
            }
          >
            <option key={null} value={undefined} selected>
              Select a customer
            </option>
            {customers
              .filter((cust) => !cust.archived)
              .map((customer) => (
                <option
                  key={customer.customerEmail}
                  value={customer.customerEmail}
                >
                  {customer.customerName}
                </option>
              ))}
          </TextField>
          {newInvoice.products.map((pr, index) => (
            <Grid sx={{ mt: 4, mb: 2 }}>
              <TextField
                key={pr.product}
                autoFocus
                margin="dense"
                id={`product_${index + 1}`}
                label={`Product_${index + 1}`}
                type="text"
                select
                fullWidth
                error={!Boolean(newInvoice.products[index].product)}
                variant="standard"
                SelectProps={{
                  native: true,
                }}
                value={newInvoice.products[index].product}
                onChange={(event) => {
                  const selectedProduct = event.target.value;

                  const invoicedProducts = newInvoice.products;
                  const product = products.find(
                    (pr) => pr.product === selectedProduct
                  );
                  const productIndex = invoicedProducts.findIndex(
                    (product) => product.product === pr.product
                  );
                  invoicedProducts[productIndex] = product
                    ? {
                        ...product,
                        quantity: invoicedProducts[productIndex].quantity,
                      }
                    : {
                        product: "",
                        productName: "",
                        currency: "",
                        price: 0,
                        quantity: 1,
                        archived: false,
                        recurring: "one-time",
                      };

                  setNewInvoice({
                    ...newInvoice,
                    products: invoicedProducts,
                  });
                }}
              >
                <option key={null} value={undefined}>
                  Select a product
                </option>
                {products
                  .filter((pr) => !pr.archived)
                  .filter(
                    (pr) =>
                      !newInvoice.products
                        .map((invPr) => invPr.product)
                        .includes(pr.product) ||
                      newInvoice.products[index].product === pr.product
                  )
                  .map((product) => (
                    <option key={product.product} value={product.product}>
                      {`${product.productName} - ${
                        currencies.find((cur) => cur.value === product.currency)
                          ?.label
                      } ${product.price}`}
                    </option>
                  ))}
              </TextField>
              {pr.recurring !== "one-time" && (
                <Alert severity="warning">
                  This is a reccuring product, but it will be charge once. Go to{" "}
                  <LinkRouter to="/subscriptions" style={{ color: "inherit" }}>
                    subscriptions
                  </LinkRouter>{" "}
                  to charge a reccuring product
                </Alert>
              )}
              <TextField
                margin="dense"
                id="quantity"
                label="Quantity"
                type="number"
                fullWidth
                disabled={!Boolean(newInvoice.products[index].productName)}
                variant="standard"
                value={newInvoice.products[index].quantity}
                onChange={(event) => {
                  const quantity = Number(event.target.value);
                  if (quantity > 0) {
                    const products = newInvoice.products;
                    const productIndex = products.findIndex(
                      (product) => product.product === pr.product
                    );
                    products[productIndex] = {
                      ...products[productIndex],
                      quantity,
                    };
                    setNewInvoice({
                      ...newInvoice,
                      products,
                    });
                  }
                }}
              />
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => {
                  const invoicedProducts = newInvoice.products;
                  invoicedProducts[index] = {
                    product: "",
                    productName: "",
                    currency: "",
                    price: 0,
                    quantity: 1,
                    archived: false,
                    recurring: "one-time",
                  };

                  setNewInvoice({
                    ...newInvoice,
                    products: invoicedProducts,
                  });
                }}
                sx={{ mr: 1 }}
              >
                Clear
              </Button>
              {newInvoice.products.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    const invoicedProducts = newInvoice.products;
                    invoicedProducts.splice(index, 1);

                    setNewInvoice({
                      ...newInvoice,
                      products: invoicedProducts,
                    });
                  }}
                  sx={{ mr: 1 }}
                >
                  Remove
                </Button>
              )}
            </Grid>
          ))}
          {newInvoice.products.length < products.length && (
            <Button
              variant="outlined"
              onClick={() =>
                setNewInvoice({
                  ...newInvoice,
                  products: [
                    ...newInvoice.products,
                    {
                      product: "",
                      productName: "",
                      currency: "",
                      price: 0,
                      quantity: 1,
                      archived: false,
                      recurring: "one-time",
                    },
                  ],
                })
              }
            >
              Add Product
            </Button>
          )}
          <Divider flexItem sx={{ mt: 2 }} />

          {newInvoice.dueAt !== 0 && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Due Date"
                value={new Date(Number(newInvoice.dueAt))}
                onChange={(newDate: Date | null) =>
                  newDate &&
                  setNewInvoice({
                    ...newInvoice,
                    dueAt: Date.parse(newDate.toString()),
                  })
                }
                renderInput={(params) => (
                  <TextField fullWidth sx={{ mt: 2 }} {...params} />
                )}
              />
            </LocalizationProvider>
          )}
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) =>
                  event.target.checked
                    ? setNewInvoice({
                        ...newInvoice,
                        dueAt: 0,
                      })
                    : setNewInvoice({
                        ...newInvoice,
                        dueAt: Date.parse(new Date().toString()),
                      })
                }
              />
            }
            label="No Due Date"
          />
          <TextField
            margin="dense"
            id="notes"
            label="Notes - This will be shown to your customer (optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            value={newInvoice.notes}
            onChange={(event) =>
              setNewInvoice({
                ...newInvoice,
                notes: event.target.value,
              })
            }
          />
          {newInvoice.products.length > 1 &&
          new Set(
            newInvoice.products
              .filter((pr) => pr.currency)
              .map((pr) => pr.currency)
          ).size !== 1 ? (
            <Alert severity="warning">
              All products must have the same currency
            </Alert>
          ) : (
            newInvoice.products[0].product && (
              <>
                <Typography sx={{ mt: 2 }}>Summary</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Product
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Qnt
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Cost
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {newInvoice.products
                        .filter((product) => product.product)
                        .map((product) => (
                          <TableRow
                            key={product.product}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {product.productName}
                            </TableCell>
                            <TableCell align="right">
                              {product.quantity}
                            </TableCell>
                            <TableCell align="right">{`${
                              currencies.find(
                                (cur) => cur.value === product.currency
                              )?.label
                            } ${product.price * product.quantity}`}</TableCell>
                          </TableRow>
                        ))}
                      <TableRow
                        key="Total"
                        sx={{
                          backgroundColor: "primary.200",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontWeight: "bold" }}
                        >
                          Total
                        </TableCell>
                        <TableCell align="right">
                          {newInvoice.products
                            .filter((product) => product.product)
                            .map((pr) => Number(pr.quantity))
                            .reduce((a, b) => a + b)}
                        </TableCell>
                        <TableCell align="right">
                          {`${
                            currencies.find(
                              (cur) =>
                                cur.value === newInvoice.products[0].currency
                            )?.label
                          } ${newInvoice.products
                            .filter((product) => product.product)
                            .map((pr) => {
                              return pr.price * pr.quantity;
                            })
                            .reduce((a, b) => a + b)}`}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setOpenAddInvoicePopup(false);
              setNewInvoice({
                amount: 0,
                currency: "",
                createdAt: 0,
                customerEmail: "",
                customerName: "",
                dueAt: Date.parse(Date().toString()),
                products: [
                  {
                    product: "",
                    productName: "",
                    currency: "",
                    price: 0,
                    quantity: 1,
                    archived: false,
                    recurring: "one-time",
                  },
                ],
                notes: "",
                paid: false,
                status: "",
              });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => addInvoice(true)}
          >
            Send Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Invoices;
