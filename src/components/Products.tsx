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

import { ProductType } from "../types/app";
import currencies from "../tools/currencies";
import recurring from "../tools/recurring";
import refreshToken from "../api/post/refreshToken";
import createProduct from "../api/post/createProduct";
import getProducts from "../api/get/getProducts";
import updateProduct from "../api/put/updateProduct";
import archiveProduct from "../api/put/archiveProduct";

const Products = () => {
  const [openAddProductPopup, setOpenAddProductPopup] = useState(false);
  const [openEditProductPopup, setOpenEditProductPopup] = useState(false);
  const [openArchivePopup, setOpenArchivePopup] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductType>({
    product: "",
    productName: "",
    price: 0,
    currency: "usd",
    recurring: "one-time",
    archived: false,
  });
  const [editProduct, setEditProduct] = useState<ProductType>({
    product: "",
    productName: "",
    price: 0,
    currency: "usd",
    recurring: "one-time",
    archived: false,
  });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [tab, setTab] = useState("available");

  const user = useSelector((state: ReduxStoreType) => state.user);

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

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

  const addProduct = async (retry: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const createdProduct: ProductType = await createProduct(newProduct);
      setProducts([...products, createdProduct]);
      setOpenAddProductPopup(false);
      setNewProduct({
        product: "",
        productName: "",
        price: 0,
        currency: "usd",
        recurring: "one-time",
        archived: false,
      });
      throwNewSnackbar("success", "Saved!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await addProduct(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to save profile");
        }
      } else {
        throwNewSnackbar("error", "Failed to save profile");
      }
    }
  };

  const saveProduct = async (retry: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const updatedProduct: ProductType = await updateProduct(editProduct);
      setProducts([
        ...products.filter((pr) => pr.product !== editProduct.product),
        updatedProduct,
      ]);
      setOpenEditProductPopup(false);
      setEditProduct({
        product: "",
        productName: "",
        price: 0,
        currency: "usd",
        recurring: "one-time",
        archived: false,
      });
      throwNewSnackbar("success", "Saved!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await saveProduct(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to update product");
        }
      } else {
        throwNewSnackbar("error", "Failed to update product");
      }
    }
  };

  const handleArchiveProduct = async (retry: boolean, archive: boolean) => {
    try {
      throwNewSnackbar("info", "Saving...");
      const updatedProduct = await archiveProduct(editProduct.product, archive);
      setProducts([
        ...products.filter((pr) => pr.product !== editProduct.product),
        updatedProduct,
      ]);
      setOpenEditProductPopup(false);
      setOpenArchivePopup(false);
      setEditProduct({
        product: "",
        productName: "",
        price: 0,
        currency: "usd",
        recurring: "one-time",
        archived: false,
      });
      throwNewSnackbar("success", "Archived!");
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await handleArchiveProduct(false, archive);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to archive product");
        }
      } else {
        throwNewSnackbar("error", "Failed to archive product");
      }
    }
  };

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  useEffect(() => void loadProducts(true), []);

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
              href={`${process.env.REACT_APP_BE_URL}/products/CSV`}
              target="_blank"
              underline="none"
            >
              <Button variant="outlined" size="small" sx={{ width: "100%" }}>
                Export Products
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm="auto" display={{ xs: "grid", sm: "auto" }}>
            <Button
              variant="contained"
              size="small"
              sx={{ color: "secondary.light" }}
              onClick={() => setOpenAddProductPopup(true)}
            >
              Add Product
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
                Price
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Currency
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Recurring
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .filter((product) =>
                tab === "available" ? !product.archived : product.archived
              )
              .map((product) => (
                <TableRow
                  key={product.productName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {product.productName}
                  </TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">
                    {
                      currencies.find((cur) => cur.value === product.currency)
                        ?.label
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      recurring.find((rec) => rec.value === product.recurring)
                        ?.label
                    }
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditProduct({ ...product });
                        setOpenEditProductPopup(true);
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
        open={openAddProductPopup}
        onClose={() => setOpenAddProductPopup(false)}
      >
        <DialogTitle>Product Information</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product Name"
            type="name"
            fullWidth
            variant="standard"
            value={newProduct.productName}
            onChange={(event) =>
              setNewProduct({ ...newProduct, productName: event.target.value })
            }
          />
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            value={newProduct.price}
            onChange={(event) =>
              setNewProduct({
                ...newProduct,
                price: Number(event.target.value),
              })
            }
          />
          <TextField
            margin="dense"
            id="currency"
            label="Currency"
            select
            fullWidth
            variant="standard"
            SelectProps={{
              native: true,
            }}
            value={newProduct.currency}
            onChange={(event) =>
              setNewProduct({
                ...newProduct,
                currency: event.target.value,
              })
            }
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            id="recurring"
            label="Recurring"
            select
            fullWidth
            variant="standard"
            SelectProps={{
              native: true,
            }}
            value={newProduct.recurring}
            onChange={(event) =>
              setNewProduct({ ...newProduct, recurring: event.target.value })
            }
          >
            {recurring.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setOpenAddProductPopup(false);
              setNewProduct({
                product: "",
                productName: "",
                price: 0,
                currency: "usd",
                recurring: "one-time",
                archived: false,
              });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => addProduct(true)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditProductPopup}
        onClose={() => setOpenEditProductPopup(false)}
      >
        <DialogTitle>Edit Product Information</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product Name"
            type="name"
            fullWidth
            variant="standard"
            value={editProduct.productName}
            onChange={(event) =>
              setEditProduct({
                ...editProduct,
                productName: event.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            value={editProduct.price}
            onChange={(event) =>
              setEditProduct({
                ...editProduct,
                price: Number(event.target.value),
              })
            }
          />
          <TextField
            margin="dense"
            id="currency"
            label="Currency"
            select
            fullWidth
            variant="standard"
            SelectProps={{
              native: true,
            }}
            value={editProduct.currency}
            onChange={(event) =>
              setEditProduct({
                ...editProduct,
                currency: event.target.value,
              })
            }
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            id="recurring"
            label="Recurring"
            select
            fullWidth
            variant="standard"
            SelectProps={{
              native: true,
            }}
            value={editProduct.recurring}
            onChange={(event) =>
              setEditProduct({ ...editProduct, recurring: event.target.value })
            }
          >
            {recurring.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <Box display="flex" justifyContent="space-between">
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                editProduct.archived
                  ? handleArchiveProduct(true, false)
                  : setOpenArchivePopup(true)
              }
            >
              {editProduct.archived ? "Make Available" : "Archive"}
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              color="error"
              onClick={() => {
                setOpenEditProductPopup(false);
                setEditProduct({
                  product: "",
                  productName: "",
                  price: 0,
                  currency: "usd",
                  recurring: "one-time",
                  archived: false,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => saveProduct(true)}
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
        <DialogTitle id="alert-dialog-title">Archive Product</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By archiving this product, you will not be able to charge your
            customers with it and all the active subscriptions will be lost.
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
            onClick={() => handleArchiveProduct(true, true)}
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products;
