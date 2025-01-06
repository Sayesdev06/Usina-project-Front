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

import { useSnackbar } from "notistack";

import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import { Close, Reload } from "mdi-material-ui";
import { CastForEducation } from "@mui/icons-material";
import ListProducts from "./ListProducts";
import { Navigate, useNavigate } from "react-router-dom";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../../components/loader";

// multi select
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Products = (props) => {
  const { arrayAllProduct, arrayAllCatgories, arrayAllUnits } = props;

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [openModalAddProduct, setopenModalAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(false);

  const [loading, setLoading] = useState(false);
  const [attributeProductSearch, setAttributeProductSearch] = useState({
    name: "",
    categoryId: "",
  });
  const [attributeProduct, setAttributeProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    unitId: null,
    piecesNumber: 0,
  });

  const handleChangeAttributeProduct = (prop) => (event) => {
    setAttributeProduct({ ...attributeProduct, [prop]: event.target.value });
  };

  // const handleChangeAttributeProductArrays = (prop, valArray, val) => event => {

  //   if (attributeProduct.unitIds.includes(val.id)) {
  //     let arrayIds = attributeProduct.unitIds
  //     arrayIds = arrayIds.filter(id => id !== val.id)
  //     setAttributeProduct({ ...attributeProduct, [prop]: arrayIds })
  //   } else {
  //     setAttributeProduct({ ...attributeProduct, [prop]: [...valArray, val.id] })
  //   }
  // }

  const handleChangeAttributeProductSearch = (prop) => (event) => {
    setAttributeProductSearch({
      ...attributeProductSearch,
      [prop]: event.target.value,
    });
  };

  useEffect(() => {
    setLoading(true);
    getAllProduct();
    props.getAllUnits();
    props.getAllCategorys();
  }, []);

  const getAllProduct = () => {
    const data = {
      ...attributeProductSearch,
      setLoading,
    };
    props.searchProduct(data);
  };

  const onOpenModalAddProduct = () => {
    setopenModalAddProduct(true);
  };

  const onCloseModalAddProduct = () => {
    setopenModalAddProduct(false);
    setAttributeProduct({
      name: "",
      description: "",
      categoryId: "",
      unitId: [],
      piecesNumber: 0,
    });
    // setListCategories([]);
  };

  const addProduct = () => {
    const data = {
      name: attributeProduct.name,
      description: attributeProduct.description,
      categoryId: attributeProduct.categoryId,
      unitId: attributeProduct.unitId,
      piecesNumber: attributeProduct.piecesNumber,
      afterSave: () => {
        afterSave();
      },
      onCloseModalAddProduct: () => {
        onCloseModalAddProduct();
      },
      getAllProduct: () => {
        getAllProduct();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    if (
      !attributeProduct.name ||
      !attributeProduct.description ||
      !attributeProduct.unitId ||
      !attributeProduct.categoryId
    ) {
      let variant = "warning";
      enqueueSnackbar("Tous les champs sont obligatoire!", { variant });
    } else props.createProduct(data);
  };

  const getDetailsProduct = (id) => {
    const data = {
      id: id,
      attributeProduct: (val) => setAttributeProduct(val),
      // listCategories: (val) => setListCategories(val),
    };
    props.getDetailsProduct(data);
  };

  const onOpenModalUpdateProduct = (details) => {
    getDetailsProduct(details.id);
    setEditProduct(true);
    setopenModalAddProduct(true);
  };

  const goToDetailsAndUpdateProduct = (product) => {
    navigate("/details-produit", {
      state: {
        productId: product.id,
      },
    });
  };

  const onUpdateProduct = () => {
    const data = {
      id: attributeProduct.id,
      name: attributeProduct.name,
      description: attributeProduct.description,
      categoryId: attributeProduct.categoryId,
      unitId: attributeProduct.unitId,
      piecesNumber: attributeProduct.piecesNumber,
      afterSave: () => {
        afterSave();
      },
      onCloseModalAddProduct: () => {
        onCloseModalAddProduct();
      },
      getAllProduct: () => {
        getAllProduct();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    if (
      !attributeProduct.name ||
      !attributeProduct.description ||
      !attributeProduct.unitId ||
      !attributeProduct.categoryId
    ) {
      let variant = "warning";
      enqueueSnackbar("Tous les champs sont obligatoire!", { variant });
    } else props.EditProduct(data);
  };

  const onDeleteProduct = (row) => {
    const data = {
      id: row.id,
      getAllProduct: () => {
        getAllProduct();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    props.deleteProduct(data);
  };

  // const showDetailsTiers = (details) => {
  //   getDetailsProduct(details.id);
  //   setShowDetails(true);
  //   setopenModalAddProduct(true);
  // };

  const afterSave = () => {
    setAttributeProduct({
      name: "",
      description: "",
      categoryId: "",
      unitId: "",
      piecesNumber: 0,
    });
    // setListCategories([]);
    setEditProduct(false);
  };

  const theme = useTheme();
  // const [listCategories, setListCategories] = useState([]);

  const handleChange = (event) => {
    setAttributeProduct({
      ...attributeProduct,
      categoryId: event.target.value,
    });
  };

  const onReload = () => {
    setAttributeProductSearch({
      name: "",
      categoryId: "",
    });
    const data = {
      name: "",
      categoryId: "",
    };

    props.searchProduct(data);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography
            className="color-title"
            sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3, mb: 4 }}
          >
            Gestion des Produits{" "}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <Grid container sx={{ p: 2 }} spacing={3}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Nom :
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Nom"
                    value={attributeProductSearch.name}
                    onChange={handleChangeAttributeProductSearch("name")}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* getAllCategorys */}
                  Categories :
                  <FormControl size="small" fullWidth>
                    <Select
                      defaultValue=""
                      id="form-layouts-separator-select"
                      labelId="form-layouts-separator-select-label"
                      onChange={handleChangeAttributeProductSearch(
                        "categoryId"
                      )}
                    >
                      {arrayAllCatgories.map((category, key) => (
                        <MenuItem value={category.id} key={key}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} sx={{ textAlign: "end" }}>
                  <Button
                    onClick={() => getAllProduct()}
                    sx={{
                      color: "black",
                      backgroundColor: "#9155fd !important",
                      marginRight: "30px",
                    }}
                  >
                    Chercher
                  </Button>
                  <CachedIcon
                    className="color-orange pointer"
                    onClick={() => onReload()}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
          <Box sx={{ width: "100%", mt: 3 }}>
            <Grid
              item
              className="flex-Box"
              sx={{ flex: "1 1 100%", mb: 2, justifyContent: "space-between" }}
            >
              <div className="d-flex">
                <Typography
                  className="color-title"
                  sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
                >
                  Liste des Produits
                </Typography>
                <Box className="number-listing">
                  {" "}
                  <Typography
                    className="color-title"
                    sx={{ fontSize: "0.85rem", fontWeight: "600" }}
                  >
                    {" "}
                    {arrayAllProduct.length} Produits
                  </Typography>{" "}
                </Box>
              </div>

              <button
                onClick={() => onOpenModalAddProduct()}
                className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
              >
                + Ajouter
              </button>
            </Grid>

            <ListProducts
              arrayAllProduct={arrayAllProduct}
              // showDetailsTiers={(row) => showDetailsTiers(row)}
              onDeleteProduct={(row) => onDeleteProduct(row)}
              onOpenModalAddProduct={() => onOpenModalAddProduct()}
              onOpenModalUpdateProduct={(row) => onOpenModalUpdateProduct(row)}
              goToDetailsAndUpdateProduct={(row) =>
                goToDetailsAndUpdateProduct(row)
              }
              source={"product"}
            />
          </Box>
        </>
      )}

      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={openModalAddProduct}
        onClose={onCloseModalAddProduct}
      >
        <DialogTitle
          className="flex-Box-between"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <Box className="flex-Box">
            {editProduct ? (
              <Typography className="color-title" sx={{ fontWeight: "600" }}>
                {" "}
                Modifier produit
              </Typography>
            ) : (
              <Typography className="color-title" sx={{ fontWeight: "600" }}>
                {" "}
                Ajouter un nouveau produit
              </Typography>
            )}
          </Box>
          <Close
            sx={{ cursor: "pointer" }}
            onClick={() => onCloseModalAddProduct()}
          />
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Nom du produit*
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={attributeProduct.name}
                onChange={handleChangeAttributeProduct("name")}
              />
            </Grid>
            {console.log(attributeProduct)}
            <Grid item xs={12} md={6}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Catégorie*
              </Typography>
              {console.log(attributeProduct)}
              <FormControl fullWidth size="small">
                <Select
                  labelId="demo-name-label"
                  id="demo-name"
                  value={attributeProduct.categoryId}
                  onChange={handleChange}
                  // input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {arrayAllCatgories.map((category, key) => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                      // style={getStyles(category.name, listCategories, theme)}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* 
            <Grid item xs={12} md={6} >
              <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                Nombre de pièces*
              </Typography>
              <TextField
                size='small'
                fullWidth
                value={attributeProduct.piecesNumber}
                onChange={handleChangeAttributeProduct('piecesNumber')}
              />
            </Grid> */}
            <Grid item xs={12} md={12}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Unité*
              </Typography>
              <FormGroup>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {arrayAllUnits.map((unite, key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          value={unite.id}
                          onChange={() => {
                            setAttributeProduct({
                              ...attributeProduct,
                              unitId: unite.id,
                            });
                          }}
                          checked={attributeProduct.unitId === unite.id}
                        />
                      }
                      label={unite.name.toLowerCase() + "(" + unite.unit + ")"}
                    />
                  ))}
                </Box>
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Description*
              </Typography>
              <TextField
                size="small"
                fullWidth
                multiline
                minRows={3}
                placeholder="Description"
                value={attributeProduct.description}
                onChange={handleChangeAttributeProduct("description")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        {/* {showDetails ? null : <Divider />} */}
        <DialogActions>
          {/* {editProduct ? <Button variant='contained' sx={{
            //  backgroundColor: theme.palette.primary.main, 
            color: 'white'
          }} onClick={() => onUpdateProduct()}>Modifier</Button> : <Button variant='contained' sx={{
            //  backgroundColor: theme.palette.primary.main, 
            color: 'white'
          }} onClick={() => addProduct()}>Valider</Button>} */}

          {editProduct ? (
            <Button
              variant="contained"
              sx={{ color: "white" }}
              onClick={() => onUpdateProduct()}
            >
              Modifier
            </Button>
          ) : editProduct === false ? (
            <Button
              variant="contained"
              sx={{ color: "white" }}
              onClick={() => addProduct()}
            >
              Ajouter
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    arrayAllProduct: state.productServices.arrayAllProduct,
    arrayAllCatgories: state.productServices.arrayAllCatgories,
    arrayAllUnits: state.productServices.arrayAllUnits,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchProduct: (data) => dispatch(actionCreator.searchProduct(data)),
    createProduct: (data) => dispatch(actionCreator.createProduct(data)),
    EditProduct: (data) => dispatch(actionCreator.EditProduct(data)),
    deleteProduct: (data) => dispatch(actionCreator.deleteProduct(data)),
    getAllCategorys: (data) => dispatch(actionCreator.getAllCategorys(data)),
    getAllUnits: (data) => dispatch(actionCreator.getAllUnits(data)),
    getDetailsProduct: (data) =>
      dispatch(actionCreator.getDetailsProduct(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
