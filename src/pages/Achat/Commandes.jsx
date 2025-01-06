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
import { Reload, Magnify, EyeOutline, DeleteOutline, PencilOutline } from "mdi-material-ui";
import { useSnackbar } from "notistack";

import { connect, useDispatch } from "react-redux";
import * as actionCreator from "../../actions";
import moment from "moment";
import InputDate from "../../components/shared/InputDate";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../../components/loader";
import Cookies from "js-cookie";


//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable

const Commandes = (props) => {
  const role = Cookies.get("role"); 

  const { arrayAllProvider, arrayAllOrder } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [itemToDelete, setItemToDelete] = useState({});
  const [openModalDeleteOrder, setOpenModalDeleteOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [attributeSearch, setAttributeSearch] = useState({
    vendorId: "",
    startDate: "",
    endDate: "",
    status: "",
    expectedDateReceipt: "",
    orderType: "",
  });

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
    getAllOrder();
    props.getAllVendors();
  }, []);

  const getAllOrder = (search) => {
    let data = {};

    if (search) {
      data = { search, setLoading };
    } else {
      data = {
        ...attributeSearch,
        setLoading,
      };
    }

    props.searchOrder(data);
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
        getAllOrder();
      },
    };
    dispatch(actionCreator.deleteOrder(data));
    setItemToDelete({}); // reset itemToDelete state
    setOpenModalDeleteOrder(false); // hide the confirmation modal
  };

  const onReload = () => {
    setAttributeSearch({
      vendorId: "",
      startDate: "",
      endDate: "",
      status: "",
      expectedDateReceipt: "",
      orderType: "",
    });
    const data = {
      vendorId: "",
      startDate: "",
      endDate: "",
      status: "",
      expectedDateReceipt: "",
      orderType: "",
    };
    getAllOrder(data);
  };

  // ***********************************************************************
  const goToAddCommande = () => {
    navigate("/add-commande");
  };
  // ***********************************************************************
  const goToOrderDetails = (id) => {
    navigate("/commande-details", {
      state: {
        orderId: id,
      },
    });
  };
  // ***********************************************************************

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082" + fileUrl, "_blank");
  };

  /**********************************************/

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    return array[array.length - 1];
  };

  // const goToReception = (id) =>{
  //   navigate("/reception",{
  //     state: {orderId: id,}})
  // }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Grid container>
            <Typography className="color-title" sx={{ fontWeight: "600" }}>
              Gestion des commandes{" "}
            </Typography>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Grid container sx={{ p: 2 }} spacing={4}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  Fournisseur:
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={attributeSearch.vendorId}
                      onChange={handleChangeAttributeSearch("vendorId")}
                    >
                      {arrayAllProvider &&
                        arrayAllProvider.map((vendor, key) => (
                          <MenuItem value={vendor.id} key={key}>
                            {vendor.fullname}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  Status:
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={attributeSearch.status}
                      onChange={handleChangeAttributeSearch("status")}
                    >
                      <MenuItem value="CREÉ">Crée</MenuItem>
                      <MenuItem value="ENVOYÉ">Envoyée</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  Type:
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={attributeSearch.orderType}
                      onChange={handleChangeAttributeSearch("orderType")}
                    >
                      <MenuItem value="LOCAUX">Locaux</MenuItem>
                      <MenuItem value="IMPORTATION">Importation</MenuItem>
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
                  <Button
                    onClick={() => getAllOrder()}
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
                mb: 2,
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <div className="d-flex">
                <Typography
                  className="color-title"
                  sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
                >
                  Liste des Commandes
                </Typography>
                <Box className="number-listing">
                  {" "}
                  <Typography
                    className="color-title"
                    sx={{ fontSize: "0.85rem", fontWeight: "600" }}
                  >
                    {" "}
                    {arrayAllOrder.length} commandes
                  </Typography>{" "}
                </Box>
              </div>

              {role ==="MAGASINIER"?null:<button
                onClick={() => goToAddCommande()}
                className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
              >
                + Ajouter
              </button>}
            </Grid>

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
                        Identifiant{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Fournisseur{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Status{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Paiement{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Date de Commande
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Date de réception{" "}
                      </TableCell> */}
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Monatant TTC{" "}
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
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Reception{" "}
                      </TableCell>
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
                    {arrayAllOrder
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
                              {row.vendor.fullname}{" "}
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {" "}
                              {row.status}{" "}
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {" "}
                              {row.statusPayment}{" "}
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {" "}
                              {moment(row.createdAt).format("DD/MM/YYYY")}{" "}
                            </TableCell>
                            {/* <TableCell sx={{ color: "#3a3541ad" }}>
                              {" "}
                              {moment(row.expectedDateReceipt).format(
                                "DD/MM/YYYY"
                              )}{" "}
                            </TableCell> */}
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {row.amountTtc}
                            </TableCell>
                            <TableCell align="left">
                              <span
                                className="pointer"
                                onClick={() => {
                                  openFile(row.file);
                                }}
                              >
                                {row.file ? getFileName(row.file) : ""}
                              </span>
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              {" "}
                              {row.statusReception}{" "}
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              <PencilOutline
                                sx={{
                                  fontSize: "1.2rem",
                                  cursor: "pointer",
                                  ml: 2,
                                }}
                                onClick={() => goToOrderDetails(row.id)}
                              />
                              {role ==="MAGASINIER"?null:<DeleteOutline
                                sx={{
                                  fontSize: "1.2rem",
                                  cursor: "pointer",
                                  ml: 2,
                                  color: "red",
                                }}
                                onClick={() => handleDelete(row)}
                            />}

                              
                              {/* <Inventory2Icon sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToReception(row.id)} /> */}
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
                count={arrayAllOrder.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
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
            êtes-vous sûr de vouloir supprimer?
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    arrayAllProvider: state.userServices.arrayAllProvider,
    arrayAllOrder: state.order.arrayAllOrder,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchOrder: (data) => dispatch(actionCreator.searchOrder(data)),
    getAllVendors: () => dispatch(actionCreator.getAllVendors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Commandes);
