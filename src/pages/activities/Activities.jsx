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
import { useSnackbar } from "notistack";

import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import { Close, Reload } from "mdi-material-ui";
import CardTicket from "../../components/CardTicket";
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
    label: "Nom ",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
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
            Liste des activités{" "}
          </Typography>
          <Box className="number-listing">
            {" "}
            <Typography
              className="color-title"
              sx={{ fontSize: "0.75rem", fontWeight: "600" }}
            >
              {" "}
              {props.arrayAllActivity.length} activité
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
            onClick={() => onOpenModalAddActivity()}
          >
            <PlusCircleOutline />
            <Typography>activités</Typography>
          </IconButton>
        </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Activities = (props) => {
  const { arrayAllActivity } = props;

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModalAddActivity, setopenModalAddActivity] = useState(false);
  const [editTiers, setEditTiers] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editActivity, setEditActivity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attributeActivitySearch, setAttributeActivitySearch] = useState({
    name: "",
    description: "",
  });
  const [attributeActivity, setAttributeActivity] = useState({
    name: "",

    description: "",
  });

  const handleChangeAttributeActivity = (prop) => (event) => {
    setAttributeActivity({ ...attributeActivity, [prop]: event.target.value });
  };
  const handleChangeAttributeActivitySearch = (prop) => (event) => {
    setAttributeActivitySearch({
      ...attributeActivitySearch,
      [prop]: event.target.value,
    });
  };

  useEffect(() => {
    setLoading(true);
    getAllActivity();
    // dispatch(actionCreator.getActivityStatistic());
  }, []);

  const getAllActivity = () => {
    const data = {
      ...attributeActivitySearch,
      setLoading,
    };
    props.searchActivity(data);
  };
  const onOpenModalAddActivity = () => {
    setopenModalAddActivity(true);
    setEditTiers(false);
    // afterSave()
  };

  const onCloseModalAddActivity = () => {
    setopenModalAddActivity(false);
    setAttributeActivity({
      name: "",

      description: "",
    });
  };

  const addActivity = () => {
    const data = {
      name: attributeActivity.name,
      description: attributeActivity.description,
      afterSave: () => {
        afterSave(), onCloseModalAddActivity(), getAllActivity();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    if (attributeActivity.name === "" || attributeActivity.description === "") {
      let variant = "warning";
      enqueueSnackbar("Tous les champs sont obligatoire!", { variant });
    } else props.createActivity(data);
  };

  const onOpenModalupdateActivity = (details) => {
    setEditActivity(true);
    setAttributeActivity(details);
    setopenModalAddActivity(true);
  };
  const onupdateActivity = () => {
    const data = {
      id: attributeActivity.id,
      name: attributeActivity.name,
      description: attributeActivity.description,
      afterSave: () => {
        afterSave(), onCloseModalAddActivity(), getAllActivity();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    if (attributeActivity.name === "" || attributeActivity.description === "") {
      let variant = "warning";
      enqueueSnackbar("Tous les champs sont obligatoire!", { variant });
    } else props.updateActivity(data);
  };
  const ondeleteActivity = (row) => {
    const data = {
      id: row.id,
      getAllActivity: () => {
        getAllActivity();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    props.deleteActivity(data);
  };

  const showDetailsTiers = (data) => {
    setEditTiers(false);
    setShowDetails(true);
    setAttributeActivity(data);
    setopenModalAddActivity(true);
  };
  const afterSave = () => {
    setAttributeActivity({
      name: "",

      description: "",
    });
    setEditActivity(false);
    // setopenModalAddActivity(false)
  };

  const onReload = () => {
    setAttributeActivitySearch({
      name: "",
      description: "",
    });
    const data = {
      name: "",
      description: "",
    };

    props.searchActivity(data);
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
        ) : (
          <Grid item className="flex-Box" sx={{ flex: "1 1 100%" }}>
            <Typography
              className="color-title"
              sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
            >
              Liste des activités{" "}
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.75rem", fontWeight: "600" }}
              >
                {" "}
                {props.arrayAllActivity.length} activité
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
              onClick={() => onOpenModalAddActivity()}
            >
              <PlusCircleOutline sx={{ mr: 1, fontSize: "1.2rem" }} />
              <Typography>activités</Typography>
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
      const newSelected = arrayAllActivity.map((n) => n.name);
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - arrayAllActivity.length)
      : 0;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <Typography
              className="color-title"
              sx={{ fontWeight: "600", mt: 2 }}
            >
              Gestion des Activites{" "}
            </Typography>

            <Paper sx={{ width: "100%", mb: 2 }}>
              <Grid container sx={{ p: 2 }}>
                <Grid
                  item
                  xs={12}
                  md={9}
                  sx={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  Nom:
                  <TextField
                    size="small"
                    sx={{ width: "250px" }}
                    value={attributeActivitySearch.name}
                    onChange={handleChangeAttributeActivitySearch("name")}
                  />
                </Grid>

                <Grid item xs={12} md={3} sx={{ textAlign: "end" }}>
                  <Button
                    onClick={() => getAllActivity()}
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
                Liste des Activites
              </Typography>
              <Box className="number-listing">
                {" "}
                <Typography
                  className="color-title"
                  sx={{ fontSize: "0.85rem", fontWeight: "600" }}
                >
                  {" "}
                  {props.arrayAllActivity.length} Activites
                </Typography>{" "}
              </Box>
            </div>

            <button
              onClick={() => onOpenModalAddActivity()}
              className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
            >
              + Ajouter
            </button>
          </Grid>

          <Box sx={{ width: "100%", mt: 2 }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              {/* <EnhancedTableToolbar numSelected={selected.length} arrayAllActivity={arrayAllActivity} /> */}
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={arrayAllActivity.length}
                  />
                  <TableBody>
                    {stableSort(arrayAllActivity, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
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
                                  handleClick(event, row.name)
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
                              <p className="text-over-flow">
                                {row.description}
                              </p>
                            </TableCell>
                            <TableCell align="left" sx={{ color: "#3a3541ad" }}>
                              <EyeOutline
                                sx={{ fontSize: "1.2rem", cursor: "pointer" }}
                                onClick={() => showDetailsTiers(row)}
                              />
                              <DeleteOutline
                                sx={{
                                  fontSize: "1.2rem",
                                  cursor: "pointer",
                                  ml: 2,
                                }}
                                onClick={() => ondeleteActivity(row)}
                              />
                              <PencilOutline
                                sx={{
                                  fontSize: "1.2rem",
                                  cursor: "pointer",
                                  ml: 2,
                                }}
                                onClick={() => onOpenModalupdateActivity(row)}
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
                count={arrayAllActivity.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </>
      )}

      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={openModalAddActivity}
        onClose={onCloseModalAddActivity}
      >
        <DialogTitle
          className="flex-Box-between"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <Box className="flex-Box">
            <Typography className="color-title" sx={{ fontWeight: "600" }}>
              {" "}
              Ajouter une nouvelle activité
            </Typography>
          </Box>
          <Close
            sx={{ cursor: "pointer" }}
            onClick={() => onCloseModalAddActivity()}
          />
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Nom de la activité*
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={attributeActivity.name}
                onChange={handleChangeAttributeActivity("name")}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Description*
              </Typography>
              <TextField
                size="small"
                fullWidth
                multiline
                minRows={3}
                placeholder="Description"
                value={attributeActivity.description}
                onChange={handleChangeAttributeActivity("description")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          {editActivity ? (
            <Button
              variant="contained"
              sx={{
                //  backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
              onClick={() => onupdateActivity()}
            >
              Modifier
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                //  backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
              onClick={() => addActivity()}
            >
              Valider
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    arrayAllActivity: state.productServices.arrayAllActivity,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchActivity: (data) => dispatch(actionCreator.searchActivity(data)),
    createActivity: (data) => dispatch(actionCreator.createActivity(data)),
    updateActivity: (data) => dispatch(actionCreator.updateActivity(data)),
    deleteActivity: (data) => dispatch(actionCreator.deleteActivity(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
