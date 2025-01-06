import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  FormControl,
  MenuItem,
  useTheme,
} from "@mui/material";

import Typography from "@mui/material/Typography";
import { Close, InformationVariant, Magnify, Reload } from "mdi-material-ui";

import { useSnackbar } from "notistack";

import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import { CastForEducation } from "@mui/icons-material";
import ListProducts from "./ListProducts";
import ListOrderProduct from "./ListOrderProduct";
import ListElementQuantity from "./ListElementQuantity";
import ListWarehouseQuantity from "./ListWarehouseQuantity";
import { useLocation } from "react-router-dom";
import MenuAnchorDetailsProduct from "./MenuAnchorDetailsProduct";
import Loader from "../../components/loader";

function ProductDetails() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [productOrders, setProductOrders] = useState([]);
  const [productPieces, setProductPieces] = useState([]);
  const [productWarehouses, setProductWarehouses] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Informations Générales");
  const [loading, setLoading] = useState(false);

  const productDetails = useSelector(
    (state) => state.productServices.productDetails
  );

  const allDetailsProduct = () => {
    const data = {
      id: location.state.productId,
      setLoading,
    };
    dispatch(actionCreator.getAllDetailsProduct(data));
  };

  useEffect(() => {
    if (location.state.productId) {
      setLoading(true);
      allDetailsProduct();
    }
  }, [location]);

  useEffect(() => {
    if (productDetails.product && productDetails.warehouses) {
      console.log(productDetails);
      setProduct({
        category: productDetails.product.category,
        createdAt: productDetails.product.createdAt,
        description: productDetails.product.description,
        id: productDetails.product.id,
        name: productDetails.product.name,
        piecesNumber: productDetails.product.piecesNumber,
        unit: productDetails.product.unit.unit,
        updatedAt: productDetails.product.updatedAt,
      });

      setProductOrders(productDetails.product.orders);

      setProductPieces(productDetails.product.pieces);

      setProductWarehouses(productDetails.warehouses);
    }
  }, [productDetails]);

  const handleSelectedItem = (item) => {
    setSelectedItem(item);
  };
  console.log(product);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MenuAnchorDetailsProduct
            handleSelectedItem={handleSelectedItem}
            selectedItem={selectedItem}
          />

          {selectedItem === "Informations Générales" && (
            <>
              <Typography
                sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}
              >
                Détail Produit
              </Typography>
              <Paper sx={{ width: "100%", p: 2 }}>
                <Grid container sx={{ p: 2 }} spacing={3}>
                  <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                      display: "flex",
                      gap: "20px",
                      flexDirection: "column",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Grid item xs={12} md={3}>
                        Nom du produit :
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <TextField
                          size="small"
                          fullWidth
                          value={product.name}
                          disabled
                          // onChange={handleChangeAttributeProduct('name')}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Grid item xs={12} md={3}>
                        Catégorie :
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <TextField
                          size="small"
                          fullWidth
                          value={product.category && product.category.name}
                          disabled
                          //onChange={handleChangeAttributeProduct('piecesNumber')}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                      display: "flex",
                      gap: "20px",
                      flexDirection: "column",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Grid item xs={12} md={3}>
                        Quantité:
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <TextField
                          size="small"
                          fullWidth
                          value={product.piecesNumber + " " + product.unit}
                          disabled
                          //onChange={handleChangeAttributeProduct('piecesNumber')}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Grid item xs={12} md={3}>
                        Description :
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <TextField
                          size="small"
                          fullWidth
                          multiline
                          minRows={3}
                          value={product.description}
                          disabled
                          //onChange={handleChangeAttributeProduct('description')}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}

          {selectedItem === "Commandes Lieés" && (
            <>
              <Typography
                sx={{
                  pt: 5,
                  pb: 1,
                  color: "#000",
                  fontWeight: "600",
                  textAlign: "start",
                }}
              >
                Commandes qui contient : {product.name}
              </Typography>
              <Paper sx={{ width: "100%", p: 2 }}>
                <ListOrderProduct productOrders={productOrders} />
              </Paper>
            </>
          )}

          {selectedItem === "Stock" && (
            <>
              <Typography
                sx={{
                  pt: 5,
                  pb: 1,
                  color: "#000",
                  fontWeight: "600",
                  textAlign: "start",
                }}
              >
                Stock du produit : {product.name}
              </Typography>
              <Paper sx={{ width: "100%", p: 2 }}>
                <ListElementQuantity
                  productPieces={productPieces}
                  allDetailsProduct={allDetailsProduct}
                />
              </Paper>

              <Typography
                sx={{
                  pt: 5,
                  pb: 1,
                  color: "#000",
                  fontWeight: "600",
                  textAlign: "start",
                }}
              >
                Repartition produit / entrepôt : {product.name}
              </Typography>
              <Paper sx={{ width: "50%", p: 2 }}>
                <ListWarehouseQuantity productWarehouses={productWarehouses} />
              </Paper>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProductDetails;
