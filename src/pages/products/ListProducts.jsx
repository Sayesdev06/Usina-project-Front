import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  Grid,
  TextField,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Toolbar,
  Select,
  FormControl,
  MenuItem,
  useTheme,
  OutlinedInput,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material/";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import EyeOutline from "mdi-material-ui/EyeOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";
import PlusCircleOutline from "mdi-material-ui/PlusCircleOutline";

// *******

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Nom ",
  },
  {
    id: "piecesNumber",
    numeric: false,
    disablePadding: false,
    label: "quantité disponible",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    source,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ backgroundColor: "#F7F6F9" }}>
      <TableRow>
        <TableCell
          padding="checkbox"
          sx={{ color: "#3a3541de", fontSize: "0.87rem", fontWeight: "600" }}
        >
          {source === "product" ? (
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          ) : null}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ color: "#3a3541de", fontSize: "0.87rem", fontWeight: "600" }}
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {source === "product" ? (
          <TableCell
            sx={{ color: "#3a3541de", fontSize: "0.87rem", fontWeight: "600" }}
          >
            Actions
          </TableCell>
        ) : null}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, source } = props;

  return source === "product" ? (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} sélectionnés
        </Typography>
      ) : (
        <Grid item className="flex-Box" sx={{ flex: "1 1 100%" }}>
          <Typography
            className="color-title"
            sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
          >
            Liste des produits{" "}
          </Typography>
          <Box className="number-listing">
            {" "}
            <Typography
              className="color-title"
              sx={{ fontSize: "0.75rem", fontWeight: "600" }}
            >
              {" "}
              {props.arrayAllProduct.length} produit
            </Typography>{" "}
          </Box>
        </Grid>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : source === "product" ? (
        <>
          <Tooltip title="Filter list">
            <IconButton id="tooltip-with-border">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            id="tooltip-with-border"
            sx={{ ml: 1 }}
            onClick={() => props.onOpenModalAddProduct()}
          >
            <PlusCircleOutline />
            <Typography>produits</Typography>
          </IconButton>
        </>
      ) : null}
    </Toolbar>
  ) : null;
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const ListProducts = (props) => {
  const { arrayAllProduct, source } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(source === "product" ? 10 : 3);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = arrayAllProduct.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, details) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    if (props.source === "commandeComponenet") {
      props.openModalAddProductCommande(details);
    }
    if (props.source === "finalProduct") {
      props.selectProduct(details);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - arrayAllProduct.length)
      : 0;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          {/* <EnhancedTableToolbar numSelected={selected.length}
            arrayAllProduct={arrayAllProduct}
            onOpenModalAddProduct={() => props.onOpenModalAddProduct()}
            source={source}
          /> */}
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={arrayAllProduct.length}
                source={source}
              />
              <TableBody>
                {stableSort(arrayAllProduct, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(event) =>
                              handleClick(event, row.name, row)
                            }
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ color: "#3a3541ad" }}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad" }}>
                          {row.piecesNumber} {row.unit.unit}
                        </TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad" }}>
                          <p className="text-over-flow">{row.description}</p>
                        </TableCell>
                        {source === "product" ? (
                          <TableCell align="left" sx={{ color: "#3a3541ad" }}>
                            <EyeOutline
                              sx={{ fontSize: "1.2rem", cursor: "pointer" }}
                              onClick={() =>
                                props.goToDetailsAndUpdateProduct(row)
                              }
                            />
                            <DeleteOutline
                              sx={{
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                ml: 2,
                              }}
                              onClick={() => props.onDeleteProduct(row)}
                            />
                            <PencilOutline
                              sx={{
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                ml: 2,
                              }}
                              onClick={() =>
                                props.onOpenModalUpdateProduct(row)
                              }
                            />
                          </TableCell>
                        ) : null}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={arrayAllProduct.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
};

export default ListProducts;
