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

import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import ListFinalProductForSellOrder from "../sellOrder/listFinalProductForSellOrder";
import RecapDevis from "./recapDevis";
import TablePaymentOrder from "../Achat/TablePaymentOrder";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useReactToPrint } from "react-to-print";
import SendIcon from "@mui/icons-material/Send";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Loader from "../../components/loader";

function CreateDevis(props) {
  const toDayDate = new Date();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const [devis, setDevis] = useState({
    activityId: "",
    amountHt: 0,
    amountTtc: 0,
    clientId: "",
    discounts: 0,
    finalProductIds: [],
    //productions:[]
  });
  const [attributeSearch, setAttributeSearch] = useState({
    categoryId: "",
    name: "",
  });
  const [itemToDelete, setItemToDelete] = useState({});
  const [openModalDeleteOrder, setOpenModalDeleteOrder] = useState(false);
  const [allInputRequired, setAllInputRequired] = useState(false);
  const [listFinalProduct, setListFinalProduct] = useState([]);
  const [recapFinalProduct, setRecapFinalProduct] = useState([]);
  //const [productions, seProductions] = useState([]);
  const [selectedTva, setSelectedTva] = useState({});
  const [devisId, setDevisId] = useState(null);
  //const [factureOrCommande, setFactureOrCommande] = useState('')
  const [totalTTC, setTotalTTC] = useState(0);
  const [totalHt, setTotalHt] = useState(0);
  //const [openModalAddPayment, setOpenModalAddPayment] = useState(false);
  const [openModalSendOrder, setOpenModalSendOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  //const inputFileRef = useRef(null);
  //const inputFilePayment = useRef(null);

  const arrayAllCatgories = useSelector(
    (state) => state.productServices.arrayAllCatgories
  );
  //   const arrayAllUnits = useSelector((state)=>state.productServices.arrayAllUnits)
  //   const arrayAllProduct = useSelector((state)=>state.productServices.arrayAllProduct)

  const sellOrderId = useSelector((state) => state.devisReducer.sellOrderId);
  const devisIdReducer = useSelector((state) => state.devisReducer.devisId);
  const devisData = useSelector((state) => state.devisReducer.devis);
  const dataPieces = useSelector((state) => state.devisReducer.dataPieces);
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
        return { ...item, isSelected: false, quantity: 0 };
      });

      setListFinalProduct(data);
    }
  }, [finalProducts]);

  useEffect(() => {
    if (devisIdReducer) {
      setDevisId(devisIdReducer);
    }
  }, [devisIdReducer]);

  useEffect(() => {
    const dataClinet = {
      fullname: "",
      email: "",
      country: "",
      type: "",
    };
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
      location.state.devisId &&
      location.state.source !== "add"
    ) {
      setLoading(true);
      setDevisId(location.state.devisId);
      dispatch(actionCreator.getDevisById(location.state.devisId, setLoading));
    }
  }, [location]);

  useEffect(() => {
    if (devisData && devisData.activityId && location.state.source !== "add") {
      //&& location.state.source !== "add"
      setDevis({
        activityId: devisData.activityId,
        amountHt: devisData.amountHt,
        amountTtc: devisData.amountTtc,
        clientId: devisData.clientId,
        discounts: devisData.discounts,
        //productions : devisData.productions
        //finalProductIds: devisData.finalProducts,
      });

      setRecapFinalProduct(devisData.finalProducts);
      subtotal(devisData.finalProducts, devisData.client.tva);
      setSelectedTva(devisData.client.tva);
    }
    if (devisData && location.state.source === "add") {
      setRecapFinalProduct(devisData.finalProducts);
      //seProductions(devisData.productions)
    }
  }, [devisData]);

  const handleChangeDevis = (prop) => (event) => {
    setDevis({ ...devis, [prop]: event.target.value });
  };

  const handleChangeAttributeSearch = (prop) => (event) => {
    setAttributeSearch({
      ...attributeSearch,
      [prop]: event.target.value,
    });
  };

  const handleAddFinalProductToDevis = (product) => {
    //if (location.state.source === "update") {
    const data = {
      id: devisId,
      deleteFinalProductIds: [],
      addFinalProductIds: [
        {
          finalProductId: product.id,
          quantity: product.orderedQuantity,
          deviId: devisId,
        },
      ],
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        //dispatch(actionCreator.getdevisById(devisId));
      },
    };
    dispatch(actionCreator.updateFinalProductsForDevis(data));
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

  const createDevis = () => {
    const selectedFinalProduct = [];

    for (let index = 0; index < listFinalProduct.length; index++) {
      if (
        listFinalProduct[index].isSelected &&
        listFinalProduct[index].orderedQuantity !== 0
      ) {
        selectedFinalProduct.push({
          finalProductId: listFinalProduct[index].id,
          quantity: listFinalProduct[index].orderedQuantity,
        });
      }
    }
    if (
      devis.activityId !== "" &&
      devis.clientId !== "" &&
      selectedFinalProduct.length > 0
    ) {
      const data = {
        activityId: devis.activityId,
        amountHt: totalHt,
        amountTtc: devis.amountTtc,
        clientId: devis.clientId,
        finalProductIds: selectedFinalProduct,
        discounts: devis.discounts,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          //navigate("/commande-vente");
          //dispatch(actionCreator.getSellOrderById(sellOrderId));
        },
      };
      dispatch(actionCreator.createDevis(data));
    } else {
      setAllInputRequired(true);
      setTimeout(() => {
        setAllInputRequired(false);
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
      id: devisId,
      deleteFinalProductIds: [itemToDelete.id],
      addFinalProductIds: [],
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        dispatch(actionCreator.getDevisById(devisId));
      },
    };
    dispatch(actionCreator.updateFinalProductsForDevis(data));
    setItemToDelete({}); // reset itemToDelete state
    setOpenModalDeleteOrder(false); // hide the confirmation modal
  };

  const updateDevis = () => {
    const data = {
      id: devisId,
      devis,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        //navigate('/produit-fini')
        //dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
      },
    };
    dispatch(actionCreator.updateDevis(data));
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
      setDevis({ ...devis, [att]: value });
      if (value > 0) {
        setTotalTTC(value);
      }
    }
  };

  const subtotal = (items, tvaPercentage) => {
    const tvaP = tvaPercentage.percentage;
    let totalHT = 0;
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      totalHT += row.devisFinalProducts.quantity * row.sellPriceHT;
    }
    let totalTTC = 0;
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      totalTTC +=
        row.devisFinalProducts.quantity * row.sellPriceHT +
        (row.devisFinalProducts.quantity * row.sellPriceHT * tvaP) / 100;
    }

    setTotalHt(totalHT);
    setTotalTTC(totalTTC);
  };

  const sendDevis = async () => {
    const data = {
      devisId,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    await dispatch(actionCreator.sendDevisViaEmail(data));

    setOpenModalSendOrder(false);
  };

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082" + fileUrl, "_blank");
  };

  async function convertDevisToOrder() {
    const data = {
      devisId,
      navigateToSellOrder: (id) => {
        navigate("/add-commande-vente", {
          state: { source: "details", sellOrderId: id },
        });
      },
    };
    dispatch(actionCreator.convertDevisToOrder(data));
    // if(sellOrderId){
    //   navigate("/add-commande-vente",{state:{source:"details",sellOrderId}})
    // }
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
              Devis
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
                      value={devis.activityId}
                      onChange={(e) =>
                        setDevis({ ...devis, activityId: e.target.value })
                      }
                      disabled={location && location.state.source === "details"}
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

                  {allInputRequired && !devis.activityId ? (
                    <p className="red-color">l'activite est obligatoire!</p>
                  ) : null}

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
                      value={devis.clientId}
                      onChange={(e) =>
                        setDevis({ ...devis, clientId: e.target.value })
                      }
                      disabled={location && location.state.source === "details"}
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

                  {allInputRequired && !devis.clientId ? (
                    <p className="red-color">Client est obligatoire!</p>
                  ) : null}

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
                      value={devis.discounts}
                      disabled={location && location.state.source === "details"}
                      onChange={handleChangeDevis("discounts")}
                      inputProps={{ min: 0, max: 100 }}
                    />
                    %
                  </div>
                </div>
              </div>

              {location && location.state.source === "update" ? (
                <Box sx={{ mt: 2, textAlign: "end" }}>
                  <button
                    onClick={() => updateDevis()}
                    className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                  >
                    Modifier
                  </button>
                </Box>
              ) : null}
            </Paper>

            {(location && location.state.source === "add") ||
            location.state.source === "update" ? (
              <Paper sx={{ width: "100%", p: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", pt: 3 }}
                  id="product-list"
                >
                  <div className="box-icon-info  flex-Box">
                    <InformationVariant sx={{ fontSize: "1.3rem" }} />
                  </div>
                  <Typography className="add-commande-span">
                    {" "}
                    Liste de produits fini{" "}
                  </Typography>
                </Box>

                <Grid container sx={{ p: 2 }} spacing={4}>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <TextField
                        size="small"
                        placeholder="Nom"
                        value={attributeSearch.name}
                        onChange={handleChangeAttributeSearch("name")}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Categories
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={attributeSearch.categoryId}
                        label="categorie"
                        onChange={handleChangeAttributeSearch("categoryId")}
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
                    md={3}
                    className="flex-Box"
                    sx={{ justifyContent: "end" }}
                  >
                    <button
                      onClick={() => onReload()}
                      className="btn-with-border"
                    >
                      <Reload className="color-title" />
                    </button>
                    <button
                      onClick={() => searchFinalProduct(attributeSearch)}
                      className="btn-with-border flex-Box "
                      style={{ marginLeft: ".5rem" }}
                    >
                      <Magnify className="color-title" />
                      <Typography>Chercher</Typography>
                    </button>
                  </Grid>
                </Grid>
                {allInputRequired ? (
                  <p className="red-color">
                    {" "}
                    Choisissez au moins un produit fini!
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
                    handleAddFinalProductToDevis
                  }
                  recapFinalProduct={recapFinalProduct}
                  discounts={devis.discounts}
                />
              </Paper>
            ) : null}

            <Paper sx={{ width: "100%", p: 2 }}>
              {devisId && (
                <div className="d-flex gap-3 align-items-center">
                  <Typography className="add-commande-span">Devis :</Typography>

                  <button
                    onClick={() => {
                      setOpenModalSendOrder(true);
                    }}
                    className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                  >
                    <SendIcon />
                  </button>

                  {devisData.file && (
                    <button
                      onClick={() => openFile(devisData.file)}
                      className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                    >
                      <ReceiptIcon />
                    </button>
                  )}
                </div>
              )}

            

              {location && location.state.source !== "add" ? (
                <div>
                  <Box
                    sx={{ display: "flex", alignItems: "center", pt: 3 }}
                    id="product-list"
                  >
                    <div className="box-icon-info  flex-Box">
                      <InformationVariant sx={{ fontSize: "1.3rem" }} />
                    </div>
                    <Typography className="add-commande-span">
                      {" "}
                      Recapitulatife Devis{" "}
                    </Typography>
                  </Box>
                  <RecapDevis
                    source={location.state.source}
                    arrayAllProductOrdered={recapFinalProduct}
                    tvaPercentage={selectedTva && selectedTva.percentage}
                    handleSetTotalAmount={handleSetTotalAmount}
                    handleDeleteProduct={handleDeleteProduct}
                    discounts={devis.discounts}
                    // selectProduct={selectProduct}
                    // handleOrderQuantityChange={handleOrderQuantityChange}
                    // handleClick={handleClick}
                    // openModalAddProductCommande={(details) =>
                    //   openModalAddProductCommande(details)
                    // }
                  />
                </div>
              ) : !devisId ? (
                <Box sx={{ mt: 2, textAlign: "end" }}>
                  <button
                    onClick={() => createDevis()}
                    className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                  >
                    Creer
                  </button>
                </Box>
              ) : null}
                {devisId && (
                <Box sx={{ mt: 2, textAlign: "end" }}>
                  <button
                    onClick={() => convertDevisToOrder()}
                    className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                  >
                    convertir en commande
                  </button>
                </Box>
              )}
            </Paper>
          </Box>
        </>
      )}

      <Dialog
        open={openModalDeleteOrder}
        onClose={() => handleCancelDelete()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir supprimer ?
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
        open={openModalSendOrder}
        onClose={() => setOpenModalSendOrder(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          {devisData && devisData.client ? (
            <DialogContentText id="alert-dialog-description">
              Votre devis pour la client{" "}
              <strong>"{devisData && devisData.client.fullname}"</strong> sera
              envoyé via e-mail{" "}
              <strong>"{devisData && devisData.client.email}"</strong>
            </DialogContentText>
          ) : (
            <DialogContentText id="alert-dialog-description">
              Votre Devis sera envoyé via e-mail
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
          <Button onClick={() => sendDevis()} className="green-button">
            Confirmer
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export default CreateDevis;
