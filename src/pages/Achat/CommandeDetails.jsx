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
import TablePaymentOrder from "./TablePaymentOrder";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import RecapDetailCommande from "./recapDetailCommande";
import MenuAnchorOrder from "./MenuAnchorOrder";
import CachedIcon from "@mui/icons-material/Cached";
import Reception from "./Reception";
import CircularProgress from "@mui/material/CircularProgress";
import Loader from "../../components/loader";
import Cookies from "js-cookie";


function CommandeDetails() {
  const role = Cookies.get("role"); 
  const location = useLocation();
  const dispatch = useDispatch();

  const [totalTTC, setTotalTTC] = useState(0);
  const [totalHt, setTotalHt] = useState(0);
  const [openModalAddPayment, setOpenModalAddPayment] = useState(false);
  const [openModalProductfirst, setOpenModalProduct] = useState(false);
  const [openModalSendOrder, setOpenModalSendOrder] = useState(false);
  const [disablePayment, setDisablePayment] = useState(false);

  const [detailsProduct, setDetailsProduct] = useState({});
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [productToAdd, setProductToAdd] = useState([]);
  const [errorInputPayment, setErrorInputPayment] = useState("");
  const [addingProductToOrder, setAddingProductToOrder] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Fournisseur");
  const [loadingAddPayment, setloadingAddPayment] = useState(false);

  const [allProducts, setAllProducts] = useState([]);

  const [updateProduct, setUpdateProduct] = useState(null);

  const [attributeProductOrder, setAttributeProductOrder] = useState({
    quantity: "",

    price: "",
  });

  const [paymentData, setPaymentData] = useState({
    id: null,
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

  const [attributeProductSearch, setAttributeProductSearch] = useState({
    name: "",
    categoryId: "",
  });
  const [uploadingFacture, setUploadingFacture] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputFileRef = useRef(null);
  const inputFilePayment = useRef(null);

  const order = useSelector((state) => state.order.order);
  const allCatgories = useSelector(
    (state) => state.productServices.arrayAllCatgories
  );
  const productsReducer = useSelector(
    (state) => state.productServices.arrayAllProduct
  );

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (location.state.orderId) {
      setLoading(true);
      dispatch(actionCreator.getOrderById(location.state.orderId, setLoading));
    }
  }, [location]);

  const total = async () => await calculateTotalPrice(selectedProduct);

  useEffect(() => {
    if (order) {
      // total().then((total)=>{
      //   setTotalHt(total);
      //   let totalTva = (((total * order.tva.percentage) / 100) + total);
      //   setTotalTTC(totalTva);
      // })
      getAllProduct();
      dispatch(actionCreator.getAllCategorys());

      setSelectedProduct(order.products);
    }
  }, [order]);

  useEffect(() => {
    if (productsReducer && order) {
      const combinedArray = productsReducer.concat(order.products);

      const idFrequency = {};

      combinedArray.forEach((obj) => {
        idFrequency[obj.id] = (idFrequency[obj.id] || 0) + 1;
      });

      const uniqueObjs = combinedArray.filter(
        (obj) => idFrequency[obj.id] === 1
      );

      setAllProducts(uniqueObjs);
    }
  }, [productsReducer]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.length > 0) {
      total().then((total) => {
        setTotalHt(total);
        let totalTva = (total * order.tva.percentage) / 100 + total;
        setTotalTTC(totalTva);
      });
      //getAllProduct()
      //dispatch(actionCreator.getAllCategorys())

      //setSelectedProduct(order.products)
    }
  }, [selectedProduct]);

  const getAllProduct = () => {
    const data = {
      ...attributeProductSearch,
    };
    dispatch(actionCreator.searchProduct(data));
  };

  const addProductToOrder = async () => {
    if (!attributeProductOrder.price || !attributeProductOrder.quantity) {
      setAddingProductToOrder(true);
      setTimeout(() => {
        setAddingProductToOrder(false);
      }, 3000);
    }

    let productOrderWithProductID = attributeProductOrder;

    setProductToAdd([...productToAdd, attributeProductOrder]);

    setSelectedProduct([
      ...selectedProduct,
      {
        name: detailsProduct.name,
        orderProducts: Object.assign(productOrderWithProductID, {
          productId: detailsProduct.id,
        }),
      },
    ]);

    updateOrder([...productToAdd, attributeProductOrder]);

    onCloseModalAddProductCommande();
  };

  async function calculateTotalPrice(products) {
    let productPrices = products.map(
      ({ orderProducts }) =>
        parseInt(orderProducts.price) * parseInt(orderProducts.quantity)
    );
    let totalPrice = productPrices.reduce((total, price) => total + price, 0);
    return totalPrice;
  }

  const handleChangeAttributeProductOrder = (prop) => (event) => {
    setAttributeProductOrder({
      ...attributeProductOrder,
      [prop]: event.target.value,
    });
  };

  const sendOrder = async () => {
    const data = {
      orderId: order.id,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        dispatch(actionCreator.getOrderById(order.id));
      },
    };
    await dispatch(actionCreator.sendOrderViaEmail(data));
    setOpenModalSendOrder(false);
  };

  const updateOrder = async (productData) => {
    //let productData = selectedProduct.map((p)=>{return p.orderProducts})

    const data = {
      orderId: order.id,
      productData: productData,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };

    dispatch(actionCreator.updateOrder(data));
  };

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleFileSelect = (event) => {
    setUploadingFacture(true);
    var formData = new FormData();
    formData.append("file", event.target.files[0]);
    const data = {
      formData,
      orderId: order.id,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        setUploadingFacture(false),
          dispatch(actionCreator.getOrderById(order.id));
      },
    };
    dispatch(actionCreator.addFactureToOrder(data));
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
      let amoutPayed = 0;
      for (let index = 0; index < order.payments.length; index++) {
        const payment = order.payments[index];
        amoutPayed += payment.amount;
      }
      let rest = totalTTC - amoutPayed;

      if (parseFloat(paymentData.amount) > rest) {
        return enqueueSnackbar("le montant a dépassé le total ttc", {
          variant: "warning",
        });
      }

      var formData = new FormData();

      formData.append("orderId", order.id);
      // formData.append("sellOrderId", null);
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
          dispatch(actionCreator.getAllPaymentByOrderId(order.id));
          setOpenModalAddPayment(false);
          setloadingAddPayment(false);
        },
      };
      if (!paymentData.id) {
        await dispatch(actionCreator.createPayment(formData, data));
      } else {
        await dispatch(actionCreator.updatePayment(formData, data));
      }

      dispatch(actionCreator.getOrderById(order.id));

      setPaymentData({
        id: null,
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

      setOpenModalAddPayment(false);
    }
  };

  const handleButtonClickForPayment = () => {
    inputFilePayment.current.click();
  };

  const handleFileSelectForPayment = (event) => {
    setPaymentData({ ...paymentData, ["file"]: event.target.files[0] });
  };

  const handleChangeAttributeProductSearch = (prop) => (event) => {
    setAttributeProductSearch({
      ...attributeProductSearch,
      [prop]: event.target.value,
    });
  };

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

  const deleteProductFromOrder = async (id) => {
    const data = {
      productId: id,
      orderId: order.id,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });

        dispatch(actionCreator.getOrderById(order.id));
      },
    };
    dispatch(actionCreator.deleteProductFromOrder(data));
  };

  const handleUpdatePayment = (payment) => {
    let data = payment;
    data.file = null;
    setPaymentData(data);
    setOpenModalAddPayment(true);
  };

  const handleCloseModalADDPayment = () => {
    setPaymentData({
      id: null,
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

    setOpenModalAddPayment(false);
  };

  const handleUpdateProductFromRecap = (product) => {
    const details = productsReducer.filter((item) => item.id === product.id);
    setDetailsProduct(details[0]);
    setUpdateProduct(product.id);
    setOpenModalProduct(true);
    setAttributeProductOrder({
      quantity: product.orderProducts.quantity,
      price: product.orderProducts.price,
    });
  };

  const updateProductInOrder = () => {
    const data = {
      productId: updateProduct,
      orderId: order.id,
      attributeProductOrder,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    dispatch(actionCreator.updateProductInOrder(data));
    onCloseModalAddProductCommande();
  };

  const handleSelectedItem = (item) => {
    setSelectedItem(item);
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

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    return array[array.length - 1];
  };

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082" + fileUrl, "_blank");
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MenuAnchorOrder
            handleSelectedItem={handleSelectedItem}
            selectedItem={selectedItem}
            orderId={order.id}
            statusReception={order.statusReception}
          />

          <Box sx={{ width: "100%" }}>
            {selectedItem === "Fournisseur" && (
              <>
                <div className="d-flex my-5">
                  <div className="box-icon-info  flex-Box">
                    <InformationVariant sx={{ fontSize: "1.3rem" }} />
                  </div>
                  <Typography className="add-commande-span">
                    {" "}
                    le fournisseur de votre commande.{" "}
                  </Typography>
                </div>
                <Paper sx={{ width: "100%", p: 2 }}>
                  {/* <ListProviders
          source={"commandeComponenet"}
          handleClickCheckProvider={(name, id) => handleClickCheckProvider(name, id)}
        /> */}
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      md={10}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      {/* <div className="box-icon-info  flex-Box">
                        <InformationVariant sx={{ fontSize: '1.3rem' }} />
                      </div> */}

                      <Typography className="add-commande-span">
                        {" "}
                        Vous avez choisi le forunisseur{" "}
                        <span className="font-bold">
                          {" "}
                          {order && order.vendor.fullname}{" "}
                        </span>{" "}
                        pour cette commande{" "}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <div className="d-flex justify-content-end my-5">
                  <button
                    className="btn- bg-primary py-2 px-3 rounded-lg"
                    style={{ color: "#000" }}
                    onClick={() => setSelectedItem("Produits à commander")}
                  >
                    Suivant
                  </button>
                </div>
              </>
            )}

            {selectedItem === "Produits à commander" && (
              <>
                {order ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pt: 3,
                        pb: 3,
                      }}
                    >
                      <div className="box-icon-info  flex-Box">
                        <InformationVariant sx={{ fontSize: "1.3rem" }} />
                      </div>
                      <Typography className="add-commande-span">
                        {" "}
                        les produits de votre commander{" "}
                      </Typography>
                    </Box>

                    <Paper sx={{ width: "100%", p: 2 }}>
                      {/* <Divider/> */}

                      <Grid container spacing={3}>
                        <Grid
                          item
                          xs={12}
                          md={3}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          Nom:
                          <TextField
                            size="small"
                            fullWidth
                            value={attributeProductSearch.name}
                            onChange={handleChangeAttributeProductSearch(
                              "name"
                            )}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={3}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          Categories:
                          <FormControl size="small" fullWidth>
                            <Select
                              defaultValue=""
                              id="form-layouts-separator-select"
                              labelId="form-layouts-separator-select-label"
                              onChange={handleChangeAttributeProductSearch(
                                "categoryId"
                              )}
                            >
                              {allCatgories.map((category, key) => (
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

                    <Paper sx={{ width: "100%", mt: 3 }}>
                      <ListProducts
                        source={"commandeComponenet"}
                        arrayAllProduct={allProducts && allProducts}
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
                          Pour cette commande vous avez choisi les produits
                          suivants :
                        </Typography>
                      </div>

                      <button
                        className="btn- bg-primary py-2 px-3 rounded-lg"
                        style={{ color: "#000" }}
                        onClick={() => setSelectedItem("Recaputilatif")}
                      >
                        Suivant
                      </button>
                    </Box>

                    {selectedProduct &&
                      selectedProduct.map((item, key) => (
                        <Typography
                          className="add-commande-span"
                          sx={{ pl: 4 }}
                          key={key}
                        >
                          {item.orderProducts.quantity} {item.name} : Prix
                          unitaire HT
                          {(
                            item.orderProducts.quantity *
                            item.orderProducts.price
                          ).toFixed(2)}
                          TND : Prix total TTC{" "}
                          {(
                            item.orderProducts.quantity *
                              item.orderProducts.price +
                            (item.orderProducts.quantity *
                              item.orderProducts.price *
                              order.tva.percentage) /
                              100
                          ).toFixed(2)}{" "}
                          TND
                        </Typography>
                      ))}
                  </>
                ) : null}
              </>
            )}

            {selectedItem === "Recaputilatif" && (
              <>
                {/* <Typography sx={{pt:2,pb:1 , color:'#000', fontWeight:"600"}}>Récapitulatif de votre commande</Typography> */}
                <Paper sx={{ width: "100%", mt: 3 }}>
                  <RecapDetailCommande
                    arrayAllProductOrder={selectedProduct && selectedProduct}
                    totalHt={totalHt}
                    totalTTC={totalTTC}
                    tva={order && order.tva}
                    deleteProductFromOrder={deleteProductFromOrder}
                    orderStatus={order && order.status}
                    handleUpdateProductFromRecap={handleUpdateProductFromRecap}
                  />
                </Paper>

               {role !=="MAGASINIER"&& <Paper sx={{ width: "100%", mt: 3, p: 1 }}>
                  <div className="d-flex justify-content-between align-items-center">
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
                          value={order && order.expectedDateReceipt}
                          // onChange={(newValue)=>{setExpectedDateReceipt(newValue)}}
                          renderInput={(params) => <TextField {...params} />}
                          disabled={true}
                        />
                      </LocalizationProvider>
                    </div>

                    <div className="flex-column gap-3 mt-2">
                      {order.file && (
                        <Typography
                          className="add-commande-span"
                          sx={{ pr: 4 }}
                        >
                          Facture associé :
                          <span
                            className="pointer"
                            style={{
                              color: "rgb(101 133 187)",
                              fontWeight: "600",
                            }}
                            onClick={() => {
                              openFile(order.file);
                            }}
                          >
                            {" "}
                            {order.file ? getFileName(order.file) : ""}
                          </span>
                        </Typography>
                      )}
{/* 
                      {order.orderFile && (
                        <Typography
                          className="add-commande-span"
                          sx={{ pr: 4 }}
                        >
                          Bon de commande :
                          <span
                            className="pointer"
                            style={{
                              color: "rgb(101 133 187)",
                              fontWeight: "600",
                            }}
                            onClick={() => {
                              openFile(order.orderFile);
                            }}
                          >
                            {" "}
                            {order.orderFile
                              ? getFileName(order.orderFile)
                              : ""}
                          </span>
                        </Typography>
                      )} */}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="box-icon-info  flex-Box">
                        <InformationVariant sx={{ fontSize: "1.3rem" }} />
                      </div>

                      <Typography className="add-commande-span">
                        Type :
                      </Typography>
                      <FormControl size="small">
                        {/* <InputLabel id="demo-simple-select-label">commande ID</InputLabel> */}
                        <TextField
                          disabled
                          size="small"
                          placeholder="orderType"
                          value={order.orderType}
                        />
                      </FormControl>
                    </div>
                    <Box
                      sx={{
                        mt: 2,
                        textAlign: "end",
                        display: "flex",
                        gap: "20px",
                      }}
                    >
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
                          <CircularProgress
                            color="inherit"
                            className="w-h-20"
                          />
                        ) : (
                          "+ Facture"
                        )}
                      </button>
{/* 
                      <button
                        onClick={() => setOpenModalSendOrder(true)}
                        className="btn- bg-primary py-2  m-1 px-3 rounded-lg "
                      >
                        Envoyer
                      </button> */}

                      {order && order.status === "CREÉ" ? (
                        <button
                          onClick={() => updateOrder()}
                          className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                        >
                          Modifier
                        </button>
                      ) : null}

                      <button
                        onClick={() => setSelectedItem("Paiements")}
                        className="btn- bg-primary py-2 px-3  m-1 rounded-lg"
                      >
                        Suivant
                      </button>
                    </Box>
                  </div>
                </Paper>}
              </>
            )}

            {selectedItem === "Paiements" && (
              <>
                <Typography
                  sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}
                >
                  Liste des paiements de la commande : {order && order.id}
                </Typography>

                <Paper sx={{ width: "100%" }}>
                  <TablePaymentOrder
                    arrayPayment={order && order.payments}
                    totalTTC={totalTTC}
                    handleUpdatePayment={handleUpdatePayment}
                    setDisablePayment={setDisablePayment}
                  />
                </Paper>

                <div className="d-flex align-items-center justify-content-end mt-5 mb-4">
                  <div>
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
                </div>
              </>
            )}

            {selectedItem === "Reception" && <Reception orderId={order.id} />}
          </Box>
        </>
      )}

      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={openModalAddPayment}
        onClose={handleCloseModalADDPayment}
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
            onClick={handleCloseModalADDPayment}
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
                  value={paymentData.checkNumber}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      ["checkNumber"]: e.target.value,
                    })
                  }
                  type="number"
                  inputProps={{ min: 0 }}
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
                  fullWidth
                  value={paymentData.treaty}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      ["treaty"]: e.target.value,
                    })
                  }
                  type="number"
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
                  size="small"
                  fullWidth
                  value={attributeProductOrder.quantity}
                  onChange={handleChangeAttributeProductOrder("quantity")}
                  type="number"
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
                {" "}
                Veulliez séléctionner le fournisseur de votre commande.{" "}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions>
            <button
              onClick={() => {
                !updateProduct ? addProductToOrder() : updateProductInOrder();
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
            Votre commande pour le fournisseur{" "}
            <strong>"{order && order.tva.name}"</strong> sera envoyé via e-mail{" "}
            <strong>"{order && order.vendor.email}"</strong>
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
}

export default CommandeDetails;
