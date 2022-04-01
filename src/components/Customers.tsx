import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReduxStoreType } from "../types/reduxTypes";
import { useSnackbar, VariantType } from "notistack";

import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { CustomerType } from "../types/app";
import refreshToken from "../api/post/refreshToken";
import getCustomers from "../api/get/getCustomers";
import createCustomer from "../api/post/createCustomer";
import archiveCustomer from "../api/put/archiveCustomer";
import updateCustomer from "../api/put/updateCustomer";

const Customers = () => {
  const [openAddCustomerPopup, setOpenAddCustomerPopup] = useState(false);
  const [openEditCustomerPopup, setOpenEditCustomerPopup] = useState(false);
  const [openArchivePopup, setOpenArchivePopup] = useState(false);
  const [newCustomer, setNewCustomer] = useState<CustomerType>({
    customerEmail: "",
    customerName: "",
    email: "",
    description: "",
    archived: false,
  });
  const [editCustomer, setEditCustomer] = useState<CustomerType>({
    customerEmail: "",
    customerName: "",
    email: "",
    description: "",
    archived: false,
  });
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [tab, setTab] = useState("available");

  const user = useSelector((state: ReduxStoreType) => state.user);

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

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

  const addCustomer = async (retry: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const createdCustomer: CustomerType = await createCustomer(newCustomer);
      setCustomers([...customers, createdCustomer]);
      setOpenAddCustomerPopup(false);
      setNewCustomer({
        customerEmail: "",
        customerName: "",
        email: "",
        description: "",
        archived: false,
      });
      throwNewSnackbar("success", "Saved!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await addCustomer(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to save customer");
        }
      } else {
        throwNewSnackbar("error", "Failed to save customer");
      }
    }
  };

  const saveCustomer = async (retry: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const updatedCustomer: CustomerType = await updateCustomer(editCustomer);
      setCustomers([
        ...customers.filter(
          (customer) => customer.customerEmail !== editCustomer.customerEmail
        ),
        updatedCustomer,
      ]);
      setOpenEditCustomerPopup(false);
      setEditCustomer({
        customerEmail: "",
        customerName: "",
        email: "",
        description: "",
        archived: false,
      });
      throwNewSnackbar("success", "Saved!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await saveCustomer(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to update customer");
        }
      } else {
        throwNewSnackbar("error", "Failed to update customer");
      }
    }
  };

  const handleArchiveCustomer = async (retry: boolean, archive: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const updatedCustomer = await archiveCustomer(
        editCustomer.customerEmail,
        archive
      );
      setCustomers([
        ...customers.filter(
          (customer) => customer.customerEmail !== editCustomer.customerEmail
        ),
        updatedCustomer,
      ]);
      setOpenEditCustomerPopup(false);
      setOpenArchivePopup(false);
      setEditCustomer({
        customerEmail: "",
        customerName: "",
        email: "",
        description: "",
        archived: false,
      });
      throwNewSnackbar("success", archive ? "Archived!" : "Made Available!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await handleArchiveCustomer(false, archive);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to archive customer");
        }
      } else {
        throwNewSnackbar("error", "Failed to archive customer");
      }
    }
  };

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  useEffect(() => void loadCustomers(true), []);

  return (
    <Container maxWidth="xl">
      <Grid
        container
        flexDirection={{ xs: "column-reverse", sm: "unset" }}
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid sx={{ my: 2 }}>
          <Tabs
            value={tab}
            onChange={(event: React.SyntheticEvent, newValue: string) => {
              setTab(newValue);
            }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value="available" label="Available" />
            <Tab value="archived" label="Archived" />
          </Tabs>
        </Grid>
        <Grid
          item
          container
          flexDirection={{ xs: "column-reverse", sm: "unset" }}
          justifyContent={{ xs: "center", sm: "flex-end" }}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2 }}
          sx={{ my: 2 }}
        >
          <Grid item xs={12} sm="auto" display={{ xs: "grid", sm: "auto" }}>
            <Link
              href={`${process.env.REACT_APP_BE_URL}/customers/CSV`}
              target="_blank"
              underline="none"
            >
              <Button variant="outlined" size="small" sx={{ width: "100%" }}>
                Export Customers
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm="auto" display={{ xs: "grid", sm: "auto" }}>
            <Button
              variant="contained"
              size="small"
              sx={{ color: "secondary.light" }}
              onClick={() => setOpenAddCustomerPopup(true)}
            >
              Add Customer
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers
              .filter((customer) =>
                tab === "available" ? !customer.archived : customer.archived
              )
              .map((customer) => (
                <TableRow
                  key={customer.customerEmail}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {customer.customerName}
                  </TableCell>
                  <TableCell align="right">{customer.email}</TableCell>
                  <TableCell align="right">
                    {customer.description.length > 20
                      ? customer.description.slice(0, 17) + "..."
                      : customer.description}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditCustomer({ ...customer });
                        setOpenEditCustomerPopup(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openAddCustomerPopup}
        onClose={() => setOpenAddCustomerPopup(false)}
      >
        <DialogTitle>Customer Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Customer Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCustomer.customerName}
            onChange={(event) =>
              setNewCustomer({
                ...newCustomer,
                customerName: event.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newCustomer.email}
            onChange={(event) =>
              setNewCustomer({
                ...newCustomer,
                email: event.target.value,
              })
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            value={newCustomer.description}
            onChange={(event) =>
              setNewCustomer({
                ...newCustomer,
                description: event.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setOpenAddCustomerPopup(false);
              setNewCustomer({
                customerEmail: "",
                customerName: "",
                email: "",
                description: "",
                archived: false,
              });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => addCustomer(true)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditCustomerPopup}
        onClose={() => setOpenEditCustomerPopup(false)}
      >
        <DialogTitle>Edit Customer Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Customer Name"
            type="text"
            fullWidth
            variant="standard"
            value={editCustomer.customerName}
            onChange={(event) =>
              setEditCustomer({
                ...editCustomer,
                customerName: event.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={editCustomer.email}
            onChange={(event) =>
              setEditCustomer({
                ...editCustomer,
                email: event.target.value,
              })
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            value={editCustomer.description}
            onChange={(event) =>
              setEditCustomer({
                ...editCustomer,
                description: event.target.value,
              })
            }
          />
        </DialogContent>
        <Box display="flex" justifyContent="space-between">
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                editCustomer.archived
                  ? handleArchiveCustomer(true, false)
                  : setOpenArchivePopup(true)
              }
            >
              {editCustomer.archived ? "Make Available" : "Archive"}
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              color="error"
              onClick={() => {
                setOpenEditCustomerPopup(false);
                setEditCustomer({
                  customerEmail: "",
                  customerName: "",
                  email: "",
                  description: "",
                  archived: false,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => saveCustomer(true)}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={openArchivePopup}
        onClose={() => setOpenArchivePopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Archive Customer</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By archiving this customer, you will not be able to charge them and
            all the active subscriptions will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpenArchivePopup(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleArchiveCustomer(true, true)}
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Customers;
