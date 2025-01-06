import React, { useEffect, useRef, useState } from "react";
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
import { useReactToPrint } from "react-to-print";

// import icons

import PlusCircleOutline from "mdi-material-ui/PlusCircleOutline";
import {
  Reload,
  Magnify,
  EyeOutline,
  DeleteOutline,
  Barcode,
} from "mdi-material-ui";
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

const ListTransferPieces = (props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const arrayAllTransfer = useSelector(
    (state) => state.maintenanceReducer.arrayAllTransfer
  );

  const [openModalAddTransfer, setOpenModalAddTransfer] = useState(false);
  const [allInputRequired, setAllInputRequired] = useState(false);

  const [attributeSearch, setAttributeSearch] = useState({
    file: "",
    userId: "",
  });

  const [transferVoucher, setTransferVoucher] = useState({
    id: "",
    warehouseId: "",
    type: "piece",
  });

  const arrayAllUser = useSelector((state) => state.userServices.arrayAllUsers);
  const arrayAllWareHouse = useSelector(
    (state) => state.productServices.arrayAllWareHouse
  );

  useEffect(() => {
    const data = {
      firstName: "",
      login: "",
      poste: "",
      // permissionId: "",
    };
    dispatch(actionCreator.getAllUsers(data));
    dispatch(actionCreator.searchEnterpot({ name: "", city: "" }));
  }, []);

  /****************************************** */

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
    getAllTransferVoucher(attributeSearch);
  }, []);

  const getAllTransferVoucher = (data) => {
    dispatch(actionCreator.searchTransferVoucher(data, setLoading));
  };

  const onReload = () => {
    setAttributeSearch({
      file: "",
      userId: "",
    });
    const data = {
      file: "",
      userId: "",
    };
    getAllTransferVoucher(data);
  };

  const handleCloseAddTransfer = () => {
    setOpenModalAddTransfer(false);
    setTransferVoucher({
      id: "",
      warehouseId: "",
      type: "peice",
    });
  };

  const openFile = async (fileUrl) => {
    const file = await getFileName(fileUrl);
    window.open("http://127.0.0.1:8082/static/file/" + file, "_blank");
  };

  const createTransferVoucher = () => {
    if (
      transferVoucher.id &&
      transferVoucher.type &&
      transferVoucher.warehouseId
    ) {
      const data = {
        id: transferVoucher.id,
        type: transferVoucher.type,
        warehouseId: transferVoucher.warehouseId,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          getAllTransferVoucher(attributeSearch);
          setOpenModalAddTransfer(false);
        },
        openFile,
      };

      dispatch(actionCreator.transferWarehouse(data));
    } else {
      setAllInputRequired(true);
      setTimeout(() => {
        setAllInputRequired(false);
      }, 3000);
    }
  };

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    return array[array.length - 1];
  };

  // ***********************************************************************

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
            Gestion des bon de transfer
          </Typography>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <Grid container sx={{ p: 2 }} spacing={4}>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Fichie"
                  value={attributeSearch.file}
                  onChange={(e) =>
                    setAttributeSearch({
                      ...attributeSearch,
                      file: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Utilisateur
                  </InputLabel>

                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={attributeSearch.userId}
                    onChange={(e) =>
                      setAttributeSearch({
                        ...attributeSearch,
                        userId: e.target.value,
                      })
                    }
                  >
                    {arrayAllUser &&
                      arrayAllUser.map((user, key) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                md={8}
                className="flex-Box"
                sx={{ justifyContent: "end" }}
              >
                <Button
                  onClick={() => getAllTransferVoucher(attributeSearch)}
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
                Liste des bon de transfer
              </Typography>
              <Box className="number-listing">
                {" "}
                <Typography
                  className="color-title"
                  sx={{ fontSize: "0.85rem", fontWeight: "600" }}
                >
                  {" "}
                  {arrayAllTransfer && arrayAllTransfer.length} Bon de transfer
                </Typography>{" "}
              </Box>
            </div>

            <button
              onClick={() => setOpenModalAddTransfer(true)}
              className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
            >
              + Ajouter
            </button>
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
                        Utilisateur{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Date de creation{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3a3541de",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        Fichie{" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {arrayAllTransfer &&
                      arrayAllTransfer
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
                                {row.id}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {row.user.firstName} {row.user.lastName}{" "}
                              </TableCell>

                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                {moment(row.createdAt).format(
                                  "DD/MM/YYYY"
                                )}{" "}
                              </TableCell>
                              <TableCell sx={{ color: "#3a3541ad" }}>
                                {" "}
                                <span
                                  className="pointer"
                                  style={{
                                    color: "rgb(101 133 187)",
                                    fontWeight: "600",
                                  }}
                                  onClick={() => {
                                    openFile(row.file);
                                  }}
                                >
                                  {getFileName(row.file)}
                                </span>
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
                count={arrayAllTransfer && arrayAllTransfer.length}
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
        open={openModalAddTransfer}
        onClose={() => handleCloseAddTransfer()}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Ajoute production"}</DialogTitle>
        <DialogContent>
          <div className="d-flex gap-3">
            <FormControl size="small" sx={{ width: "200px" }}>
              Code a bare
              <TextField
                size="small"
                inputProps={{ min: 0 }}
                value={transferVoucher.id}
                onChange={(e) =>
                  setTransferVoucher({ ...transferVoucher, id: e.target.value })
                }
              />
            </FormControl>

            <FormControl size="small" sx={{ width: "200px" }}>
              Type
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={transferVoucher.type}
                label="categorie"
                onChange={(e) =>
                  setTransferVoucher({
                    ...transferVoucher,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value="piece" key={0} selected>
                  piece
                </MenuItem>
                <MenuItem value="production" key={1}>
                  production
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: "200px" }}>
              Entrepot
              <Select
                defaultValue="Entrepot"
                id="form-layouts-separator-select"
                labelId="form-layouts-separator-select-label"
                onChange={(e) =>
                  setTransferVoucher({
                    ...transferVoucher,
                    warehouseId: e.target.value,
                  })
                }
                value={transferVoucher.warehouseId}
              >
                <MenuItem key={"first"} value="Entrepot" disabled>
                  Entrepot
                </MenuItem>
                {arrayAllWareHouse &&
                  arrayAllWareHouse.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          {allInputRequired ? (
            <p className="red-color">Tous les champs sont obligatoire</p>
          ) : null}
        </DialogContent>
        <div className="d-flex justify-content-end p-3">
          <button
            onClick={() => createTransferVoucher()}
            className="btn-with-border flex-Box "
            style={{ marginLeft: ".5rem" }}
          >
            Ajouter
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default ListTransferPieces;
