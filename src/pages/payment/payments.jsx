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
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import CachedIcon from "@mui/icons-material/Cached";

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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Loader from "../../components/loader";

//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable

const Payments = (props) => {
  const [totalPayment, setTotalPayment] = useState(0);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [attributeSearch, setAttributeSearch] = useState({
    sellOrderId: "",
    clientId: "",
    startDate: "",
    endDate: "",
    type: [],
    sellOrderType: "",
  });
  const [loading, setLoading] = useState(false);

  /**************Reducer data ******************* */
  const allPayment = useSelector((state) => state.sellOrderReducer.allPayment);
  const arrayAllClient = useSelector(
    (state) => state.userServices.arrayAllClient
  );

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
    searchAllPaymentSellOrder(attributeSearch);
    const data = {
      fullname: "",
      email: "",
      country: "",
      type: "",
    };
    dispatch(actionCreator.getAllClient(data));
  }, []);

  useEffect(() => {
    if (allPayment && allPayment.length > 0) {
      let total = allPayment.reduce((total, obj) => total + obj.amount, 0);
      setTotalPayment(total);
    }
  }, [allPayment]);

  const searchAllPaymentSellOrder = (data) => {
    dispatch(actionCreator.getAllPaymentSellOrder(data, setLoading));
  };

  // ***********************************************************************

  const onReload = () => {
    setAttributeSearch({
      sellOrderId: "",
      clientId: "",
      startDate: "",
      endDate: "",
      type: [],
      sellOrderType: "",
    });
    const data = {
      sellOrderId: "",
      clientId: "",
      startDate: "",
      endDate: "",
      type: [],
      sellOrderType: "",
    };
    searchAllPaymentSellOrder(data);
  };

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

  const handleChangeCheckBox = (event) => {
    let myArray = attributeSearch.type;
    if (myArray.includes(event.target.value)) {
      myArray = myArray.filter((item) => item !== event.target.value);
    } else {
      myArray.push(event.target.value);
    }

    setAttributeSearch({ ...attributeSearch, type: myArray });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
            Gestion des Paiement
          </Typography>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <Grid container sx={{ p: 2 }} spacing={4}>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  {/* <InputLabel id="demo-simple-select-label">commande ID</InputLabel> */}
                  <TextField
                    type="number"
                    inputProps={{ min: 0 }}
                    size="small"
                    placeholder="commande ID"
                    value={attributeSearch.sellOrderId}
                    onChange={handleChangeAttributeSearch("sellOrderId")}
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    inputFormat="YYYY-MM-DD"
                    value={attributeSearch.startDate}
                    onChange={(newValue) => {
                      setAttributeSearch({
                        ...attributeSearch,
                        startDate: newValue,
                      });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    inputFormat="YYYY-MM-DD"
                    value={attributeSearch.endDate}
                    onChange={(newValue) => {
                      setAttributeSearch({
                        ...attributeSearch,
                        endDate: newValue,
                      });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
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
                    <MenuItem value="IMPORTATION">Importation</MenuItem>
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
                  onClick={() => searchAllPaymentSellOrder(attributeSearch)}
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

            <Grid container sx={{ p: 2 }} spacing={4}>
              <div className="d-flex gap-2 ml-5 align-items-center">
                Type :
                <FormControlLabel
                  control={
                    <Checkbox
                      value="VIREMENT BANCAIRE"
                      onChange={handleChangeCheckBox}
                    />
                  }
                  label="VIREMENT BANCAIRE"
                />
                <FormControlLabel
                  control={
                    <Checkbox value="CHÈQUE" onChange={handleChangeCheckBox} />
                  }
                  label="CHÈQUE"
                />
                <FormControlLabel
                  control={
                    <Checkbox value="ESPÈCE" onChange={handleChangeCheckBox} />
                  }
                  label="ESPÈCE"
                />
                <FormControlLabel
                  control={
                    <Checkbox value="TRAITE" onChange={handleChangeCheckBox} />
                  }
                  label="TRAITE"
                />
              </div>
            </Grid>
          </Paper>

          <Grid container sx={{ pt: 3, justifyContent: "space-between" }}>
            <Grid item className="flex-Box">
              <Typography
                className="color-title"
                sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
              >
                Paiements{" "}
              </Typography>
              <Box className="number-listing mr-3">
                {" "}
                <Typography
                  className="color-title"
                  sx={{ fontSize: "0.75rem", fontWeight: "600" }}
                >
                  {" "}
                  {allPayment && allPayment.length} Paiements
                </Typography>{" "}
              </Box>
              <Box className="number-listing">
                {" "}
                <Typography
                  className="color-title"
                  sx={{ fontSize: "0.75rem", fontWeight: "600" }}
                >
                  {" "}
                  Montant total : {totalPayment.toFixed(2)} (TND)
                </Typography>{" "}
              </Box>
            </Grid>
          </Grid>

          <Grid container sx={{ mt: 3 }}>
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
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Montant (TND)
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Commande associé{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Client
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        date de paiement
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Epreuve{" "}
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Facture{" "}
                      </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allPayment &&
                      allPayment
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
                                {row.type}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.amount}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                <a
                                  className="a-href"
                                  onClick={() =>
                                    goToAddSellOrder(row.sellOrderId, "details")
                                  }
                                >
                                  {row.sellOrderId}
                                </a>{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.sellOrder.client.fullname}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {moment(row.paymentDate).format(
                                  "DD/MM/YYYY"
                                )}{" "}
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
                                    openFile(row.sellOrder.file);
                                  }}
                                >
                                  {row.sellOrder.file
                                    ? getFileName(row.sellOrder.file)
                                    : ""}
                                </a>
                              </TableCell> */}
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={allPayment && allPayment.length}
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

export default Payments;
