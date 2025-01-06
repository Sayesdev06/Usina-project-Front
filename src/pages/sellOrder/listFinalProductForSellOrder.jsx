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
  Checkbox,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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
import AddIcon from "@mui/icons-material/Add";

function ListProductofFinalProduct(props) {
  const {
    source,
    arrayAllProduct,
    tvaPercentage,
    recapFinalProduct,
    discounts,
    type,
  } = props;
  console.log(arrayAllProduct,"test",recapFinalProduct)

  const [totalHt, setTotalHt] = useState(0);
  const [totalTtc, setTotalTtc] = useState(0);
  const [totalTTCWithDiscount, setTotalTTCWithDiscount] = useState(0);
  const [totalHtWithDiscount, setTotalHtWithDiscount] = useState(0);

  useEffect(() => {
    if (arrayAllProduct && tvaPercentage) {
      calculateTotalHt();
      calculateTotalTtc();
    }
  }, [arrayAllProduct, tvaPercentage, discounts]);

  const calculateTotalHt = () => {
    let total = 0;
    for (let i = 0; i < arrayAllProduct.length; i++) {
      const row = arrayAllProduct[i];
      if (row.isSelected && row.orderedQuantity)
        total += parseInt(row.orderedQuantity) * row.sellPriceHT;
    }
    setTotalHt(total);
    props.handleSetTotalAmount("amountHt", total);

    if (discounts > 0) {
      let discountDecimal = discounts / 100;

      let discountAmount = total * discountDecimal;
      let newTotalPrice = total - discountAmount;
      console.log(newTotalPrice);
      setTotalHtWithDiscount(newTotalPrice);
    }
  };

  const calculateTotalTtc = () => {
    let total = 0;
    for (let i = 0; i < arrayAllProduct.length; i++) {
      const row = arrayAllProduct[i];
      if (row.isSelected && row.orderedQuantity)
        total +=
          row.orderedQuantity * row.sellPriceHT +
          (row.orderedQuantity * row.sellPriceHT * tvaPercentage) / 100;
    }
    setTotalTtc(total);

    props.handleSetTotalAmount("amountTtc", total);

    if (discounts > 0) {
      let discountDecimal = discounts / 100;

      let discountAmount = total * discountDecimal;
      let newTotalPrice = total - discountAmount;
      setTotalTTCWithDiscount(newTotalPrice);
    }
  };

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
                Prix de vente HT
              </TableCell>
              <TableCell
                sx={{
                  color: "#3a3541de",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                {type === "direct"
                  ? "Quantité a vendre"
                  : "Quantité a produire"}
              </TableCell>
              <TableCell
                sx={{
                  color: "#3a3541de",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                {" "}
                Prix total HT
              </TableCell>
              <TableCell
                sx={{
                  color: "#3a3541de",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                {" "}
                Prix total TTC
              </TableCell>
              {source === "update" && (
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
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {arrayAllProduct &&
              arrayAllProduct.map((row, index) =>
                recapFinalProduct &&
                recapFinalProduct.some((obj) => obj.id === row.id) ?null: (
                  <React.Fragment key={index}>
       
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                        <Checkbox
                          onClick={() => props.handleClick(row)}
                          color="primary"
                          checked={row.isSelected}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                        {" "}
                        {row.name}{" "}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                        {" "}
                        {row.quantity} {row.unit.unit}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                        {" "}
                        {row.sellPriceHT}{" "}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                        <FormControl fullWidth size="small">
                          {/* <InputLabel id="demo-simple-select-label">Nom</InputLabel> */}
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ min: 0 }}
                            placeholder="0"
                            value={row.orderedQuantity}
                            onChange={(e) => {
                              props.handleOrderQuantityChange(e, row);
                            }}
                            disabled={!row.isSelected}
                          />
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                        {" "}
                        {row.orderedQuantity
                          ? (row.sellPriceHT * row.orderedQuantity).toFixed(2)
                          : 0}{" "}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                        {row.orderedQuantity && tvaPercentage
                          ? (
                              row.orderedQuantity * row.sellPriceHT +
                              (row.orderedQuantity *
                                row.sellPriceHT *
                                tvaPercentage) /
                                100
                            ).toFixed(2)
                          : 0}
                      </TableCell>
                      {source === "update" && (
                        <TableCell sx={{ color: "#3a3541ad" }}>
                          <AddIcon
                            sx={{
                              fontSize: "1.2rem",
                              cursor: "pointer",
                              ml: 2,
                            }}
                            onClick={() =>
                              props.handleAddFinalProductToSellOrder(row)
                            }
                          />
                        </TableCell>
                      )}
                    </TableRow>
                    {type === "direct" ? null : (
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={row.isSelected}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                Composition
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell align="right">
                                      Quantité nécessaire
                                    </TableCell>
                                    <TableCell align="right">
                                      Quantité nécessaire total
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {row.products.map((product) => (
                                    <TableRow key={product.id}>
                                      <TableCell component="th" scope="row">
                                        {product.name}
                                      </TableCell>
                                      <TableCell>
                                        {product.piecesNumber}{" "}
                                        {product.unit.unit}
                                      </TableCell>
                                      <TableCell align="right">
                                        {
                                          product.productFinalProducts
                                            .quantityNeeded
                                        }{" "}
                                        {product.unit.unit}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.orderedQuantity
                                          ? product.productFinalProducts
                                              .quantityNeeded *
                                            row.orderedQuantity
                                          : 0}{" "}
                                        {product.unit.unit}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              )}

            {source === "add" && (
              <TableRow tabIndex={-1} key={9998}>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>Total</TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>
                  {totalHt > 0 ? totalHt.toFixed(2) : 0}
                </TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>
                  {totalTtc > 0 ? totalTtc.toFixed(2) : 0}
                </TableCell>
              </TableRow>
            )}

            {discounts && discounts > 0 ? (
              <TableRow tabIndex={-1} key={9999}>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>
                  Total avec remises
                </TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>
                  {totalHtWithDiscount > 0 ? totalHtWithDiscount.toFixed(2) : 0}
                </TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>
                  {totalTTCWithDiscount > 0
                    ? totalTTCWithDiscount.toFixed(2)
                    : 0}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ListProductofFinalProduct;
