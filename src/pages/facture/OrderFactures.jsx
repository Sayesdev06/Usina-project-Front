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

import { connect, useDispatch } from "react-redux";
import * as actionCreator from "../../actions";
import moment from "moment";
import InputDate from "../../components/shared/InputDate";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../../components/loader";

//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable

const OrderFactures = (props) => {
  const { arrayAllProvider, arrayAllOrder } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [attributeSearch, setAttributeSearch] = useState({
    vendorId: "",
    status: "",
    orderType: "",
    statusPayment: "",
    id: "",
  });

  const handleChangeAttributeSearch = (prop) => (event) => {
    setAttributeSearch({ ...attributeSearch, [prop]: event.target.value });
  };
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
    getFactureOrder();
    props.getAllVendors();
  }, []);

  const getFactureOrder = (search) => {
    let data = {};

    if (search) {
      data = { search, setLoading };
    } else {
      data = {
        ...attributeSearch,
        setLoading,
      };
    }
    dispatch(actionCreator.searchFactureOrder(data));
  };

  const onReload = () => {
    setAttributeSearch({
      vendorId: "",
      status: "",
      orderType: "",
      statusPayment: "",
      id: "",
    });
    const data = {
      vendorId: "",
      status: "",
      orderType: "",
      statusPayment: "",
      id: "",
    };
    getFactureOrder(data);
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

  const goToOrderDetails = (id) => {
    navigate("/commande-details", {
      state: {
        orderId: id,
      },
    });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Grid container>
            <Typography className="color-title" sx={{ fontWeight: "600" }}>
              Gestion des factures des commandes d'achat
            </Typography>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Grid container sx={{ p: 2 }} spacing={4}>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <TextField
                      placeholder="ID Commande"
                      size="small"
                      value={attributeSearch.id}
                      onChange={(e) =>
                        setAttributeSearch({
                          ...attributeSearch,
                          id: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Fournisseur
                    </InputLabel>

                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Fournisseur"
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
                  md={2}
                  sx={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Status"
                      value={attributeSearch.status}
                      onChange={handleChangeAttributeSearch("status")}
                    >
                      <MenuItem value="CREÉ">Crée</MenuItem>
                      <MenuItem value="ENVOYÉ">Envoyée</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      status paiement
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={attributeSearch.statusPayment}
                      label="status Paiement"
                      onChange={handleChangeAttributeSearch("statusPayment")}
                    >
                      <MenuItem value="PAYÉ PARTIELLEMENT">
                        PAYÉ PARTIELLEMENT
                      </MenuItem>
                      <MenuItem value="PAYÉ TOTALEMENT">
                        PAYÉ TOTALEMENT
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  className="flex-Box"
                  sx={{ justifyContent: "end" }}
                >
                  <Button
                    onClick={() => getFactureOrder()}
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

            <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
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
                        ID Commande{" "}
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
                        Status Paiement{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Status Reception{" "}
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
                              <a
                                className="a-href"
                                onClick={() => {
                                  openFile(row.file);
                                }}
                              >
                                {row.file ? getFileName(row.file) : ""}
                              </a>
                            </TableCell>
                            <TableCell sx={{ color: "#3a3541ad" }}>
                              <a
                                className="a-href"
                                onClick={() => goToOrderDetails(row.id)}
                              >
                                {row.id}
                              </a>
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
                              {row.statusReception}{" "}
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
    getAllVendors: () => dispatch(actionCreator.getAllVendors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderFactures);
