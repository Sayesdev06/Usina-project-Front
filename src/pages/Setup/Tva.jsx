import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Divider,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import EyeOutline from "mdi-material-ui/EyeOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";
import PlusCircleOutline from "mdi-material-ui/PlusCircleOutline";
import { Close, Reload } from "mdi-material-ui";
import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import { useSnackbar } from "notistack";
import moment from "moment";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../../components/loader";

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
    label: "Nom de la TVA",
  },
  {
    id: "percentage",
    numeric: false,
    disablePadding: true,
    label: "Pourcentage (%)",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Date de création",
  },
  {
    id: "actions",
    numeric: null,
    disablePadding: false,
    label: "Actions",
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
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
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
  const { numSelected } = props;

  return (
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
            Liste des Tva
          </Typography>
          <Box className="number-listing">
            {" "}
            <Typography
              className="color-title"
              sx={{ fontSize: "0.75rem", fontWeight: "600" }}
            >
              {" "}
              {props.arrayAllTva.length} Tva
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
      ) : (
        <>
          <Tooltip title="Filter list">
            <IconButton id="tooltip-with-border">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            id="tooltip-with-border"
            sx={{ ml: 1 }}
            onClick={() => props.onOpenModal()}
          >
            <PlusCircleOutline />
            <Typography>Tva</Typography>
          </IconButton>
        </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Tva = (props) => {
  const { arrayAllTva } = props;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [percentageSearch, setPercentageSearch] = useState("");
  const [editTva, setEditTva] = useState(false);
  const [idTva, setIdTva] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const onOpenModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    setLoading(true)
    getALLTvas();
  }, []);

  const getALLTvas = () => {
    const data = {
      name: nameSearch,
      percentage: percentageSearch,
      setLoading
    };
    props.getAllTva(data);
  };

  const addNewTva = () => {
    const data = {
      name: name,
      percentage: percentage,
      openModal: (value) => setOpenModal(value),
      afterSave: () => {
        setName("");
        setPercentage("");
      },
      getALLTvas: () => {
        getALLTvas();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    if (name === "") {
      let variant = "warning";
      enqueueSnackbar("Veuillez entrer le nom de tva", { variant });
    } else {
      props.createTva(data);
    }
  };

  const showDetailsTva = (row) => {
    setName(row.name);
    setPercentage(row.percentage);
    setIdTva(row.id);
    setShowDetails(true);
    setEditTva(false);
    onOpenModal();
  };

  const onOpenModalUpdateTva = (row) => {
    setName(row.name);
    setPercentage(row.percentage);
    setIdTva(row.id);
    setEditTva(true);
    onOpenModal();
  };

  const onUpdateTva = () => {
    const data = {
      name: name,
      percentage: percentage,
      id: idTva,
      openModal: (value) => setOpenModal(value),
      afterSave: () => {
        setName("");
        setPercentage("");
        setEditTva(false);
      },
      getALLTvas: () => {
        getALLTvas();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    if (name === "") {
      let variant = "warning";
      enqueueSnackbar("Veuillez entrer le nom de tva", { variant });
    } else {
      props.updateTva(data);
    }
  };

  const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
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
        ) : null}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Filter list">
              <IconButton id="tooltip-with-border">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              id="tooltip-with-border"
              sx={{ ml: 1 }}
              onClick={() => props.onOpenModal()}
            >
              <PlusCircleOutline sx={{ mr: 1, fontSize: "1.2rem" }} />
              <Typography>Tva2</Typography>
            </IconButton>
          </>
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = arrayAllTva.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onDeleteTva = (row) => {
    const data = {
      id: row.id,
      getALLTvas: () => {
        getALLTvas();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    props.deleteTva(data);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayAllTva.length) : 0;

  const onReload = () => {
    setNameSearch("");
    setPercentageSearch("");

    const data = {
      name: "",
      percentage: "",
    };
    props.getAllTva(data);
  };

  return (
    <>
{loading ? <Loader/>
    :<>
      <Typography className="color-title" sx={{ fontWeight: "600" }}>
        Gestion des Tva{" "}
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Grid container sx={{ p: 2 }}>
            <Grid
              item
              xs={12}
              md={7}
              sx={{ display: "flex", alignItems: "center", gap: "15px" }}
            >
              Nom de la TVA
              <TextField
                size="small"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
              />
              Pourcentage
              <TextField
                size="small"
                value={percentageSearch}
                onChange={(e) => setPercentageSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={5} sx={{ textAlign: "end" }}>
              <Button
                
                onClick={() => getALLTvas()}
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
      </Box>
      <Box sx={{ width: "100%", mt: 3 }}>
        <Grid
          item
          className="flex-Box"
          sx={{ flex: "1 1 100%", mb: 2, justifyContent: "space-between" }}
        >
          <div className="d-flex">
            <Typography
              className="color-title"
              sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
            >
              Liste des Tva
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.85rem", fontWeight: "600" }}
              >
                {" "}
                {props.arrayAllTva.length} Tva
              </Typography>{" "}
            </Box>
          </div>

          <button
            onClick={() => onOpenModal()}
            className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
          >
            + Ajouter
          </button>
        </Grid>

        <Paper sx={{ width: "100%", mb: 2 }}>
          {/* <EnhancedTableToolbar numSelected={selected.length} onOpenModal={() => onOpenModal()}
            arrayAllTva={arrayAllTva} /> */}
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={arrayAllTva.length}
              />
              <TableBody>
                {stableSort(arrayAllTva, getComparator(order, orderBy))
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
                            onClick={(event) => handleClick(event, row.name)}
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
                          {row.percentage}
                        </TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad" }}>
                          {moment(row.createdAt).format("DD/MM/YYYY")}{" "}
                        </TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad" }}>
                          <EyeOutline
                            sx={{ fontSize: "1.2rem", cursor: "pointer" }}
                            onClick={() => showDetailsTva(row)}
                          />
                          <DeleteOutline
                            sx={{
                              fontSize: "1.2rem",
                              cursor: "pointer",
                              ml: 2,
                            }}
                            onClick={() => onDeleteTva(row)}
                          />
                          <PencilOutline
                            sx={{
                              fontSize: "1.2rem",
                              cursor: "pointer",
                              ml: 2,
                            }}
                            onClick={() => onOpenModalUpdateTva(row)}
                          />
                        </TableCell>
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
            count={arrayAllTva.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
      </Box>
      </>}

      <Dialog fullWidth maxWidth={"sm"} open={openModal} onClose={onOpenModal}>
        <DialogTitle
          className="flex-Box-between"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <Box className="flex-Box">
            {showDetails ? (
              <Typography className="color-title" sx={{ fontWeight: "600" }}>
                {" "}
                Details Tva
              </Typography>
            ) : editTva ? (
              <Typography className="color-title" sx={{ fontWeight: "600" }}>
                {" "}
                Modifier Tva
              </Typography>
            ) : (
              <Typography className="color-title" sx={{ fontWeight: "600" }}>
                {" "}
                Ajouter un nouveau Tva
              </Typography>
            )}
          </Box>
          <Close onClick={onOpenModal} sx={{ cursor: "pointer" }} />
        </DialogTitle>
        <Divider sx={{ mb: 1 }} />
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Nom du Tva *
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Pourcentage*
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        {showDetails ? null : <Divider />}

        <DialogActions>
          {editTva ? (
            <Button
              variant="contained"
              sx={{
                //  backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
              onClick={onUpdateTva}
            >
              Modifier
            </Button>
          ) : editTva === false && showDetails === false ? (
            <Button
              variant="contained"
              sx={{
                //  backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
              onClick={addNewTva}
            >
              Ajouter
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    arrayAllTva: state.userServices.arrayAllTva,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createTva: (data) => dispatch(actionCreator.createTva(data)),
    getAllTva: (data) => dispatch(actionCreator.getAllTva(data)),
    updateTva: (data) => dispatch(actionCreator.updateTva(data)),
    deleteTva: (data) => dispatch(actionCreator.deleteTva(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tva);
