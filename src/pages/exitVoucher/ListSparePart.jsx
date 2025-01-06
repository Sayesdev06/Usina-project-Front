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
  TextareaAutosize,
  Checkbox,
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

function ListSparePart(props) {
  const dispatch = useDispatch();
  // ** States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [productSelected, setProductSelected] = useState([]);

  const [attributeProductSearch, setAttributeProductSearch] = useState({
    name: "",
  });

  //************************************************* */

  const sparePart = useSelector((state) => state.maintenanceReducer.sparePart);

  //************************************************* */
  useEffect(() => {
    getProductForMaintenance(attributeProductSearch);
  }, []);

  const getProductForMaintenance = async (data) => {
    dispatch(actionCreator.searchProductForMaintenance(data));
  };

  // ***********************************************************************

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // ***********************************************************************

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeAttributeProductSearch = (prop) => (event) => {
    setAttributeProductSearch({
      ...attributeProductSearch,
      [prop]: event.target.value,
    });
  };

  const handleClick = (event, details) => {
    let newSelected = [...props.maintenance.productIds];
    const productExists = productSelected.indexOf(details.id);

    if (productExists === -1) {
      newSelected.push(details.id);
    } else {
      newSelected.splice(productExists, 1);
    }
    // Update the state with the new array
    setProductSelected(newSelected);
    //props.selectProduct(details)
  };

  const onReloadProduct = () => {
    setAttributeProductSearch({
      name: "",
    });

    const data = {
      name: "",
    };
    getProductForMaintenance(data);
  };

  return (
    <>
      <Paper sx={{ width: "100%", p: 2, mt: 3 }}>
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

          <Grid item xs={12} md={9} sx={{ textAlign: "end" }}>
            <Button
              onClick={() => getProductForMaintenance(attributeProductSearch)}
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
        sx={{ flex: "1 1 100%", mb: 2, pt: 3, justifyContent: "space-between" }}
      >
        <div className="d-flex">
          <Typography
            className="color-title"
            sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
          >
            Liste des Pièce de rechange
          </Typography>
          <Box className="number-listing">
            {" "}
            <Typography
              className="color-title"
              sx={{ fontSize: "0.85rem", fontWeight: "600" }}
            >
              {" "}
              {sparePart.length} Pièce de rechange
            </Typography>
          </Box>
        </div>
      </Grid>

      <Paper sx={{ width: "100%" }}>
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
                  Nom{" "}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#3a3541de",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  Quantité disponible{" "}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#3a3541de",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  Description{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sparePart &&
                sparePart
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell sx={{ color: "#3a3541ad" }}>
                          <Checkbox
                            onClick={(event) => handleClick(event, row)}
                            value={row.id}
                            color="primary"
                            checked={
                              productSelected.includes(row.id) ? true : false
                            }
                            disabled={props.maintenance.id ? true : false}
                          />
                          {row.name}
                        </TableCell>
                        <TableCell sx={{ color: "#3a3541ad" }}>
                          {" "}
                          {row.piecesNumber} {row.unit.unit}{" "}
                        </TableCell>
                        <TableCell sx={{ color: "#3a3541ad" }}>
                          {" "}
                          {row.description}{" "}
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
          count={sparePart && sparePart.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

export default ListSparePart;
