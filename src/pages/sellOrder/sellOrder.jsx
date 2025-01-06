import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Divider,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

// import icons

import PlusCircleOutline from "mdi-material-ui/PlusCircleOutline";
import { Reload, Magnify, EyeOutline, DeleteOutline } from "mdi-material-ui";
import { useSnackbar } from "notistack";

import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import moment from "moment";
import InputDate from "../../components/shared/InputDate";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PencilOutline from "mdi-material-ui/PencilOutline";
import CardTicket from "../../components/CardTicket";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../../components/loader";
import Cookies from "js-cookie";


//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable

const SellOrder = (props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const role = Cookies.get("role");

  const [itemToDelete, setItemToDelete] = useState({});
  const [openModalDeleteOrder, setOpenModalDeleteOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [attributeSearch, setAttributeSearch] = useState({
    clientId: "",
    activityId: "",
    statusProduction: "",
    statusDelivery: "",
    sellOrderType: "",
  });

  /**************Reducer data ******************* */
  const arrayAllClient = useSelector(
    (state) => state.userServices.arrayAllClient
  );
  const arrayAllActivity = useSelector(
    (state) => state.productServices.arrayAllActivity
  );
  const sellOrders = useSelector((state) => state.sellOrderReducer.sellOrders);

  /****************************************** */
  const handleChangeAttributeSearch = (prop) => (event) => {
    setAttributeSearch({ ...attributeSearch, [prop]: event.target.value });
  };
  // ***********************************************************************

  // const handleChange = (prop, newValue) => {
  //   setAttributeSearch({ ...attributeSearch, [prop]: newValue })
  // };
  // ***********************************************************************

  // ** States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ***********************************************************************

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // ***********************************************************************

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // ***********************************************************************
  useEffect(() => {
    setLoading(true);
    searchSellOrder(attributeSearch);
    const data = {
      fullname: "",
      email: "",
      country: "",
      type: "",
    };
    dispatch(actionCreator.getAllClient(data));
    dispatch(actionCreator.getAllActivity());
  }, []);

  const searchSellOrder = (data) => {
    dispatch(actionCreator.searchSellOrder(data, setLoading));
  };

  // ***********************************************************************

  const handleDelete = (item) => {
    setItemToDelete(item); // set the item to be deleted
    setOpenModalDeleteOrder(true); // show the confirmation modal
  };

  const handleCancelDelete = () => {
    setItemToDelete({}); // set the item to be deleted
    setOpenModalDeleteOrder(false); // show the confirmation modal
  };

  const handleConfirmDelete = () => {
    const data = {
      id: itemToDelete.id,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        searchSellOrder(attributeSearch);
      },
    };
    dispatch(actionCreator.deleteSellOrder(data));
    setItemToDelete({}); // reset itemToDelete state
    setOpenModalDeleteOrder(false); // hide the confirmation modal
  };

  const onReload = () => {
    setAttributeSearch({
      clientId: "",
      activityId: "",
      statusProduction: "",
      statusDelivery: "",
      sellOrderType: "",
    });
    const data = {
      clientId: "",
      activityId: "",
      statusProduction: "",
      statusDelivery: "",
      sellOrderType: "",
    };
    searchSellOrder(data);
  };

  // ***********************************************************************
  const goToAddSellOrder = (sellOrderId, source) => {
    navigate("/add-commande-vente", { state: { source, sellOrderId } });
  };
  // ***********************************************************************

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082" + fileUrl, "_blank");
  };

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    return array[array.length - 1];
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
            Gestion des Commandes de vente
          </Typography>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <Grid container sx={{ p: 2 }} spacing={4}>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Clients</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={attributeSearch.clientId}
                    label="Clients"
                    onChange={handleChangeAttributeSearch("clientId")}
                  >
                    {arrayAllClient &&
                      arrayAllClient.map((client, key) => (
                        <MenuItem value={client.id} key={key}>
                          {client.fullname}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Activities
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={attributeSearch.activityId}
                    label="Activities"
                    onChange={handleChangeAttributeSearch("activityId")}
                  >
                    {arrayAllActivity &&
                      arrayAllActivity.map((activity, key) => (
                        <MenuItem value={activity.id} key={key}>
                          {activity.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Statut Production
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={attributeSearch.statusProduction}
                    label="Statut Production"
                    onChange={handleChangeAttributeSearch("statusProduction")}
                  >
                    {/* <MenuItem value="" key={0}></MenuItem> */}

                    <MenuItem value="CRÉER" key={1}>
                      CRÉER
                    </MenuItem>
                    <MenuItem value="EN COURS DE PRODUCTION" key={2}>
                      EN COURS DE PRODUCTION
                    </MenuItem>
                    <MenuItem value="FINI" key={3}>
                      FINI
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Statut livraison
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={attributeSearch.statusDelivery}
                    label="Statut livraison"
                    onChange={handleChangeAttributeSearch("statusDelivery")}
                  >
                    <MenuItem value="LIVRÉE TOTALEMENT" key={1}>
                      LIVRÉE TOTALEMENT
                    </MenuItem>

                    <MenuItem value="LIVRÉE PARTIELLEMENT" key={2}>
                      LIVRÉE PARTIELLEMENT
                    </MenuItem>

                    <MenuItem value="NON LIVRÉE" key={3}>
                      NON LIVRÉE
                    </MenuItem>

                    <MenuItem value="RÉCEPTIONNÉ" key={4}>
                      RÉCEPTIONNÉ
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={attributeSearch.orderType}
                    label="orderType"
                    onChange={handleChangeAttributeSearch("sellOrderType")}
                  >
                    <MenuItem value="LOCAUX">Locaux</MenuItem>
                    <MenuItem value="EXPORTATION">
                                Exportation
                              </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                md={2}
                className="flex-Box"
                sx={{ justifyContent: "end" }}
              >
                <Button
                  onClick={() => searchSellOrder(attributeSearch)}
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
            sx={{ flex: "1 1 100%", mt: 3, justifyContent: "space-between" }}
          >
            <div className="d-flex">
              <Typography
                className="color-title"
                sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
              >
                Liste des Commande de vente
              </Typography>
              <Box className="number-listing">
                {" "}
                <Typography
                  className="color-title"
                  sx={{ fontSize: "0.85rem", fontWeight: "600" }}
                >
                  {" "}
                  {sellOrders && sellOrders.length} Commande de vente
                </Typography>{" "}
              </Box>
            </div>
{console.log(role)}
           {(role ==="ADMIN" || role ==="COMMERCIALE") &&<button
              onClick={() => goToAddSellOrder(null, "add")}
              className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
            >
              + Ajouter
            </button>}
          </Grid>

          <Grid container sx={{ mt: 1 }}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                        Id{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Activite{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Client{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Status Production
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Statu de livraison
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Statu de paiement
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Facture{" "}
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Bon de commande
                      </TableCell> */}
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Actions{" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellOrders &&
                      sellOrders
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                # {row.id}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.activity.name}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.client && row.client.fullname}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.statusProduction}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.statusDelivery}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.statusPayment}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                <a
                                  className="a-href text-over-flow-file-name"
                                  onClick={() => {
                                    openFile(row.file);
                                  }}
                                >
                                  {row.file ? getFileName(row.file) : ""}
                                </a>
                              </TableCell>
                              {/* <TableCell sx={{ color: "#3a3541ad" }}>
                                <a
                                  className="a-href text-over-flow-file-name"
                                  onClick={() => {
                                    openFile(row.sellOrderFile);
                                  }}
                                >
                                  {row.sellOrderFile
                                    ? getFileName(row.sellOrderFile)
                                    : ""}
                                </a>
                              </TableCell> */}
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {/* <EyeOutline
                                  sx={{
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                    ml: 2,
                                  }}
                                  onClick={() =>
                                    goToAddSellOrder(row.id, "details")
                                  }
                                /> */}

<PencilOutline
                                  sx={{
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                    ml: 2,
                                  }}
                                  onClick={() =>
                                    goToAddSellOrder(row.id, "update")
                                  }
                                />
                              { (role ==="ADMIN" || role ==="COMMERCIALE") && <DeleteOutline
                                  sx={{
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                    ml: 2,
                                    color: "red",
                                  }}
                                  onClick={() => handleDelete(row)}
                                />}
                                
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={sellOrders && sellOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>

          <Dialog
            open={openModalDeleteOrder}
            onClose={() => handleCancelDelete()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Envoi de commande"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                êtes-vous sûr de vouloir supprimer ?
              </DialogContentText>
            </DialogContent>
            <div className="d-flex justify-content-between p-3">
              <Button
                onClick={() => handleCancelDelete()}
                className="red-button"
              >
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
        </>
      )}
    </div>
  );
};

export default SellOrder;
