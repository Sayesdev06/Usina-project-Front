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
  TextareaAutosize,
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

import { useSnackbar } from "notistack";
import ListProducts from "../products/ListProducts";
import { useLocation, useNavigate } from "react-router-dom";
import ListFinalProductForSellOrder from "./listFinalProductForSellOrder";
import RecapSellOrder from "./recapSellOrder";
import TablePaymentOrder from "../Achat/TablePaymentOrder";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useReactToPrint } from "react-to-print";
import ProductionList from "./ProductionsList";
import SendIcon from "@mui/icons-material/Send";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MenuAnchorSellOrder from "./MenuAnchorSellOrder";
import CachedIcon from "@mui/icons-material/Cached";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Loader from "../../components/loader";
import ListElementOfExitVoucher from "./ListElementOfExitVoucher";
import Cookies from "js-cookie";


function CreateSellOrder(props) {
  const role = Cookies.get("role"); 

  const toDayDate = new Date();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const [sellOrder, setSellOrder] = useState({
    activityId: "",
    quantity: 0,
    amountHt: 0,
    amountTtc: 0,
    startProductionDate: null,
    endProductionDate: null,
    expectedDeliveryDate: null,
    statusDelivery: "",
    statusPayment: "",
    statusProduction: "",
    clientId: "",
    discounts: 0,
    finalProductIds: [],
    sellOrderType: "",
    profit: "",
    pieces: [],
    noteInterne: "",
    //productions:[]
  });
  const [attributeSearch, setAttributeSearch] = useState({
    categoryId: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const [openModalDeleteOrder, setOpenModalDeleteOrder] = useState(false);
  const [allInputRequired, setAllInputRequired] = useState(false);
  const [productRequired, setProductRequired] = useState(false);
  const [listFinalProduct, setListFinalProduct] = useState([]);
  const [recapFinalProduct, setRecapFinalProduct] = useState([]);
  const [productions, seProductions] = useState([]);
  const [selectedTva, setSelectedTva] = useState({});
  const [sellOrderId, setSellOrderId] = useState(null);
  const [loadingaddingFile, setLoadingaddingFile] = useState(false);
  const [totalTTC, setTotalTTC] = useState(0);
  const [totalHt, setTotalHt] = useState(0);
  const [openModalAddPayment, setOpenModalAddPayment] = useState(false);
  const [openModalSendOrder, setOpenModalSendOrder] = useState(false);
  const [openModalgetPieces, setOpenModalgetPieces] = useState(false);
  const [disablePayment, setDisablePayment] = useState(false);
  const [loadingAddPayment, setloadingAddPayment] = useState(false);
  const [loadingGetProduct, setLoadingGetProduct] = useState(false);
  const [factureType, setFactureType] = useState("");

  const inputFileRef = useRef(null);
  const inputFilePayment = useRef(null);
  const divRef = useRef(null);

  const arrayAllCatgories = useSelector(
    (state) => state.productServices.arrayAllCatgories
  );

  const sellOrderIdReducer = useSelector(
    (state) => state.sellOrderReducer.sellOrderId
  );
  const sellOrderData = useSelector(
    (state) => state.sellOrderReducer.sellOrder
  );
  const dataPieces = useSelector((state) => state.sellOrderReducer.dataPieces);
  const finalProducts = useSelector(
    (state) => state.finalProductReducer.finalProducts
  );
  const arrayAllClient = useSelector(
    (state) => state.userServices.arrayAllClient
  );
  const arrayAllActivity = useSelector(
    (state) => state.productServices.arrayAllActivity
  );
  const arrayPayment = useSelector((state) => state.order.arrayPayment);

  useEffect(() => {
    if (finalProducts.length > 0) {
      let data = finalProducts.map((item) => {
        return { ...item, isSelected: false }; //quantity:0
      });

      setListFinalProduct(data);
    }
  }, [finalProducts]);

  useEffect(() => {
    if (sellOrderIdReducer) {
      setSellOrderId(sellOrderIdReducer);
    }
  }, [sellOrderIdReducer]);

  useEffect(() => {
    const dataClinet = {
      fullname: "",
      email: "",
      country: "",
      type: "",
    };
    if (!sellOrderId) {
      dispatch(actionCreator.emptyStateSellOrder());
    }

    dispatch(actionCreator.getAllClient(dataClinet));
    dispatch(actionCreator.getAllActivity());
    dispatch(actionCreator.getAllCategorys());

    const dataFinalProduct = {
      categoryId: "",
      name: "",
    };
    dispatch(actionCreator.searchFinalProduct(dataFinalProduct));
  }, []);

  useEffect(() => {
    if (
      location.state &&
      location.state.sellOrderId &&
      location.state.source !== "add"
    ) {
      setLoading(true);
      setSellOrderId(location.state.sellOrderId);
      dispatch(
        actionCreator.getSellOrderById(location.state.sellOrderId, setLoading)
      );
      dispatch(
        actionCreator.getAllPaymentBySellOrderId(location.state.sellOrderId)
      );
    }
  }, [location]);

  useEffect(() => {
    if (
      sellOrderData &&
      sellOrderData.activityId &&
      location.state.source !== "add"
    ) {
      //&& location.state.source !== "add"
      setSellOrder({
        activityId: sellOrderData.activityId,
        quantity: sellOrderData.quantity,
        amountHt: sellOrderData.amountHt,
        amountTtc: sellOrderData.amountTtc,
        startProductionDate: sellOrderData.startProductionDate,
        endProductionDate: sellOrderData.endProductionDate,
        expectedDeliveryDate: sellOrderData.expectedDeliveryDate,
        statusDelivery: sellOrderData.statusDelivery,
        statusPayment: sellOrderData.statusPayment,
        statusProduction: sellOrderData.statusProduction,
        clientId: sellOrderData.clientId,
        discounts: sellOrderData.discounts,
        sellOrderType: sellOrderData.sellOrderType,
        profit: sellOrderData.profit,
        pieces: sellOrderData.pieces,
        noteInterne: sellOrderData.noteInterne,
        //productions : sellOrderData.productions
        //finalProductIds: sellOrderData.finalProducts,
      });

      seProductions(sellOrderData.productions);
      setRecapFinalProduct(sellOrderData.finalProducts);
      let tva = 0;
      if (sellOrderData.client && sellOrderData.client.tva) {
        tva = sellOrderData.client.tva;
      }
      subtotal(sellOrderData.finalProducts, tva);
      setSelectedTva(tva);
    }
    if (sellOrderData && location.state.source === "add") {
      setRecapFinalProduct(sellOrderData.finalProducts);
      seProductions(sellOrderData.productions);
    }
  }, [sellOrderData]);

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
  const [errorInputPayment, setErrorInputPayment] = useState("");
  const [selectedItem, setSelectedItem] = useState("Informations générales");

  const handleChangeSellOrder = (prop) => (event) => {
    setSellOrder({ ...sellOrder, [prop]: event.target.value });
  };

  const handleChangeAttributeSearch = (prop) => (event) => {
    setAttributeSearch({
      ...attributeSearch,
      [prop]: event.target.value,
    });
  };

  const handleAddFinalProductToSellOrder = (product) => {
    //if (location.state.source === "update") {
    const data = {
      id: sellOrderId,
      deleteFinalProductIds: [],
      addFinalProductIds: [
        {
          finalProductId: product.id,
          quantity: product.orderedQuantity,
          sellOrderId: sellOrderId,
        },
      ],
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        //dispatch(actionCreator.getSellOrderById(sellOrderId));
      },
    };
    dispatch(actionCreator.updateFinalProductsForSellOrder(data));
    // } else {
    //   let finalProductIds = sellOrder.finalProductIds;

    //   const index = finalProductIds.indexOf(product.id);
    //   if (index !== -1) {
    //     finalProductIds.splice(index, 1);
    //   } else {
    //     finalProductIds.push(product.id);
    //   }

    //   setSellOrder({ ...sellOrder, finalProductIds: finalProductIds });
    // }
  };

  const createSellOrder = () => {
    const selectedFinalProduct = [];

    for (let index = 0; index < listFinalProduct.length; index++) {
      if (
        listFinalProduct[index].isSelected &&
        listFinalProduct[index].orderedQuantity
      ) {
        selectedFinalProduct.push({
          finalProductId: listFinalProduct[index].id,
          quantity: listFinalProduct[index].orderedQuantity,
        });
      }
    }
    if (
      sellOrder.activityId !== "" &&
      // (sellOrder.startProductionDate !== "" && location.state.type==="direct")&&
      // (sellOrder.endProductionDate !== ""&& location.state.type==="direct") &&

      selectedFinalProduct.length > 0
    ) {
      const data = {
        activityId: sellOrder.activityId,
        quantity: sellOrder.quantity,
        amountHt: totalHt,
        amountTtc: sellOrder.amountTtc,
        startProductionDate: sellOrder.startProductionDate,
        endProductionDate: sellOrder.endProductionDate,
        expectedDeliveryDate: sellOrder.expectedDeliveryDate
          ? sellOrder.expectedDeliveryDate
          : null,
        statusDelivery:
          sellOrder.statusProduction !== "CRÉER"
            ? sellOrder.statusDelivery
            : "NON LIVRÉE",
        statusPayment: "",
        statusProduction: sellOrder.statusProduction,
        clientId: sellOrder.clientId ? sellOrder.clientId : null,
        finalProductIds: selectedFinalProduct,
        discounts: sellOrder.discounts ? sellOrder.discounts : 0,
        sellOrderType: sellOrder.sellOrderType
          ? sellOrder.sellOrderType
          : "DIRECT",
        noteInterne: sellOrder.noteInterne,
        //productions : sellOrder.productions
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          setSelectedItem("Recaputilatif");
          //navigate("/commande-vente");
          //dispatch(actionCreator.getSellOrderById(sellOrderId));
        },
      };
      dispatch(actionCreator.createSellOrder(data));
    } else {
      setAllInputRequired(true);
      if (!selectedFinalProduct.length > 0) {
        setProductRequired(true);
      }
      setTimeout(() => {
        setAllInputRequired(false);
        if (!selectedFinalProduct.length > 0) {
          setProductRequired(false);
        }
      }, 3000);
    }
  };

  const handleDeleteProduct = (product) => {
    setItemToDelete(product); // set the item to be deleted
    setOpenModalDeleteOrder(true); // show the confirmation modal
  };

  const handleCancelDelete = () => {
    setItemToDelete({}); // set the item to be deleted
    setOpenModalDeleteOrder(false); // show the confirmation modal
  };

  const handleConfirmDelete = () => {
    const data = {
      id: sellOrderId,
      deleteFinalProductIds: [itemToDelete.id],
      addFinalProductIds: [],
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        dispatch(actionCreator.getSellOrderById(sellOrderId));
      },
    };
    dispatch(actionCreator.updateFinalProductsForSellOrder(data));
    setItemToDelete({}); // reset itemToDelete state
    setOpenModalDeleteOrder(false); // hide the confirmation modal
  };

  const updateSellOrder = () => {
    const data = {
      id: sellOrderId,
      sellOrder,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        //navigate('/produit-fini')
        //dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
      },
    };
    dispatch(actionCreator.updateSellOrder(data));
  };

  const onReload = () => {
    setAttributeSearch({
      categoryId: "",
      name: "",
    });
    const data = {
      categoryId: "",
      name: "",
    };
    searchFinalProduct(data);
  };

  const searchFinalProduct = (data) => {
    dispatch(actionCreator.searchFinalProduct(data));
  };

  const handleClick = (finalProduct) => {
    const updatedList = listFinalProduct.map((item) => {
      if (item.id === finalProduct.id) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });

    setListFinalProduct(updatedList);
  };

  const handleOrderQuantityChange = (e, finalProduct) => {
    const updatedList = listFinalProduct.map((item) => {
      if (item.id === finalProduct.id) {
        return { ...item, orderedQuantity: e.target.value };
      }
      return item;
    });

    setListFinalProduct(updatedList);
  };

  const handleSetTotalAmount = (att, value) => {
    if (att === "amountHt") {
      setTotalHt(value);
    } else {
      setSellOrder({ ...sellOrder, [att]: value });
      if (value > 0) {
        setTotalTTC(value);
      }
    }
  };

  const subtotal = (items, tvaPercentage) => {
    const tvaP = tvaPercentage ? tvaPercentage.percentage : 0;
    let totalHT = 0;
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      totalHT += row.sellOrderFinalProducts.quantity * row.sellPriceHT;
    }
    let totalTTC = 0;
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      totalTTC +=
        row.sellOrderFinalProducts.quantity * row.sellPriceHT +
        (row.sellOrderFinalProducts.quantity * row.sellPriceHT * tvaP) / 100;
    }

    if (sellOrder && sellOrder.discounts) {
      totalTTC = totalTTC - (totalTTC * sellOrder.discounts) / 100;
    }
    setTotalHt(totalHT);
    setTotalTTC(totalTTC);
  };

  const handleUpdatePayment = (payment) => {
    let data = payment;
    data.file = null;
    setPaymentData(data);
    setOpenModalAddPayment(true);
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
      for (let index = 0; index < arrayPayment.length; index++) {
        const payment = arrayPayment[index];
        amoutPayed += payment.amount;
      }
      let rest = totalTTC - amoutPayed;

      if (parseFloat(paymentData.amount) > rest) {
        return enqueueSnackbar("Le montant a dépassé le total TTC", {
          variant: "warning",
        });
      }

      var formData = new FormData();

      // formData.append("orderId", null);
      formData.append("sellOrderId", sellOrderId);
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
          dispatch(actionCreator.getAllPaymentBySellOrderId(sellOrderId));
          setOpenModalAddPayment(false);
          setloadingAddPayment(false);
        },
      };
      if (!paymentData.id) {
        await dispatch(actionCreator.createPayment(formData, data));
      } else {
        await dispatch(actionCreator.updatePayment(formData, data));
      }

      dispatch(actionCreator.getSellOrderById(sellOrderId));

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

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleFileSelect = (event) => {
    setLoadingaddingFile(true);
    var formData = new FormData();
    formData.append("file", event.target.files[0]);
    const data = {
      formData,
      sellOrderId,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        dispatch(actionCreator.getSellOrderById(sellOrderId));
        setLoadingaddingFile(false);
      },
    };
    dispatch(actionCreator.addFactureToSellOrder(data));
    // Do something with the selected file, like uploading it to a server
  };

  const handleButtonClickForPayment = () => {
    inputFilePayment.current.click();
  };

  const handleFileSelectForPayment = (event) => {
    setPaymentData({ ...paymentData, ["file"]: event.target.files[0] });
  };

  const sendSellOrder = async () => {
    const data = {
      sellOrderId,
      factureType,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    // if(factureOrCommande ==="commande de vente"){
    //   await dispatch(actionCreator.sendSellOrderViaEmail(data));
    // }else{
    dispatch(actionCreator.factureSellOrderViaEmail(data));
    //}

    setOpenModalSendOrder(false);
  };

  const getTheProductNeeded = async () => {
    setLoadingGetProduct(true);
    // setOpenModalgetPieces(true)
    const data = {
      sellOrderId,
      setLoadingGetProduct,
      setOpenModalgetPieces,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        //dispatch(actionCreator.getSellOrderById(sellOrderId));
      },
    };
    dispatch(actionCreator.getTheProductNeeded(data));
  };

  const validatePieceSelected = async () => {
    const data = {
      selectedPieces: dataPieces.selectedPieces,
      arrayFinalProductAndQuantity: dataPieces.arrayFinalProductAndQuantity,
      id: sellOrderId,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        //dispatch(actionCreator.getSellOrderById(sellOrderId));
      },
    };
    dispatch(actionCreator.validatePieceSelected(data));
    setOpenModalgetPieces(false);
  };

  const handlePrint = useReactToPrint({
    content: () => divRef.current,
  });

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082" + fileUrl, "_blank");
  };

  // const updatePiecequantity = (id,value) => {
  //   const data = {
  //     id,
  //     value,
  //     handleClickVariant: (msg, val) => {
  //       let variant = val;
  //       enqueueSnackbar(msg, { variant });
  //       //dispatch(actionCreator.getSellOrderById(sellOrderId));
  //     },
  //   };
  //   dispatch(actionCreator.updatePiecequantity(data))
  // };

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    return array[array.length - 1];
  };

  function generateCode(id) {
    const code = id.toString().padStart(14, "0");
    return code;
  }

  const getCodaBarImg = (id) => {
    const img = dataPieces.selectedPiecesCodaBar.find(
      (element) => element.id === id
    );
    return img.barcode;
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <MenuAnchorSellOrder
              handleSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              sellOrderId={sellOrderId}
              source={location.state.source}
              statusProduction={sellOrder.statusProduction}
              type={location.state.type}
            />

            {selectedItem === "Informations générales" && (
              <>
                <Typography
                  sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}
                >
                  Commande de vente
                </Typography>
                <Paper sx={{ width: "100%", p: 2 }}>
                  <div className="sell-order-container">
                    <div className="w-50">
                      <Typography
                        className="color-title-1"
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 1, mt: 3 }}
                      >
                        Activite*
                      </Typography>

                      <FormControl fullWidth size="small">
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          value={sellOrder.activityId}
                          onChange={(e) =>
                            setSellOrder({
                              ...sellOrder,
                              activityId: e.target.value,
                            })
                          }
                          disabled={
                            location && location.state.source === "details"
                          }
                          // input={<OutlinedInput label="Name" />}
                          //MenuProps={MenuProps}
                        >
                          {arrayAllActivity &&
                            arrayAllActivity.map((activity, key) => (
                              <MenuItem
                                key={activity.id}
                                value={activity.id}
                                //style={getStyles(category.name, listCategories, theme)}
                              >
                                {activity.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>

                      {allInputRequired && !sellOrder.activityId ? (
                        <p className="red-color">l'activite est obligatoire!</p>
                      ) : null}

                      {/* {location.state.type ==="internal"?null: */}
                      <>
                        <Typography
                          className="color-title-1"
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                        >
                          Client*
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={sellOrder.clientId}
                            onChange={(e) =>
                              setSellOrder({
                                ...sellOrder,
                                clientId: e.target.value,
                              })
                            }
                            disabled={
                              location && location.state.source === "details"
                            }
                            // input={<OutlinedInput label="Name" />}
                            //MenuProps={MenuProps}
                          >
                            {arrayAllClient &&
                              arrayAllClient.map((client, key) => (
                                <MenuItem
                                  key={client.id}
                                  value={client.id}
                                  onClick={() => setSelectedTva(client.tva)}
                                  //style={getStyles(category.name, listCategories, theme)}
                                >
                                  {client.fullname}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </>
                      {/* } */}

                      {allInputRequired && !sellOrder.clientId ? (
                        <p className="red-color">Client est obligatoire!</p>
                      ) : null}

                      {location.state.type === "direct" ? null : (
                        <>
                          <Typography
                            className="color-title-1"
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                          >
                            Status Production
                          </Typography>
                          <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                              {/* <InputLabel id="demo-simple-select-label">Status Production</InputLabel> */}
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sellOrder.statusProduction}
                                label="Statut Production"
                                onChange={handleChangeSellOrder(
                                  "statusProduction"
                                )}
                                disabled={
                                  location &&
                                  location.state.source === "details"
                                }
                              >
                                {/* <MenuItem value="" key={0}></MenuItem> */}
                                <MenuItem value="CRÉER" key={1}>
                                  CRÉER
                                </MenuItem>
                                <MenuItem
                                  value="EN COURS DE PRODUCTION"
                                  key={2}
                                >
                                  EN COURS DE PRODUCTION
                                </MenuItem>
                                <MenuItem value="FINI" key={3} disabled>
                                  FINI
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      )}

                      {/* {location.state.type ==="internal"?null: */}
                      <>
                        <Typography
                          className="color-title-1"
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                        >
                          Remises
                        </Typography>
                        <div className="d-flex align-items-center w-85-px">
                          <TextField
                            type="number"
                            size="small"
                            value={sellOrder.discounts}
                            disabled={
                              location && location.state.source === "details"
                            }
                            onChange={handleChangeSellOrder("discounts")}
                            inputProps={{ min: 0, max: 100 }}
                          />
                          %
                        </div>
                      </>

                      <>
                        <Typography
                          className="color-title-1"
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                        >
                          Note interne
                        </Typography>

                        <TextareaAutosize
                          fullWidth
                          minRows={5}
                          className="text-area-style"
                          value={sellOrder.noteInterne}
                          disabled={
                            location && location.state.source === "details"
                          }
                          onChange={handleChangeSellOrder("noteInterne")}
                        />
                      </>
                      {/* } */}

                      {allInputRequired &&
                      !sellOrder.statusProduction &&
                      location.state.type !== "direct" ? (
                        <p className="red-color">
                          Status Production est obligatoire!
                        </p>
                      ) : null}

                      {sellOrder &&
                      sellOrder.statusProduction !== "CRÉER" &&
                      sellOrder.statusProduction !== "" &&
                      productions &&
                      productions.length > 0 ? (
                        <>
                          <Typography
                            className="color-title-1"
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                          >
                            Status de livraison
                          </Typography>

                          <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                              {/* <InputLabel id="demo-simple-select-label"></InputLabel> */}
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sellOrder.statusDelivery}
                                label="Statut Production"
                                onChange={handleChangeSellOrder(
                                  "statusDelivery"
                                )}
                                disabled={
                                  location &&
                                  location.state.source === "details"
                                }
                              >
                                {/* <MenuItem value="" key={0}></MenuItem> */}

                                <MenuItem value="LIVRÉE TOTALEMENT" key={1}>
                                  LIVRÉE TOTALEMENT
                                </MenuItem>

                                {/* {(sellOrder.statusProduction === "EN COURS DE PRODUCTION"|| sellOrder.statusProduction === "FINI")&& */}
                                <MenuItem value="LIVRÉE PARTIELLEMENT" key={2}>
                                  LIVRÉE PARTIELLEMENT
                                </MenuItem>

                                {/* {(sellOrder.statusProduction === "EN COURS DE PRODUCTION" || sellOrder.statusProduction === "FINI")&& */}
                                <MenuItem value="NON LIVRÉE" key={3}>
                                  NON LIVRÉE
                                </MenuItem>

                                {/* {sellOrder.statusProduction === "FINI"&& */}
                                <MenuItem value="RÉCEPTIONNÉ" key={4}>
                                  RÉCEPTIONNÉ
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      ) : null}

                      {allInputRequired &&
                      sellOrder &&
                      sellOrder.statusProduction !== "CRÉER" &&
                      sellOrder.statusProduction !== "" &&
                      productions &&
                      productions.length > 0 ? (
                        <p className="red-color">
                          Status de livraison est obligatoire!
                        </p>
                      ) : null}
                    </div>

                    <div>
                      {location.state.type === "direct" ? null : (
                        <>
                          <Typography
                            className="color-title-1"
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1, mt: 3 }}
                          >
                            Date d’entré en prodcution prévus
                          </Typography>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              minDate={toDayDate}
                              inputFormat="YYYY-MM-DD"
                              value={sellOrder.startProductionDate}
                              onChange={(newValue) => {
                                setSellOrder({
                                  ...sellOrder,
                                  startProductionDate: newValue,
                                });
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              disabled={
                                location && location.state.source === "details"
                              }
                            />
                          </LocalizationProvider>
                        </>
                      )}

                      {allInputRequired && !sellOrder.startProductionDate ? (
                        <p className="red-color">
                          {" "}
                          Date d’entré en prodcution est obligatoire!
                        </p>
                      ) : null}

                      {location.state.type === "direct" ? null : (
                        <>
                          <Typography
                            className="color-title-1"
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                          >
                            Date Fin de prodcution prévus
                          </Typography>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              minDate={toDayDate}
                              inputFormat="YYYY-MM-DD"
                              value={sellOrder.endProductionDate}
                              onChange={(newValue) => {
                                setSellOrder({
                                  ...sellOrder,
                                  endProductionDate: newValue,
                                });
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              disabled={
                                location && location.state.source === "details"
                              }
                            />
                          </LocalizationProvider>
                        </>
                      )}

                      {allInputRequired && !sellOrder.endProductionDate ? (
                        <p className="red-color">
                          {" "}
                          Date Fin de prodcution est obligatoire!
                        </p>
                      ) : null}
                      {/* 
              {location.state.type ==="direct"?null: */}

                      <>
                        <Typography
                          className="color-title-1"
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                        >
                          Date de livraison prévus
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            minDate={toDayDate}
                            inputFormat="YYYY-MM-DD"
                            value={sellOrder.expectedDeliveryDate}
                            onChange={(newValue) => {
                              setSellOrder({
                                ...sellOrder,
                                expectedDeliveryDate: newValue,
                              });
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            disabled={
                              location && location.state.source === "details"
                            }
                          />
                        </LocalizationProvider>
                        {allInputRequired && !sellOrder.expectedDeliveryDate ? (
                          <p className="red-color">
                            {" "}
                            Date de livraison prévus est obligatoire!
                          </p>
                        ) : null}
                      </>
                      {/* } */}
                      {location.state.type === "direct" ? null : (
                        <>
                          <Typography
                            className="color-title-1"
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1, mt: 1 }}
                          >
                            Type
                          </Typography>
                          <FormControl size="small" sx={{ width: "200px" }}>
                            <InputLabel id="demo-simple-select-label">
                              Type
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={sellOrder.sellOrderType}
                              placeholder=""
                              label="sellOrderType"
                              onChange={(e) =>
                                setSellOrder({
                                  ...sellOrder,
                                  sellOrderType: e.target.value,
                                })
                              }
                              disabled={
                                location && location.state.source === "details"
                              }
                            >
                              <MenuItem value="LOCAUX">Locaux</MenuItem>
                              <MenuItem value="EXPORTATION">
                                Exportation
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </>
                      )}
                    </div>

                    {allInputRequired && !sellOrder.sellOrderType ? (
                      <p className="red-color">
                        {" "}
                        Date de livraison prévus est obligatoire!
                      </p>
                    ) : null}
                  </div>

                  {location && location.state.source === "update" && role !=="RESPONSABLE DE PRODUCTION" ? (
                    <Box sx={{ mt: 2, textAlign: "end" }}>
                      <button
                        onClick={() => updateSellOrder()}
                        className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                      >
                        Modifier
                      </button>
                    </Box>
                  ) : null}
                </Paper>

                <Grid item xs={12} md={2} sx={{ textAlign: "end", mt: 2 }}>
                  <button
                    className="btn- bg-primary py-2 px-3 rounded-lg"
                    style={{ color: "#000" }}
                    onClick={() =>
                      setSelectedItem(
                        location.state.source === "details"
                          ? "Recaputilatif"
                          : "Produits à commander"
                      )
                    }
                  >
                    Suivant
                  </button>
                </Grid>
              </>
            )}

            {selectedItem === "Produits à commander" && (
              <>
                {(location && location.state.source === "add") ||
                location.state.source === "update" ? (
                  <>
                    <Typography
                      className="color-title"
                      sx={{ fontWeight: "600", mt: 2 }}
                    >
                      Gestion des Produit Fini
                    </Typography>

                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <Grid container sx={{ p: 2 }} spacing={4}>
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
                          <FormControl fullWidth size="small">
                            <TextField
                              size="small"
                              value={attributeSearch.name}
                              onChange={handleChangeAttributeSearch("name")}
                            />
                          </FormControl>
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
                          Categorie:
                          <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">
                              Categories
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={attributeSearch.categoryId}
                              onChange={handleChangeAttributeSearch(
                                "categoryId"
                              )}
                            >
                              {arrayAllCatgories &&
                                arrayAllCatgories.map((category, key) => (
                                  <MenuItem value={category.id} key={key}>
                                    {category.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          className="flex-Box"
                          sx={{ justifyContent: "end" }}
                        >
                          <Button
                            onClick={() => searchFinalProduct(attributeSearch)}
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
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="d-flex">
                        <Typography
                          className="color-title"
                          sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
                        >
                          Liste des Produits fini 
                        </Typography>
                        <Box className="number-listing">
                          {" "}
                          <Typography
                            className="color-title"
                            sx={{ fontSize: "0.85rem", fontWeight: "600" }}
                          >
                            {" "}
                            {finalProducts && finalProducts.length} Produit Fini
                          </Typography>{" "}
                        </Box>
                      </div>
                    </Grid>
                    <Paper sx={{ width: "100%", mt: 2 }}>
                      {allInputRequired && productRequired ? (
                        <p className="red-color">
                          {" "}
                          Choisissez au moins un produit fini et son quantité
                        </p>
                      ) : null}

                      <ListFinalProductForSellOrder
                        arrayAllProduct={listFinalProduct}
                        source={location.state.source}
                        handleClick={handleClick}
                        handleOrderQuantityChange={handleOrderQuantityChange}
                        tvaPercentage={selectedTva && selectedTva.percentage}
                        handleSetTotalAmount={handleSetTotalAmount}
                        handleAddFinalProductToSellOrder={
                          handleAddFinalProductToSellOrder
                        }
                        recapFinalProduct={recapFinalProduct}
                        discounts={sellOrder.discounts}
                        type={location.state.type}
                      />
                    </Paper>
                  </>
                ) : null}

                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "20px",
                  }}
                >
                  {!sellOrderId ? (
                    <button
                      onClick={() => createSellOrder()}
                      className="btn- bg-primary py-2 px-3 rounded-lg"
                      style={{ color: "#000" }}
                    >
                      Cree
                    </button>
                  ) : (
                    <button
                      className="btn- bg-primary py-2 px-3 rounded-lg"
                      style={{ color: "#000" }}
                      onClick={() => setSelectedItem("Recaputilatif")}
                    >
                      Suivant
                    </button>
                  )}
                </Grid>
              </>
            )}
            {selectedItem === "Recaputilatif" &&
              sellOrder &&
              recapFinalProduct && ( //selectedTva&&
                <>
                  <div>
                    <Typography
                      sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}
                    >
                      Recapitulatife commande de vente
                    </Typography>
                    <Paper sx={{ width: "100%" }}>
                      <RecapSellOrder
                        source={location.state.source}
                        arrayAllProductOrdered={recapFinalProduct}
                        tvaPercentage={
                          selectedTva && selectedTva.percentage
                            ? selectedTva.percentage
                            : 0
                        }
                        handleSetTotalAmount={handleSetTotalAmount}
                        handleDeleteProduct={handleDeleteProduct}
                        discounts={sellOrder && sellOrder.discounts}
                        profit={sellOrder && sellOrder.profit}
                        totalHt={totalHt}
                        totalTTC={totalTTC}
                        // selectProduct={selectProduct}
                        // handleOrderQuantityChange={handleOrderQuantityChange}
                        // handleClick={handleClick}
                        // openModalAddProductCommande={(details) =>
                        //   openModalAddProductCommande(details)
                        // }
                      />
                    </Paper>
                    {sellOrder.pieces && sellOrder.pieces.length > 0 ? (
                      <>
                        <Typography
                          sx={{
                            pt: 2,
                            pb: 1,
                            color: "#000",
                            fontWeight: "600",
                          }}
                        >
                          Liste de Element
                        </Typography>
                        <Paper sx={{ width: "100%" }}>
                          <ListElementOfExitVoucher
                            productPieces={sellOrder.pieces}
                          />
                        </Paper>
                      </>
                    ) : null}

                    {sellOrderId && role !=="RESPONSABLE DE PRODUCTION" && (
                      <Paper sx={{ width: "100%", p: 2, mt: 2 }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <>
                            <input
                              type="file"
                              ref={inputFileRef}
                              className="d-none"
                              style={{ display: "none" }}
                              onChange={(e) => handleFileSelect(e)}
                              required
                            />

                            {/* {location.state.type === "direct" ? null : } */}
                            {/* <button
                              onClick={() => handleButtonClick()}
                              style={{ color: "#000", width: "220px" }}
                              className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                            >
                              {loadingaddingFile ? (
                                <CircularProgress
                                  color="inherit"
                                  className="w-h-20"
                                />
                              ) : (
                                "+ Bon de commande"
                              )}
                            </button> */}
                          </>

                          {/* {sellOrderData.sellOrderFile && (
                            <Typography
                              className="add-commande-span"
                              sx={{ pr: 4 }}
                            >
                              Bon de commande associé :
                              <span
                                className="pointer"
                                style={{
                                  color: "rgb(101 133 187)",
                                  fontWeight: "600",
                                }}
                                onClick={() => {
                                  openFile(sellOrderData.sellOrderFile);
                                }}
                              >
                                {" "}
                                {sellOrderData.sellOrderFile
                                  ? getFileName(sellOrderData.sellOrderFile)
                                  : ""}
                              </span>
                            </Typography>
                          )} */}
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          {/* {location.state.type === "direct" ? null : */}
                          <button
                            onClick={() => {
                              setOpenModalSendOrder(true),
                                setFactureType("Facture Proforma");
                            }}
                            className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                            style={{ width: "220px" }}
                          >
                            Envoyer facture proforma
                          </button>

                          {/* } */}

                          {sellOrderData.file && (
                            <Typography
                              className="add-commande-span"
                              sx={{ pr: 4 }}
                            >
                              Facture proforma associé :
                              <span
                                className="pointer"
                                style={{
                                  color: "rgb(101 133 187)",
                                  fontWeight: "600",
                                }}
                                onClick={() => {
                                  openFile(sellOrderData.file);
                                }}
                              >
                                {" "}
                                {sellOrderData.file
                                  ? getFileName(sellOrderData.file)
                                  : ""}
                              </span>
                            </Typography>
                          )}
                        </div>

                        {/* <div className="d-flex align-items-center justify-content-between">
                    
                          <button
                            onClick={() => {
                              setOpenModalSendOrder(true),
                                setFactureType("Facture");
                            }}
                            className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                            style={{ width: "220px" }}
                          >
                            Envoyer facture
                          </button>

                  

                          {sellOrderData.factureFile && (
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
                                  openFile(sellOrderData.factureFile);
                                }}
                              >
                                {" "}
                                {sellOrderData.factureFile
                                  ? getFileName(sellOrderData.factureFile)
                                  : ""}
                              </span>
                            </Typography>
                          )}
                        </div> */}

                        {sellOrderId && location.state.type !== "direct" ? ( //&& (sellOrder.statusProduction === "EN COURS DE PRODUCTION" sellOrder.statusProduction === "FINI")?
                          <button
                            onClick={() => getTheProductNeeded()}
                            className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                            style={{ width: "220px" }}
                          >
                            Bon de sortie
                          </button>
                        ) : null}
                      </Paper>
                    )}
                  </div>

                  <Grid item xs={12} md={2} sx={{ textAlign: "end", mt: 2 }}>
                    {/* {location.state.type === "direct" ? 
          <button className="btn- bg-primary py-2 px-3 rounded-lg" style={{color:"#000"}} onClick={()=>setSelectedItem("Gestion de production")}>
          Suivant
          </button> 
         : */}

                    <button
                      className="btn- bg-primary py-2 px-3 rounded-lg"
                      style={{ color: "#000" }}
                      onClick={() => setSelectedItem("Paiements")}
                    >
                      Suivant
                    </button>
                    {/* } */}
                  </Grid>
                </>
              )}

            {selectedItem === "Paiements" && (
              <>
                {sellOrderId ? (
                  <Typography
                    sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}
                  >
                    Liste des paiements de la commande de vente : {sellOrderId}
                  </Typography>
                ) : null}
                {sellOrderId ? (
                  <>
                    <Paper sx={{ width: "100%" }}>
                      <TablePaymentOrder
                        arrayPayment={arrayPayment}
                        totalTTC={totalTTC}
                        handleUpdatePayment={handleUpdatePayment}
                        setDisablePayment={setDisablePayment}
                      />
                    </Paper>

                    {/* {location.state.type === "internal" ? null : */}
                    {/* <Paper sx={{ width: "100%", p: 2, mt: 2 }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-3 align-items-center">
                          <Typography className="add-commande-span">
                            Renvoyer facture PF :
                          </Typography>

                          <button
                            onClick={() => {
                              setOpenModalSendOrder(true),
                                setFactureType("Facture Proforma");
                            }}
                            className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                          >
                            <SendIcon />
                          </button>

                          {sellOrderData.file && (
                            <button
                              onClick={() => openFile(sellOrderData.file)}
                              className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                            >
                              <ReceiptIcon />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-3 align-items-center">
                          <Typography className="add-commande-span">
                            Renvoyer facture :
                          </Typography>

                          <button
                            onClick={() => {
                              setOpenModalSendOrder(true),
                                setFactureType("Facture");
                            }}
                            className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                          >
                            <SendIcon />
                          </button>

                          {sellOrderData.factureFile && (
                            <button
                              onClick={() =>
                                openFile(sellOrderData.factureFile)
                              }
                              className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                            >
                              <ReceiptIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    </Paper> */}
                    {/* } */}
                  </>
                ) : null}

                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    gap: "20px",
                  }}
                >
                  {location.state.type !== "direct" ? (
                    <button
                      className="btn- bg-primary py-2 px-3 rounded-lg"
                      style={{ color: "#000" }}
                      onClick={() => setSelectedItem("Gestion de production")}
                    >
                      Suivant
                    </button>
                  ) : null}
                  {disablePayment ? null : (
                    <button
                      onClick={() => setOpenModalAddPayment(true)}
                      className="btn- bg-primary py-2 px-3 rounded-lg"
                      style={{ color: "#000" }}
                    >
                      + Paiement
                    </button>
                  )}
                </Grid>
              </>
            )}

            {selectedItem === "Gestion de production" && (
              <>
                {sellOrderId && sellOrder.statusProduction !== "CRÉER" ? (
                  <>
                    <Typography
                      sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}
                    >
                      Productions
                    </Typography>

                    <Paper sx={{ width: "100%", p: 2 }}>
                      <ProductionList
                        source={location.state.source}
                        arrayProductions={productions}
                        sellOrderId={sellOrderId}
                        arrayAllFinalProduct={recapFinalProduct}
                        type="sellOrder"
                      />
                    </Paper>
                  </>
                ) : null}
              </>
            )}
          </Box>
        </>
      )}

      <Dialog
        open={openModalDeleteOrder}
        onClose={() => handleCancelDelete()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Suppression Produit"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir supprimer cette produit ?
          </DialogContentText>
        </DialogContent>
        <div className="d-flex justify-content-between p-3">
          <Button onClick={() => handleCancelDelete()} className="red-button">
            Non
          </Button>
          <Button
            onClick={() => handleConfirmDelete()}
            className="green-button"
          >
            Oui
          </Button>
        </div>
      </Dialog>

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

      <Dialog
        open={openModalSendOrder}
        onClose={() => setOpenModalSendOrder(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          {sellOrderData && sellOrderData.client ? (
            <DialogContentText id="alert-dialog-description">
              Votre facture pour la client{" "}
              <strong>
                "{sellOrderData && sellOrderData.client.fullname}"
              </strong>{" "}
              sera envoyé via e-mail{" "}
              <strong>"{sellOrderData && sellOrderData.client.email}"</strong>
            </DialogContentText>
          ) : (
            <DialogContentText id="alert-dialog-description">
              Votre facture sera envoyé via e-mail
            </DialogContentText>
          )}
        </DialogContent>
        <div className="d-flex justify-content-between p-3">
          <Button
            onClick={() => setOpenModalSendOrder(false)}
            className="red-button"
          >
            Annuler
          </Button>
          <Button onClick={() => sendSellOrder()} className="green-button">
            Confirmer
          </Button>
        </div>
      </Dialog>

      <Dialog
        fullWidth={true}
        open={openModalgetPieces}
        onClose={() => setOpenModalgetPieces(false)}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Bon de sortie stock :{" "}
          {moment(sellOrder.startProductionDate).format("YYYY")} -"
          {sellOrderId && sellOrderId}"
        </DialogTitle>

        <DialogContent>
          {loadingGetProduct ? (
            <Loader />
          ) : (
            <>
              {/* <Typography
              className="color-title-1"
              variant="body2"
              sx={{ fontWeight: 600, mb: 2, mt: 1 , color :"black" }}
            >
              Type de la commande : {sellOrder&&sellOrder.sellOrderType}
            </Typography> */}

              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
              >
                Produits commandés
              </Typography>

              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Nom du produit fini{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Prix d'achat total (TND)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataPieces &&
                      dataPieces.arrayFinalProductAndQuantity &&
                      dataPieces.arrayFinalProductAndQuantity.map(
                        (row, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {row.finalProduct.name}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {row.totalPrice} TND{" "}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 2 }}
              >
                Produits à réserve
              </Typography>

              <TableContainer ref={divRef}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Nom du produit
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Quantité totale disponible
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Code à barres{" "}
                      </TableCell>
                      {/* <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Quantité à prendre</TableCell> */}
                      {/* {dataPieces && dataPieces.selectedPieces && dataPieces.selectedPieces[0].sellOrderId &&
                      <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> quantité à retourner</TableCell>
                  } */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataPieces &&
                      dataPieces.result &&
                      dataPieces.result.map((row, index) => {
                        return (
                          <TableRow hover tabIndex={-1} key={index}>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {row.product}{" "}
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {row.piecesNumber} 
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {row.element &&
                                row.element.map((element, i) => (
                                  <div className="flex-column mt-3" key={i}>
                                    <img
                                      src={getCodaBarImg(element.id)}
                                      alt="codabar"
                                      className="img-barcode"
                                    />
                                    <p style={{ textAlign: "center" }}>
                                      {element.product.name}-{element.value}(
                                      {element.product.unit.unit})
                                    </p>
                                  </div>
                                ))}
                            </TableCell>

                            {/* <TableCell sx={{ color: "#3a3541ad" }} >
                      {row.element && row.element.map((element,j) =>(
                        <p style={{padding:"40px 0"}} key={j}>{element.value} {row.units[0].unit}</p>
                       
                      ))}

                      </TableCell> */}

                            {/* {row.element[0].sellOrderId &&
                      <TableCell sx={{ color: "#3a3541ad" }}>  
                      {row.element && row.element.map((element,i) =>{
                        let data = 0
                      return(
                      <div className="d-flex gap-3 align-items-center "
                      style={{padding:"30px 0"}}
                       key={i}>
                      <TextField
                        type='number'
                        size='small'
                        sx={{width:"100px"}}
                        inputProps={{ min: 0,max:element.value }}
                        onChange={(e)=>data=e.target.value}
                      />
                          <AddIcon sx={{color:"#81b471",cursor:"pointer"}} onClick={() => updatePiecequantity(element.id,data)}/>
                          
                      </div>
                      )})}
                      </TableCell>
                      } */}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="d-flex justify-content-end p-3 gap-3">
                <Button onClick={handlePrint} className="green-button">
                  Imprimer
                </Button>

                {dataPieces.selectedPieces &&
                dataPieces.selectedPieces[0].sellOrderId ? null : (
                  <Button
                    onClick={() => validatePieceSelected()}
                    className="green-button"
                  >
                    Reserver
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateSellOrder;
