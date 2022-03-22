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
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
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
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import DatePicker from "@mui/lab/DatePicker";

import { SubscriptionType, CustomerType, ProductType } from "../types/app";
import refreshToken from "../api/post/refreshToken";
// import getSubscriptions from "../api/get/getSubscriptions";
import currencies from "../tools/currencies";
import getProducts from "../api/get/getProducts";
import getCustomers from "../api/get/getCustomers";
import createSubscription from "../api/post/createSubscription";
import getSubscriptions from "../api/get/getSubscriptions";
import updateSubscription from "../api/put/updateSubscription";
// import createSubscription from "../api/post/createSubscription";

const Subscriptions = () => {
  const [openAddSubscriptionPopup, setOpenAddSubscriptionPopup] =
    useState(false);
  const [openEditSubscriptionPopup, setOpenEditSubscriptionPopup] =
    useState(false);
  const [newSubscription, setNewSubscription] = useState<SubscriptionType>({
    amount: 0,
    currency: "",
    createdAt: 0,
    customerEmail: "",
    customerName: "",
    startAt: Date.parse(Date().toString()),
    freeTrialDays: 0,
    recurringEveryDays: 0,
    nextInvoiceAt: Date.parse(Date().toString()),
    endAt: Date.parse(Date().toString()),
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
    status: "",
    canceled: false,
  });
  const [editSubscription, setEditSubscription] = useState<SubscriptionType>({
    amount: 0,
    currency: "",
    createdAt: 0,
    customerEmail: "",
    customerName: "",
    startAt: Date.parse(Date().toString()),
    freeTrialDays: 0,
    recurringEveryDays: 0,
    nextInvoiceAt: Date.parse(Date().toString()),
    endAt: Date.parse(Date().toString()),
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
    status: "",
    canceled: false,
  });
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [tab, setTab] = useState("current");

  const user = useSelector((state: ReduxStoreType) => state.user);

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

  const loadSubscriptions = async (retry: boolean) => {
    try {
      const subscriptions = await getSubscriptions();
      setSubscriptions(subscriptions);
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await loadSubscriptions(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to load subscriptions");
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

  const addSubscription = async (retry: boolean) => {
    try {
      if (newSubscription.customerEmail === "") {
        throwNewSnackbar("warning", "No customer selected");
      } else if (newSubscription.products.length === 0) {
        throwNewSnackbar("warning", "No products selected");
      } else if (
        newSubscription.products
          .map((pr: ProductType) => pr.product)
          .includes("")
      ) {
        throwNewSnackbar(
          "warning",
          "You can not subscription an empty product"
        );
      } else if (
        new Set(
          newSubscription.products
            // .filter((pr: ProductType) => pr.currency)
            .map((pr: ProductType) => pr.currency)
        ).size !== 1
      ) {
        throwNewSnackbar(
          "warning",
          "All products should have the same currency"
        );
      } else if (
        new Set(
          newSubscription.products
            // .filter((pr: ProductType) => pr.recurring)
            .map((pr: ProductType) => pr.recurring)
        ).size !== 1
      ) {
        throwNewSnackbar(
          "warning",
          "All products should have the same recurring period"
        );
      } else {
        throwNewSnackbar("info", "Saving...");
        const createdSubscription: SubscriptionType = await createSubscription(
          newSubscription
        );
        setSubscriptions([...subscriptions, createdSubscription]);
        setOpenAddSubscriptionPopup(false);
        setNewSubscription({
          amount: 0,
          currency: "",
          createdAt: 0,
          customerEmail: "",
          customerName: "",
          startAt: Date.parse(Date().toString()),
          freeTrialDays: 0,
          recurringEveryDays: 0,
          nextInvoiceAt: Date.parse(Date().toString()),
          endAt: Date.parse(Date().toString()),
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
          status: "",
          canceled: false,
        });
        throwNewSnackbar("success", "Saved!");
      }
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await addSubscription(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to create subscription");
        }
      } else {
        throwNewSnackbar("error", "Failed to create subscription");
      }
    }
  };

  const saveSubscription = async (retry: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const updatedSubscription: SubscriptionType = await updateSubscription(
        editSubscription
      );
      setSubscriptions([
        ...subscriptions.filter(
          (sub) => sub.createdAt !== editSubscription.createdAt
        ),
        updatedSubscription,
      ]);
      setOpenEditSubscriptionPopup(false);
      setEditSubscription({
        amount: 0,
        currency: "",
        createdAt: 0,
        customerEmail: "",
        customerName: "",
        startAt: Date.parse(Date().toString()),
        freeTrialDays: 0,
        recurringEveryDays: 0,
        nextInvoiceAt: Date.parse(Date().toString()),
        endAt: Date.parse(Date().toString()),
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
        status: "",
        canceled: false,
      });
      throwNewSnackbar("success", "Saved!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await saveSubscription(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to update product");
        }
      } else {
        throwNewSnackbar("error", "Failed to update product");
      }
    }
  };

  const handleCancelSubscription = async (retry: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const updatedSubscription: SubscriptionType = await updateSubscription({
        ...editSubscription,
        canceled: true,
      });
      setSubscriptions([
        ...subscriptions.filter(
          (sub) => sub.createdAt !== editSubscription.createdAt
        ),
        updatedSubscription,
      ]);
      setOpenEditSubscriptionPopup(false);
      setEditSubscription({
        amount: 0,
        currency: "",
        createdAt: 0,
        customerEmail: "",
        customerName: "",
        startAt: Date.parse(Date().toString()),
        freeTrialDays: 0,
        recurringEveryDays: 0,
        nextInvoiceAt: Date.parse(Date().toString()),
        endAt: Date.parse(Date().toString()),
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
        status: "",
        canceled: false,
      });
      throwNewSnackbar("success", "Saved!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await saveSubscription(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to update product");
        }
      } else {
        throwNewSnackbar("error", "Failed to update product");
      }
    }
  };

  const beautyDate = (date: number) => {
    const datetime = new Date(Number(date));
    const dateStrArr = datetime.toString().split(" ");
    return `${dateStrArr[2]} ${dateStrArr[1]} ${dateStrArr[3]}`;
  };

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  useEffect(() => {
    loadSubscriptions(true);
    loadProducts(true);
    loadCustomers(true);
  }, []);

  useEffect(() => {
    if (openAddSubscriptionPopup) {
      loadProducts(true);
      loadCustomers(true);
    }
  }, [openAddSubscriptionPopup]);

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
            <Tab value="current" label="Current" />
            <Tab value="scheduled" label="Scheduled" />
            <Tab value="canceled" label="Canceled" />
            <Tab value="completed" label="Completed" />
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
              href={`${process.env.REACT_APP_BE_URL}/subscriptions/CSV`}
              target="_blank"
              underline="none"
            >
              <Button variant="outlined" size="small" sx={{ width: "100%" }}>
                Export Subscriptions
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} md="auto" display={{ xs: "grid", md: "auto" }}>
            <Button
              variant="contained"
              size="small"
              sx={{ color: "secondary.light" }}
              onClick={() => setOpenAddSubscriptionPopup(true)}
            >
              Create Subscription
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Customer
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Ends
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Created
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions
              .filter((subscription) => {
                switch (tab) {
                  case "current":
                    return subscription.status === "Current";
                  case "scheduled":
                    return subscription.status === "Scheduled";
                  case "canceled":
                    return subscription.status === "Canceled";
                  case "completed":
                    return subscription.status === "Completed";
                  default:
                    return true;
                }
              })
              .map((subscription) => (
                <TableRow
                  key={subscription.createdAt}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {`${
                      currencies.find(
                        (cur) => cur.value === subscription.currency
                      )?.label
                    } ${subscription.amount}`}
                  </TableCell>
                  <TableCell align="right">{subscription.status}</TableCell>
                  <TableCell align="right">
                    {subscription.customerName}
                  </TableCell>
                  <TableCell align="right">
                    {Number(subscription.endAt) !== 0
                      ? beautyDate(subscription.endAt)
                      : "Forever"}
                  </TableCell>
                  <TableCell align="right">
                    {beautyDate(subscription.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditSubscription({ ...subscription });
                        setOpenEditSubscriptionPopup(true);
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
        fullWidth
        open={openAddSubscriptionPopup}
        onClose={() => setOpenAddSubscriptionPopup(false)}
      >
        <DialogTitle>Subscription Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="customer"
            label="Customer"
            type="text"
            select
            fullWidth
            error={!Boolean(newSubscription.customerEmail)}
            variant="standard"
            SelectProps={{
              native: true,
            }}
            value={newSubscription.customerEmail || "Select a customer"}
            onChange={(event) =>
              setNewSubscription({
                ...newSubscription,
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
          {newSubscription.products.map((pr, index) => (
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
                error={!Boolean(newSubscription.products[index].product)}
                variant="standard"
                SelectProps={{
                  native: true,
                }}
                value={newSubscription.products[index].product}
                onChange={(event) => {
                  const selectedProduct = event.target.value;

                  const subscribedProducts = newSubscription.products;
                  const product = products.find(
                    (pr) => pr.product === selectedProduct
                  );
                  const productIndex = subscribedProducts.findIndex(
                    (product) => product.product === pr.product
                  );
                  subscribedProducts[productIndex] = product
                    ? {
                        ...product,
                        quantity: subscribedProducts[productIndex].quantity,
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

                  setNewSubscription({
                    ...newSubscription,
                    products: subscribedProducts,
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
                      !newSubscription.products
                        .map((invPr) => invPr.product)
                        .includes(pr.product) ||
                      newSubscription.products[index].product === pr.product
                  )
                  .map((product) => (
                    <option key={product.product} value={product.product}>
                      {`${product.productName} - ${
                        currencies.find((cur) => cur.value === product.currency)
                          ?.label
                      } ${product.price}/${product.recurring}`}
                    </option>
                  ))}
              </TextField>
              {pr.product !== "" && pr.recurring === "one-time" && (
                <Alert severity="warning">
                  This is a one time product, so it can not be charged as a
                  recurring one. Go to{" "}
                  <LinkRouter to="/invoices" style={{ color: "inherit" }}>
                    invoices
                  </LinkRouter>{" "}
                  to create an simple invoice
                </Alert>
              )}
              <TextField
                margin="dense"
                id="quantity"
                label="Quantity"
                type="number"
                fullWidth
                disabled={!Boolean(newSubscription.products[index].productName)}
                variant="standard"
                value={newSubscription.products[index].quantity}
                onChange={(event) => {
                  const quantity = Number(event.target.value);
                  if (quantity > 0) {
                    const products = newSubscription.products;
                    const productIndex = products.findIndex(
                      (product) => product.product === pr.product
                    );
                    products[productIndex] = {
                      ...products[productIndex],
                      quantity,
                    };
                    setNewSubscription({
                      ...newSubscription,
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
                  const subscribedProducts = newSubscription.products;
                  subscribedProducts[index] = {
                    product: "",
                    productName: "",
                    currency: "",
                    price: 0,
                    quantity: 1,
                    archived: false,
                    recurring: "one-time",
                  };

                  setNewSubscription({
                    ...newSubscription,
                    products: subscribedProducts,
                  });
                }}
                sx={{ mr: 1 }}
              >
                Clear
              </Button>
              {newSubscription.products.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    const subscribedProducts = newSubscription.products;
                    subscribedProducts.splice(index, 1);

                    setNewSubscription({
                      ...newSubscription,
                      products: subscribedProducts,
                    });
                  }}
                  sx={{ mr: 1 }}
                >
                  Remove
                </Button>
              )}
            </Grid>
          ))}
          {newSubscription.products.length < products.length && (
            <Button
              variant="outlined"
              onClick={() =>
                setNewSubscription({
                  ...newSubscription,
                  products: [
                    ...newSubscription.products,
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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={new Date(Number(newSubscription.startAt))}
              onChange={(newDate: Date | null) =>
                newDate &&
                setNewSubscription({
                  ...newSubscription,
                  startAt: Date.parse(newDate.toString()),
                })
              }
              renderInput={(params) => (
                <TextField fullWidth sx={{ mt: 2 }} {...params} />
              )}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            id="freeTrialDays"
            label="Free Trial Days"
            type="number"
            fullWidth
            variant="standard"
            value={newSubscription.freeTrialDays}
            onChange={(event) =>
              Number(event.target.value) >= 0 &&
              setNewSubscription({
                ...newSubscription,
                freeTrialDays: Number(event.target.value),
              })
            }
          />
          {newSubscription.endAt !== 0 && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={new Date(Number(newSubscription.endAt))}
                onChange={(newDate: Date | null) =>
                  newDate &&
                  setNewSubscription({
                    ...newSubscription,
                    endAt: Date.parse(newDate.toString()),
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
                    ? setNewSubscription({
                        ...newSubscription,
                        endAt: 0,
                      })
                    : setNewSubscription({
                        ...newSubscription,
                        endAt: Date.parse(new Date().toString()),
                      })
                }
              />
            }
            label="No End Date"
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
            value={newSubscription.notes}
            onChange={(event) =>
              setNewSubscription({
                ...newSubscription,
                notes: event.target.value,
              })
            }
          />
          {newSubscription.products.length > 1 &&
          new Set(
            newSubscription.products
              // .filter((pr) => pr.currency)
              .map((pr) => pr.currency)
          ).size !== 1 ? (
            <Alert severity="warning">
              All products must have the same currency
            </Alert>
          ) : new Set(
              newSubscription.products
                // .filter((pr) => pr.recurring)
                .map((pr) => pr.recurring)
            ).size !== 1 ? (
            <Alert severity="warning">
              All products must have the same recurring period
            </Alert>
          ) : (
            newSubscription.products[0].product && (
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
                      {newSubscription.products
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
                          {newSubscription.products
                            .filter((product) => product.product)
                            .map((pr) => Number(pr.quantity))
                            .reduce((a, b) => a + b)}
                        </TableCell>
                        <TableCell align="right">
                          {`${
                            currencies.find(
                              (cur) =>
                                cur.value ===
                                newSubscription.products[0].currency
                            )?.label
                          } ${newSubscription.products
                            .filter((product) => product.product)
                            .map((pr) => {
                              return pr.price * pr.quantity;
                            })
                            .reduce((a, b) => a + b)}/${
                            newSubscription.products[0].recurring
                          }`}
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
              setOpenAddSubscriptionPopup(false);
              setNewSubscription({
                amount: 0,
                currency: "",
                createdAt: 0,
                customerEmail: "",
                customerName: "",
                startAt: Date.parse(Date().toString()),
                freeTrialDays: 0,
                recurringEveryDays: 0,
                nextInvoiceAt: Date.parse(Date().toString()),
                endAt: Date.parse(Date().toString()),
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
                status: "",
                canceled: false,
              });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => addSubscription(true)}
          >
            Create Subscription
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditSubscriptionPopup}
        onClose={() => setOpenEditSubscriptionPopup(false)}
      >
        <DialogTitle>Edit Subscription Information</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={new Date(Number(editSubscription.endAt))}
              onChange={(newDate: Date | null) => {
                if (newDate) {
                  const endAt =
                    Date.parse(newDate.toString()) > editSubscription.endAt
                      ? Date.parse(newDate.toString())
                      : editSubscription.endAt;

                  setEditSubscription({
                    ...editSubscription,
                    endAt,
                  });
                }
              }}
              renderInput={(params) => (
                <TextField fullWidth sx={{ mt: 2 }} {...params} />
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <Box display="flex" justifyContent="space-between">
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              disabled={editSubscription.canceled}
              onClick={() =>
                !editSubscription.canceled && handleCancelSubscription(true)
              }
            >
              {!editSubscription.canceled
                ? "Cancel Subscription"
                : "Subscription Canceled"}
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              color="error"
              onClick={() => {
                setOpenEditSubscriptionPopup(false);
                setEditSubscription({
                  amount: 0,
                  currency: "",
                  createdAt: 0,
                  customerEmail: "",
                  customerName: "",
                  startAt: Date.parse(Date().toString()),
                  freeTrialDays: 0,
                  recurringEveryDays: 0,
                  nextInvoiceAt: Date.parse(Date().toString()),
                  endAt: Date.parse(Date().toString()),
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
                  status: "",
                  canceled: false,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => saveSubscription(true)}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Subscriptions;
