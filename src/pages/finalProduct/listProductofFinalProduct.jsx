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
import DoneIcon from "@mui/icons-material/Done";
function ListProductofFinalProduct(props) {
  const arrayAllProduct = props.arrayAllProduct;
  return (
    <>
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
                quantité requise{" "}
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
            {arrayAllProduct &&
              arrayAllProduct.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      # {row.id}
                    </TableCell>
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      {" "}
                      {row.name}{" "}
                    </TableCell>
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      {" "}
                      {row.piecesNumber} {row.unit.unit}
                    </TableCell>
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      <FormControl fullWidth size="small">
                        {/* <InputLabel id="demo-simple-select-label">Nom</InputLabel> */}
                        <TextField
                          size="small"
                          type="number"
                          placeholder="0"
                          inputProps={{ min: 0 }}
                          value={row.productFinalProducts.quantityNeeded}
                          onChange={(e) =>
                            props.handleOrderQuantityChangeInUpdate(e, row)
                          }
                        />
                      </FormControl>
                    </TableCell>
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      {" "}
                      {row.description}{" "}
                    </TableCell>

                    <TableCell sx={{ color: "#3a3541ad" }}>
                      <DoneIcon
                        sx={{
                          fontSize: "1.2rem",
                          cursor: "pointer",
                          ml: 2,
                          color: "green",
                        }}
                        onClick={() => props.updateQuantityNeeded(row)}
                      />
                      <DeleteOutline
                        sx={{
                          fontSize: "1.2rem",
                          cursor: "pointer",
                          ml: 2,
                          color: "red",
                        }}
                        onClick={() => props.handleDeleteProduct(row)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ListProductofFinalProduct;
