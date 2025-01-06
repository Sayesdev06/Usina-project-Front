import {
  FormControl,
  Grid,
  Paper,
  Select,
  TextField,
  MenuItem,
  Button,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogContentText,
  InputLabel,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { Box } from "@mui/system";
import { Close, InformationVariant, Magnify, Reload } from "mdi-material-ui";
import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import ListProducts from "../products/ListProducts";

import ListProviders from "../Tiers/ListProviders";
import TableRecapCommande from "./TableRecapCommande";
import TablePaymentOrder from "./TablePaymentOrder";
import { useSnackbar } from "notistack";
import CachedIcon from "@mui/icons-material/Cached";
import MenuAnchorOrder from "./MenuAnchorOrder";
import Reception from "./Reception";

import CircularProgress from "@mui/material/CircularProgress";

export const AddCommande = (props) => {
  const { arrayAllCatgories, arrayAllProduct } = props;

  const [attributeTiersSearch, setAttributeTiersSearch] = useState({
    fullname: "",
    country: "",
    email: "",
    type: "",
  });
  const [attributeProductSearch, setAttributeProductSearch] = useState({
    name: "",
    categoryId: "",
  });
  const [attributeProductOrder, setAttributeProductOrder] = useState({
    quantity: "",

    price: "",
  });

  const [paymentData, setPaymentData] = useState({
    orderId: null,
    type: "ESPÈCE",
    amount: "",
    paymentDate: new Date(),
    bank: "",
    checkNumber: "",
    dueDate: null,
    executionDate: null,
    treaty: "",
    file: null,
  });
  const [nameProvider, setNameProvider] = useState("");
  const [idProvider, setIdProvider] = useState(null);
  const [tva, setTva] = useState(null);
  const [totalTTC, setTotalTTC] = useState(0);
  const [totalHt, setTotalHt] = useState(0);
  const [openModalProductfirst, setOpenModalProduct] = useState(false);
  const [disablePayment, setDisablePayment] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(false);
  const [allowSendOrder, setAllowSendOrder] = useState(true);
  const [arrayAllProductOrder, setArrayAllProductOrder] = useState([]);
  const [dataProductOrder, setDataProductOrder] = useState([]);
  const [expectedDateReceipt, setExpectedDateReceipt] = useState("");
  const [openModalAddPayment, setOpenModalAddPayment] = useState(false);
  const [openModalSendOrder, setOpenModalSendOrder] = useState(false);
  const [loadingAddPayment, setloadingAddPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderType, setOrderType] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [inputErrorOrder, setInputErrorOrder] = useState(false);
  const [errorInputPayment, setErrorInputPayment] = useState("");
  const [addingProductToOrder, setAddingProductToOrder] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Fournisseur");

  const [uploadingFacture, setUploadingFacture] = useState(false);

  const inputFileRef = useRef(null);
  const inputFilePayment = useRef(null);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const ReducerOrderId = useSelector((state) => state.order.orderId);
  const arrayPayment = useSelector((state) => state.order.arrayPayment);

  // **************************************************************************//
  useEffect(() => {
    getALLProviders();
    getAllProduct();
    props.getAllCategorys();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (ReducerOrderId) {
      setAllowSendOrder(false);
      setOrderId(ReducerOrderId);
      dispatch(actionCreator.emptyState());
      //setPaymentData({...paymentData,["orderId"]:orderId})
      //dispatch(actionCreator.getAllPaymentByOrderId(orderId));
    }
  }, [ReducerOrderId]);

  // **************************************************************************//
  const getAllProduct = () => {
    const data = {
      ...attributeProductSearch,
    };
    props.searchProduct(data);
  };
  // **************************************************************************//

  const getALLProviders = (search) => {
    let data = {};

    if (search) {
      data = search;
    } else {
      data = {
        ...attributeTiersSearch,
      };
    }
    props.getAllProvider(data);
  };
  // *****************************************************************************//

  const handleChangeAttributeTiersSearch = (prop) => (event) => {
    setAttributeTiersSearch({
      ...attributeTiersSearch,
      [prop]: event.target.value,
    });
  };
  const handleChangeAttributeProductSearch = (prop) => (event) => {
    setAttributeProductSearch({
      ...attributeProductSearch,
      [prop]: event.target.value,
    });
  };
  const handleChangeAttributeProductOrder = (prop) => (event) => {
    setAttributeProductOrder({
      ...attributeProductOrder,
      [prop]: event.target.value,
    });
  };
  // *********************************************************************************//
  const handleClickCheckProvider = (name, details) => {
    setNameProvider(name);
    setIdProvider(details.id);
    setTva(details.tva.percentage);
    setVendorEmail(details.email);
    handleScrollToProduct();
  };

  // *********************************************************************************//

  const openModalAddProductCommande = (details) => {
    setDetailsProduct(details);
    setOpenModalProduct(true);
  };

  const onCloseModalAddProductCommande = () => {
    setUpdateProduct(null);
    setOpenModalProduct(false);
    setAttributeProductOrder({
      quantity: "",

      price: "",
    });
  };

  // *********************************************************************************//

  const addProductToOrder = () => {
    if (!attributeProductOrder.price || !attributeProductOrder.quantity) {
      setAddingProductToOrder(true);
      setTimeout(() => {
        setAddingProductToOrder(false);
      }, 3000);
    } else {
      const priceHT = Number(attributeProductOrder.price);
      const montantTva = Number((tva * priceHT) / 100);
      const priceTTC = Number(montantTva + priceHT);
      const priceTotalHT = Number(attributeProductOrder.quantity * priceHT);
      const priceTotalTTC = Number(attributeProductOrder.quantity * priceTTC);

      let arrayProductOrder = [...arrayAllProductOrder];

      let productOrderWithProductID = attributeProductOrder;

      arrayProductOrder.push({
        tva: tva,
        ...attributeProductOrder,
        ...detailsProduct,
        priceTTC,
        priceTotalHT,
        priceTotalTTC,
      });
      subtotal(arrayProductOrder);
      setArrayAllProductOrder(arrayProductOrder);

      setDataProductOrder([
        ...dataProductOrder,
        Object.assign(productOrderWithProductID, {
          productId: detailsProduct.id,
        }),
      ]);

      // setAttributeProductOrder({
      //   quantity: "",

      //   price: ""
      // })
      onCloseModalAddProductCommande();
    }
  };

  const subtotal = (items) => {
    const totalTTC = items
      .map(({ priceTotalTTC }) => priceTotalTTC)
      .reduce((sum, i) => sum + i, 0);
    const totalHt = items
      .map(({ priceTotalHT }) => priceTotalHT)
      .reduce((sum, i) => sum + i, 0);
    setTotalHt(totalHt);
    setTotalTTC(totalTTC);
  };
  // *********************************************************************************//
  const addNewOrder = () => {
    if (
      !expectedDateReceipt ||
      !dataProductOrder ||
      !idProvider ||
      !orderType
    ) {
      setTimeout(() => {
        setInputErrorOrder(false);
      }, 5000);
      setInputErrorOrder(true);
    } else {
      const data = {
        amountHt: totalHt,
        amountTtc: totalTTC,
        vendorId: idProvider,
        productData: dataProductOrder,
        orderType,
        expectedDateReceipt,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          setSelectedItem("Paiements");
        },
      };
      props.createOrder(data);
    }
  };

  const sendOrder = async () => {
    const data = {
      orderId,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    dispatch(actionCreator.sendOrderViaEmail(data));
    setOpenModalSendOrder(false);
    handleScrollToPayment();
  };

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleButtonClickForPayment = () => {
    inputFilePayment.current.click();
  };

  const handleFileSelect = (event) => {
    setUploadingFacture(true);
    var formData = new FormData();
    formData.append("file", event.target.files[0]);
    const data = {
      formData,
      orderId,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        setUploadingFacture(false),
          dispatch(actionCreator.getOrderById(orderId));
      },
    };
    dispatch(actionCreator.addFactureToOrder(data));
    // Do something with the selected file, like uploading it to a server
  };

  const handleFileSelectForPayment = (event) => {
    setPaymentData({ ...paymentData, ["file"]: event.target.files[0] });
  };

  const createPayment = async () => {
    if (
      (paymentData.type === "ESPÈCE" &&
        (!paymentData.amount || !paymentData.file)) ||
      (paymentData.type === "CHÈQUE" &&
        (!paymentData.amount ||
          !paymentData.file ||
          !paymentData.checkNumber ||
          !paymentData.dueDate ||
          !paymentData.executionDate ||
          !paymentData.bank)) ||
      (paymentData.type === "VIREMENT BANCAIRE" &&
        (!paymentData.amount || !paymentData.bank)) ||
      (paymentData.type === "TRAITE" &&
        (!paymentData.amount ||
          !paymentData.file ||
          !paymentData.treaty ||
          !paymentData.dueDate ||
          !paymentData.executionDate ||
          !paymentData.bank))
    ) {
      if (!paymentData.amount) {
        setTimeout(() => {
          setErrorInputPayment("");
        }, 3000);
        return setErrorInputPayment("Montant est obligatoire");
      }

      if (!paymentData.file) {
        setTimeout(() => {
          setErrorInputPayment("");
        }, 3000);
        return setErrorInputPayment("epreuve est obligatoire");
      }

      if (paymentData.type === "CHÈQUE") {
        if (!paymentData.amount) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Montant est obligatoire");
        }

        if (!paymentData.checkNumber) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Numéro de chèque est obligatoire");
        }
        if (!paymentData.dueDate) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment(
            "Date d'échéance de chèque est obligatoire"
          );
        }
        if (!paymentData.executionDate) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment(
            "Date d’exécution de chèque est obligatoire"
          );
        }
        if (!paymentData.bank) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("banque est obligatoire");
        }
      }
      if (paymentData.type === "VIREMENT BANCAIRE") {
        if (!paymentData.amount) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Montant est obligatoire");
        }
        if (!paymentData.bank) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Banque est obligatoire");
        }
      }
      if (paymentData.type === "TRAITE") {
        if (!paymentData.amount) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Montant est obligatoire");
        }

        if (!paymentData.treaty) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Numéro de traite est obligatoire");
        }
        if (!paymentData.dueDate) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Date d'échéance est obligatoire");
        }
        if (!paymentData.executionDate) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("Date d’exécution est obligatoire");
        }
        if (!paymentData.bank) {
          setTimeout(() => {
            setErrorInputPayment("");
          }, 3000);
          return setErrorInputPayment("banque est obligatoire");
        }
      }
    } else {
      console.log('first')
      let amoutPayed = 0;
      for (let index = 0; index < arrayPayment.length; index++) {
        const payment = arrayPayment[index];
        amoutPayed += payment.amount;
      }
      let rest = totalTTC - amoutPayed;

      if (parseFloat(paymentData.amount) > rest) {
        return enqueueSnackbar("le montant a dépassé le total ttc", {
          variant: "warning",
        });
      }

      var formData = new FormData();

      formData.append("orderId", orderId);
      //formData.append("sellOrderId", null);
      formData.append("type", paymentData.type);
      formData.append("amount", paymentData.amount);
      formData.append("paymentDate", paymentData.paymentDate);
      formData.append("bank", paymentData.bank);
      formData.append("checkNumber", paymentData.checkNumber);
      if (paymentData.dueDate) formData.append("dueDate", paymentData.dueDate);
      if (paymentData.executionDate)
        formData.append("executionDate", paymentData.executionDate);

      formData.append("treaty", paymentData.treaty);
      formData.append("file", paymentData.file);
      setloadingAddPayment(true);

      const data = {
        id: paymentData.id,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          dispatch(actionCreator.getAllPaymentByOrderId(orderId));
          setOpenModalAddPayment(false);
          setloadingAddPayment(false);
        },
      };

      if (!paymentData.id) {
        dispatch(actionCreator.createPayment(formData, data));
      } else {
        dispatch(actionCreator.updatePayment(formData, data));
      }

      setPaymentData({
        orderId: null,
        type: "ESPÈCE",
        amount: "",
        paymentDate: new Date(),
        bank: "",
        checkNumber: "",
        dueDate: null,
        executionDate: null,
        treaty: "",
        file: null,
      });
    }
  };

  const onReload = () => {
    setAttributeTiersSearch({
      fullname: "",
      country: "",
      email: "",
      type: "",
    });
    const data = {
      fullname: "",
      country: "",
      email: "",
      type: "",
    };
    getALLProviders(data);
  };

  const onReloadProduct = () => {
    setAttributeProductSearch({
      name: "",
      categoryId: "",
    });

    const data = {
      name: "",
      categoryId: "",
    };
    getAllProduct(data);
  };

  const handleScrollToProduct = () => {
    const element = document.getElementById("product-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProductFromRecap = (productId) => {
    const newDataProduct = arrayAllProductOrder.filter(
      (item) => item.id !== productId
    );
    setArrayAllProductOrder(newDataProduct);
    const newDataProductOrder = dataProductOrder.filter(
      (item) => item.id !== productId
    );
    setDataProductOrder(newDataProductOrder);

    if (newDataProduct.length > 0) {
      subtotal(newDataProduct);
    } else if (newDataProduct.length == 0) {
      setTotalHt(0);
      setTotalTTC(0);
    }
  };

  const handleUpdateProductFromRecap = (product) => {
    setUpdateProduct(product.id);
    setOpenModalProduct(true);
    setAttributeProductOrder({
      quantity: product.quantity,

      price: product.price,
    });
  };

  const updateProductInRecap = () => {
    if (!attributeProductOrder.price || !attributeProductOrder.quantity) {
      setAddingProductToOrder(true);
      setTimeout(() => {
        setAddingProductToOrder(false);
      }, 3000);
    } else {
      const newArrayAllProductOrder = arrayAllProductOrder.filter(
        (item) => item.id !== updateProduct
      );

      const priceHT = Number(attributeProductOrder.price);
      const montantTva = Number((tva * priceHT) / 100);
      const priceTTC = Number(montantTva + priceHT);
      const priceTotalHT = Number(attributeProductOrder.quantity * priceHT);
      const priceTotalTTC = Number(attributeProductOrder.quantity * priceTTC);

      let arrayProductOrder = [...newArrayAllProductOrder];

      let productOrderWithProductID = attributeProductOrder;

      arrayProductOrder.push({
        tva: tva,
        ...attributeProductOrder,
        ...detailsProduct,
        priceTTC,
        priceTotalHT,
        priceTotalTTC,
      });
      subtotal(arrayProductOrder);
      setArrayAllProductOrder(arrayProductOrder);

      setDataProductOrder([
        ...dataProductOrder,
        Object.assign(productOrderWithProductID, {
          productId: detailsProduct.id,
        }),
      ]);

      // setAttributeProductOrder({
      //   quantity: "",
      //   price: ""
      // })
      onCloseModalAddProductCommande();
    }
  };

  const handleUpdatePayment = (payment) => {
    let data = payment;
    data.file = null;
    setPaymentData(data);
    setOpenModalAddPayment(true);
  };

  const handleSelectedItem = (item) => {
    setSelectedItem(item);
  };

  // *********************************************************************************//
  return (
    <div>
      <MenuAnchorOrder
        handleSelectedItem={handleSelectedItem}
        selectedItem={selectedItem}
        orderId={orderId}
      />

      {selectedItem === "Fournisseur" && (
        <>
          <Box
            sx={{ display: "flex", alignItems: "center", pt: 3, pl: 1, pb: 2 }}
          >
            <div className="box-icon-info  flex-Box">
              <InformationVariant sx={{ fontSize: "1.3rem" }} />
            </div>
            <Typography className="add-commande-span">
              {" "}
              Veulliez séléctionner le fournisseur de votre commande.{" "}
            </Typography>
          </Box>

          <Paper sx={{ width: "100%", p: 2 }}>
            <Grid container sx={{ pl: 3 }} spacing={3}>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                Nom
                <TextField
                  size="small"
                  fullWidth
                  value={attributeTiersSearch.fullname}
                  onChange={handleChangeAttributeTiersSearch("fullname")}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                Email
                <TextField
                  size="small"
                  fullWidth
                  value={attributeTiersSearch.email}
                  onChange={handleChangeAttributeTiersSearch("email")}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                Pays
                <TextField
                  size="small"
                  fullWidth
                  value={attributeTiersSearch.country}
                  onChange={handleChangeAttributeTiersSearch("country")}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                Type
                <FormControl size="small" fullWidth>
                  <Select
                    defaultValue=""
                    id="form-layouts-separator-select"
                    labelId="form-layouts-separator-select-label"
                    value={attributeTiersSearch.type}
                    onChange={handleChangeAttributeTiersSearch("type")}
                  >
                    <MenuItem value="PASSAGER">Passager</MenuItem>
                    <MenuItem value="GRAND COMPTE">Grand compte</MenuItem>
                    <MenuItem value="PME">PME</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: "end" }}>
                <Button
                  onClick={() => getALLProviders()}
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

          <Grid
            item
            className="flex-Box"
            sx={{
              flex: "1 1 100%",
              mt: 3,
              mb: 1,
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex">
              <Typography
                className="color-title"
                sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
              >
                Liste des fournisseurs
              </Typography>
              <Box className="number-listing">
                {" "}
                <Typography
                  className="color-title"
                  sx={{ fontSize: "0.85rem", fontWeight: "600" }}
                >
                  {" "}
                  {props.arrayAllProvider && props.arrayAllProvider.length}{" "}
                  Fournisseurs
                </Typography>{" "}
              </Box>
            </div>
          </Grid>

          <Paper sx={{ width: "100%", p: 2, mt: 1 }}>
            {inputErrorOrder && !idProvider ? (
              <p className="red-color">Choisir un fournisseur</p>
            ) : null}

            <ListProviders
              source={"commandeComponenet"}
              handleClickCheckProvider={(name, id) =>
                handleClickCheckProvider(name, id)
              }
            />
          </Paper>

          {nameProvider !== "" ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid
                item
                xs={12}
                md={10}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <div className="box-icon-info  flex-Box">
                  <InformationVariant sx={{ fontSize: "1.3rem" }} />
                </div>

                <Typography className="add-commande-span">
                  {" "}
                  Vous avez choisi le forunisseur{" "}
                  <span className="font-bold">{nameProvider} </span> pour cette
                  commande{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2} sx={{ textAlign: "end" }}>
                <button
                  className="btn- bg-primary py-2 px-3 rounded-lg"
                  style={{ color: "#000" }}
                  onClick={() => setSelectedItem("Produits à commander")}
                >
                  Valider
                </button>
              </Grid>
            </Grid>
          ) : null}
        </>
      )}

      {selectedItem === "Produits à commander" && (
        <>
          <Box
            sx={{ display: "flex", alignItems: "center", pt: 3, pl: 1, pb: 2 }}
          >
            <div className="box-icon-info  flex-Box">
              <InformationVariant sx={{ fontSize: "1.3rem" }} />
            </div>
            <Typography className="add-commande-span">
              {" "}
              Veuillez sélectionner les produits de cette commande.{" "}
            </Typography>
          </Box>

          <Paper sx={{ width: "100%", p: 2 }}>
            {/* <Divider/> */}
            <Grid container>
              <Grid
                item
                xs={12}
                md={3}
                sx={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                Nom:
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
                  pl: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                {/* getAllCategorys */}
                Categories:
                <FormControl size="small" fullWidth>
                  <Select
                    defaultValue=""
                    id="form-layouts-separator-select"
                    labelId="form-layouts-separator-select-label"
                    onChange={handleChangeAttributeProductSearch("categoryId")}
                  >
                    {arrayAllCatgories.map((category, key) => (
                      <MenuItem key={key} value={category.id}>
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
                  onClick={() => onReloadProduct()}
                />
              </Grid>
            </Grid>
          </Paper>

          <Grid
            item
            className="flex-Box"
            sx={{
              flex: "1 1 100%",
              mb: 2,
              pt: 3,
              justifyContent: "space-between",
            }}
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
          </Grid>

          <Paper sx={{ width: "100%" }}>
            {inputErrorOrder && !dataProductOrder.length > 0 ? (
              <p className="red-color">choisissez au moins 1 produit</p>
            ) : null}

            <ListProducts
              source={"commandeComponenet"}
              arrayAllProduct={arrayAllProduct}
              openModalAddProductCommande={(details) =>
                openModalAddProductCommande(details)
              }
            />
          </Paper>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: 2,
              pl: 1,
              pb: 2,
            }}
          >
            <div className="d-flex">
              <div className="box-icon-info  flex-Box">
                <InformationVariant sx={{ fontSize: "1.3rem" }} />
              </div>
              <Typography className="add-commande-span">
                Pour cette commande vous avez choisi les produits suivants :
              </Typography>
            </div>

            <button
              className="btn- bg-primary py-2 px-3 rounded-lg"
              style={{ color: "#000" }}
              onClick={() => setSelectedItem("Recaputilatif")}
            >
              Valider
            </button>
          </Box>

          {arrayAllProductOrder &&
            arrayAllProductOrder.map((item) => (
              <Typography className="add-commande-span" sx={{ pl: 4 }}>
                {item.quantity} {item.name} : Prix unitaire HT{" "}
                {item.priceTotalHT.toFixed(2)} TND : Prix total TTC{" "}
                {item.priceTotalTTC.toFixed(2)} TND
              </Typography>
            ))}
        </>
      )}

      {selectedItem === "Recaputilatif" && (
        <>
          {/* <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
          Récapitulatif de votre commande
        </Typography> */}
          <Paper sx={{ width: "100%", mt: 5 }}>
            <TableRecapCommande
              arrayAllProductOrder={arrayAllProductOrder}
              totalHt={totalHt}
              totalTTC={totalTTC}
              handleProductFromRecap={handleProductFromRecap}
              handleUpdateProductFromRecap={handleUpdateProductFromRecap}
            />
          </Paper>
          <Paper sx={{ width: "100%", p: 1, mt: 5 }}>
            <div className="d-flex align-items-center gap-1 mt-5">
              <div className="box-icon-info  flex-Box">
                <InformationVariant sx={{ fontSize: "1.3rem" }} />
              </div>
              <Typography className="add-commande-span">
                veulliez saisir la date prévu de reception :
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="YYYY-MM-DD"
                  value={expectedDateReceipt}
                  onChange={(newValue) => {
                    setExpectedDateReceipt(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              {inputErrorOrder && !expectedDateReceipt ? (
                <p className="red-color">Ce champ est obligatoire</p>
              ) : null}
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="box-icon-info  flex-Box">
                <InformationVariant sx={{ fontSize: "1.3rem" }} />
              </div>

              <Typography className="add-commande-span">Type:</Typography>
              <FormControl size="small" sx={{ width: "200px" }}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={orderType}
                  placeholder=""
                  label="orderType"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <MenuItem value="LOCAUX">Locaux</MenuItem>
                  <MenuItem value="IMPORTATION">Importation</MenuItem>
                </Select>
              </FormControl>
            </div>

            {inputErrorOrder && !orderType ? (
              <p className="red-color">Ce champ est obligatoire</p>
            ) : null}
          </Paper>

          <Box sx={{ width: "100%", mt: 2, textAlign: "end" }}>
            {orderId && (
              <>
                <input
                  type="file"
                  ref={inputFileRef}
                  className="d-none"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e)}
                  required
                />

                <button
                  onClick={() => handleButtonClick()}
                  style={{ color: "#000" }}
                  className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                >
                  {uploadingFacture ? (
                    <CircularProgress color="inherit" className="w-h-20" />
                  ) : (
                    "+ Facture"
                  )}
                </button>
              </>
            )}

            {!allowSendOrder ? (
              <button
                onClick={() => setOpenModalSendOrder(true)}
                className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                disabled={allowSendOrder}
                style={{ color: "#000" }}
              >
                Envoyer
              </button>
            ) : (
              <button
                onClick={() => addNewOrder()}
                className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                disabled={!allowSendOrder}
                style={{ color: "#000" }}
              >
                Créer
              </button>
            )}
          </Box>
        </>
      )}

      {selectedItem === "Paiements" && (
        <>
          {orderId ? (
            <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
              Liste des paiements de la commande : {orderId}
            </Typography>
          ) : null}
          {orderId ? (
            <>
              <Paper sx={{ width: "100%" }}>
                <TablePaymentOrder
                  arrayPayment={arrayPayment}
                  totalTTC={totalTTC}
                  handleUpdatePayment={handleUpdatePayment}
                  setDisablePayment={setDisablePayment}
                />
              </Paper>

              <div className="d-flex align-items-center justify-content-end mt-5 mb-4">
                {disablePayment ? null : (
                  <button
                    onClick={() => setOpenModalAddPayment(true)}
                    className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                    style={{ color: "#000" }}
                  >
                    + Paiement
                  </button>
                )}
              </div>
            </>
          ) : null}
        </>
      )}

      {selectedItem === "Reception" && (
        <>
          <Reception orderId={orderId} />
        </>
      )}

      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={openModalAddPayment}
        onClose={() => {
          setOpenModalAddPayment(false);
        }}
      >
        <DialogTitle
          className="flex-Box-between"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <Box className="flex-Box">
            <Typography
              className="color-title"
              variant="body2"
              sx={{ fontWeight: "600" }}
            >
              {" "}
              Veuillez renseigner le information ci-dessous du paiement
            </Typography>
          </Box>
          <Close
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenModalAddPayment(false)}
          />
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="ESPÈCE"
                name="radio-buttons-group"
                row
                onChange={(e) =>
                  setPaymentData({ ...paymentData, ["type"]: e.target.value })
                }
              >
                <FormControlLabel
                  value="ESPÈCE"
                  control={<Radio />}
                  label="Espéce"
                />
                <FormControlLabel
                  value="CHÈQUE"
                  control={<Radio />}
                  label="Chéque"
                />
                <FormControlLabel
                  value="TRAITE"
                  control={<Radio />}
                  label="Traite"
                />
                <FormControlLabel
                  value="VIREMENT BANCAIRE"
                  control={<Radio />}
                  label="Virement"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Montant*
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, ["amount"]: e.target.value })
                }
                type="number"
                inputProps={{ min: 0 }}
              />
            </Grid>
            {paymentData && paymentData.type === "CHÈQUE" ? (
              <Grid item xs={12} md={4}>
                <Typography
                  className="color-title-1"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Numéro de chéque*
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  value={paymentData.checkNumber}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      ["checkNumber"]: e.target.value,
                    })
                  }
                  inputProps={{ min: 0 }}
                  required={
                    paymentData && paymentData.type === "CHÈQUE" ? true : false
                  }
                />
              </Grid>
            ) : null}

            {(paymentData && paymentData.type === "CHÈQUE") ||
            paymentData.type === "TRAITE" ? (
              <Grid item xs={12} md={4}>
                <Typography
                  className="color-title-1"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Date d'échéance*
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    inputFormat="YYYY-MM-DD"
                    value={paymentData.dueDate}
                    onChange={(newValue) =>
                      setPaymentData({ ...paymentData, ["dueDate"]: newValue })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            ) : null}

            {(paymentData && paymentData.type === "CHÈQUE") ||
            paymentData.type === "TRAITE" ? (
              <Grid item xs={12} md={4}>
                <Typography
                  className="color-title-1"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Date d’exécution*
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    inputFormat="YYYY-MM-DD"
                    value={paymentData.executionDate}
                    onChange={(newValue) =>
                      setPaymentData({
                        ...paymentData,
                        ["executionDate"]: newValue,
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            ) : null}

            {(paymentData && paymentData.type === "CHÈQUE") ||
            paymentData.type === "TRAITE" ||
            paymentData.type === "VIREMENT BANCAIRE" ? (
              <Grid item xs={12} md={4}>
                <Typography
                  className="color-title-1"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  banque*
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={paymentData.bank}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, ["bank"]: e.target.value })
                  }
                />
              </Grid>
            ) : null}

            {paymentData && paymentData.type === "TRAITE" ? (
              <Grid item xs={12} md={4}>
                <Typography
                  className="color-title-1"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Numéro de traite*
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  value={paymentData.treaty}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      ["treaty"]: e.target.value,
                    })
                  }
                  inputProps={{ min: 0 }}
                />
              </Grid>
            ) : null}
          </Grid>

          <div className="d-fex mt-4">
            <input
              type="file"
              ref={inputFilePayment}
              className="d-none"
              style={{ display: "none" }}
              onChange={(e) => handleFileSelectForPayment(e)}
            />

            <button
              onClick={() => handleButtonClickForPayment()}
              className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
            >
              + Epreuve
            </button>
            {errorInputPayment ? (
              <p className="red-color">{errorInputPayment}</p>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => createPayment()}
            className="btn- bg-primary py-2 px-3 rounded-lg"
            disabled={loadingAddPayment}
          >
            {loadingAddPayment ? (
              <CircularProgress color="inherit" className="w-h-20" />
            ) : (
              "Confirmer"
            )}
          </button>
        </DialogActions>
      </Dialog>

      {openModalProductfirst ? (
        <Dialog
          fullWidth
          maxWidth={"sm"}
          open={openModalProductfirst}
          onClose={onCloseModalAddProductCommande}
        >
          <DialogTitle
            className="flex-Box-between"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Box className="flex-Box">
              <Typography
                className="color-title"
                variant="body2"
                sx={{ fontWeight: "600" }}
              >
                {" "}
                Veuillez renseigner La quantité et le prix d'achat du produit{" "}
                {detailsProduct.name}{" "}
              </Typography>
            </Box>
            <Close
              sx={{ cursor: "pointer" }}
              onClick={() => onCloseModalAddProductCommande()}
            />
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography
                  className="color-title-1"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Quantity*
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={attributeProductOrder.quantity}
                  onChange={handleChangeAttributeProductOrder("quantity")}
                  inputProps={{ min: 0 }}
                />

                {addingProductToOrder && !attributeProductOrder.quantity ? (
                  <p className="red-color">la quantité est obligatoire</p>
                ) : null}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  className="color-title-1"
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Prix d'achat*
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={attributeProductOrder.price}
                  onChange={handleChangeAttributeProductOrder("price")}
                  inputProps={{ min: 0 }}
                />

                {addingProductToOrder && !attributeProductOrder.price ? (
                  <p className="red-color">l'unite est obligatoire</p>
                ) : null}
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", alignItems: "center", pt: 3, pl: 1 }}>
              <div className="box-icon-info  flex-Box">
                <InformationVariant sx={{ fontSize: "1.3rem" }} />
              </div>
              <Typography className="add-commande-span">
                Le prix toital de cette commande est de "
                {(
                  attributeProductOrder.quantity * attributeProductOrder.price
                ).toFixed(2)}{" "}
                HT" soit "
                {(
                  attributeProductOrder.quantity * attributeProductOrder.price +
                  attributeProductOrder.quantity *
                    attributeProductOrder.price *
                    (tva / 100)
                ).toFixed(2)}{" "}
                TTC
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions>
            <button
              onClick={() => {
                !updateProduct ? addProductToOrder() : updateProductInRecap();
              }}
              className="btn- bg-primary py-2 px-3 rounded-lg"
            >
              Confirmer
            </button>
          </DialogActions>
        </Dialog>
      ) : null}

      <Dialog
        open={openModalSendOrder}
        onClose={() => setOpenModalSendOrder(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Votre commande pour le fournisseur <strong>"{nameProvider}"</strong>{" "}
            sera envoyé via e-mail <strong>"{vendorEmail}"</strong>
          </DialogContentText>
        </DialogContent>
        <div className="d-flex justify-content-between p-3">
          <Button
            onClick={() => setOpenModalSendOrder(false)}
            className="red-button"
          >
            Annuler
          </Button>
          <Button onClick={() => sendOrder()} className="green-button">
            Confirmer
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    arrayAllProvider: state.userServices.arrayAllProvider,
    arrayAllCatgories: state.productServices.arrayAllCatgories,
    arrayAllProduct: state.productServices.arrayAllProduct,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProvider: (data) => dispatch(actionCreator.getAllProvider(data)),
    getAllCategorys: () => dispatch(actionCreator.getAllCategorys()),
    searchProduct: (data) => dispatch(actionCreator.searchProduct(data)),
    createOrder: (data) => dispatch(actionCreator.createOrder(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCommande);
