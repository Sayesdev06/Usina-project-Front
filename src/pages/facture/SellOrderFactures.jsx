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

//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable

const SellOrderFactures = (props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [attributeSearch, setAttributeSearch] = useState({
    clientId: "",
    activityId: "",
    file: "",
    id: "",
    statusPayment: "",
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
    searchFactureSellOrder(attributeSearch);
    const data = {
      fullname: "",
      email: "",
      country: "",
      type: "",
    };
    dispatch(actionCreator.getAllClient(data));
    dispatch(actionCreator.getAllActivity());
  }, []);

  const searchFactureSellOrder = (data) => {
    dispatch(actionCreator.searchFactureSellOrder(data, setLoading));
  };

  // ***********************************************************************

  const onReload = () => {
    setAttributeSearch({
      clientId: "",
      activityId: "",
      file: "",
      id: "",
      statusPayment: "",
    });
    const data = {
      clientId: "",
      activityId: "",
      file: "",
      id: "",
      statusPayment: "",
    };
    searchFactureSellOrder(data);
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

  const goToAddSellOrder = (sellOrderId, source) => {
    navigate("/add-commande-vente", { state: { source, sellOrderId } });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
            Gestion des factures des Commandes de vente
          </Typography>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <Grid container sx={{ p: 2 }} spacing={4}>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <TextField
                    placeholder="ID Facture"
                    size="small"
                    value={attributeSearch.file}
                    onChange={(e) =>
                      setAttributeSearch({
                        ...attributeSearch,
                        file: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Grid>

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
                    status paiement
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={attributeSearch.statusPayment}
                    label="statusPayment"
                    onChange={handleChangeAttributeSearch("statusPayment")}
                  >
                    <MenuItem value="PAYÉ PARTIELLEMENT">
                      PAYÉ PARTIELLEMENT
                    </MenuItem>
                    <MenuItem value="PAYÉ TOTALEMENT">PAYÉ TOTALEMENT</MenuItem>
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
                  onClick={() => searchFactureSellOrder(attributeSearch)}
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
                        Type{" "}
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
                                <a
                                  className="a-href"
                                  onClick={() => {
                                    openFile(row.factureFile);
                                  }}
                                >
                                  {row.factureFile
                                    ? getFileName(row.factureFile)
                                    : ""}
                                </a>
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                <a
                                  className="a-href"
                                  onClick={() =>
                                    goToAddSellOrder(row.id, "details")
                                  }
                                >
                                  {row.id}
                                </a>
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
                                {row.sellOrderType}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.statusPayment}{" "}
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
        </>
      )}
    </div>
  );
};

export default SellOrderFactures;
