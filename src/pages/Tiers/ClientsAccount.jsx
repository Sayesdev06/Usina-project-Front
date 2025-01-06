import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import DeleteOutline from 'mdi-material-ui/DeleteOutline';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline';
import AddTiers from './AddTiers';
import { useSnackbar } from 'notistack';

import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import { useState, useEffect } from 'react';
import { Reload } from 'mdi-material-ui';

import CachedIcon from '@mui/icons-material/Cached';
import Loader from '../../components/loader';




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
  return order === 'desc'
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
    id: 'fullname',
    numeric: false,
    disablePadding: true,
    label: 'Nom du client',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type de client',
  },
  {
    id: 'tvaNumber',
    numeric: true,
    disablePadding: false,
    label: 'Numéro de TVA ',
  },
  {
    id: 'registrationNumber',
    numeric: true,
    disablePadding: false,
    label: 'Matricule fiscal',
  },
  {
    id: 'actions',
    numeric: null,
    disablePadding: false,
    label: 'Actions',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ backgroundColor: "#F7F6F9" }} >
      <TableRow>
        <TableCell padding="checkbox" sx={{ color: "#3a3541de", fontSize: '0.87rem', fontWeight: '600' }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ color: "#3a3541de", fontSize: '0.87rem', fontWeight: '600' }}
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
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
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} sélectionnés

        </Typography>
      ) : (

        <Grid item className='flex-Box' sx={{ flex: '1 1 100%' }}>
          <Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 }} >Liste des clients </Typography>
          <Box className='number-listing' > <Typography className='color-title' sx={{ fontSize: "0.75rem", fontWeight: '600' }} > {props.arrayAllClient.length} clients</Typography>  </Box>
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
          <Tooltip title="Filter list"   >
            <IconButton id='tooltip-with-border'>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <IconButton id='tooltip-with-border' sx={{ ml: 1 }} onClick={() => onOpenModalAddTiers()} >
            <PlusCircleOutline />
            <Typography>Client</Typography>
          </IconButton>
        </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};





const ClientAccount = (props) => {
  const { arrayAllClient } = props
  const { enqueueSnackbar } = useSnackbar();




  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openModalAddTiers, setopenModalAddTiers] = React.useState(false);
  const [editTiers, setEditTiers] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const [attributeTiersSearch, setAttributeTiersSearch] = useState({
    fullname: "",
    country: "",
    email: "",
    type:'',
  })
  const [attributeTiers, setAttributeTiers] = useState(
    {
      fullname: "",
      type: "",
      tvaNumber: "",
      registrationNumber: "",
      address: "",
      city: "",
      country: "",
      phoneNumber: "",
      contactPhoneNumber: "",
      email: "",
      contactEmail: "",
      tvaId: "",
    })

  const handleChangeAttributeTiers = prop => event => {
    setAttributeTiers({ ...attributeTiers, [prop]: event.target.value })
  }
  const handleChangeAttributeTiersSearch = prop => event => {
    setAttributeTiersSearch({ ...attributeTiersSearch, [prop]: event.target.value })
  }

  useEffect(() => {
    setLoading(true)
    getALLClients()
  }, [])

  const getALLClients = () => {
    const data = {
      ...attributeTiersSearch,
      setLoading
    }
    props.getAllClient(data)
  }
  const onOpenModalAddTiers = () => {

    setopenModalAddTiers(true);
    setEditTiers(false)
    afterSave()
  };

  const onCloseModalAddTiers = () => {
    setopenModalAddTiers(false);
  };

  const onUpdateClient = (data) => {

    setEditTiers(true)
    setAttributeTiers(data)
    setopenModalAddTiers(true);
  }

  const onDeleteClient = (row) => {
    const data = {
      id: row.id,
      getAllUsers: () => {
        getALLClients()
      },
      handleClickVariant: (msg, val) => {
        let variant = val
        enqueueSnackbar(msg, { variant });
      }
    }
    props.deleteClient(data)
  }

  const showDetailsTiers = (data) => {
    setEditTiers(false)
    setShowDetails(true)
    setAttributeTiers(data)
    setopenModalAddTiers(true);
  }
  const afterSave = () => {

    setAttributeTiers({
      fullname: "",
      type: "",
      tvaNumber: "",
      registrationNumber: "",
      address: "",
      city: "",
      country: "",
      phoneNumber: "",
      contactPhoneNumber: "",
      email: "",
      contactEmail: "",
      tvaId: "",
    })
    // setopenModalAddTiers(false)


  }

  const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} sélectionnés

          </Typography>
        ) : (
          <Grid item className='flex-Box' sx={{ flex: '1 1 100%' }}>
            <Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 }} >Liste des clients </Typography>
            <Box className='number-listing' > <Typography className='color-title' sx={{ fontSize: "0.75rem", fontWeight: '600' }} > {props.arrayAllClient.length} clients</Typography>  </Box>
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
            <Tooltip title="Filter list"   >
              <IconButton id='tooltip-with-border'>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <IconButton id='tooltip-with-border' sx={{ ml: 1 }} onClick={() => onOpenModalAddTiers()} >
              <PlusCircleOutline sx={{ mr: 1, fontSize: "1.2rem" }} />
              <Typography>Client</Typography>
            </IconButton>
          </>
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = arrayAllClient.map((n) => n.name);
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
        selected.slice(selectedIndex + 1),
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


  const onReload = () => {

    setAttributeTiersSearch({
      fullname: "",
      country: "",
      email: "",
      type:"",
    })
    const data = {
      fullname: "",
      country: "",
      email: "",
      type:"",
    }
    props.getAllClient(data)

    
}

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayAllClient.length) : 0;

  return (
    <>
{loading ? <Loader/> :
<>
<Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 ,mb:3}} >Gestion des comptes clients</Typography>

   <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
          <Grid container sx={{ p: 2 }} spacing={3} >
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px" ,whiteSpace:"nowrap"}}>
            Nom : 
              <TextField
                size='small'
                className='pt-0'
                
                value={attributeTiersSearch.fullname}
                onChange={handleChangeAttributeTiersSearch('fullname')}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px",whiteSpace:"nowrap"}}>
            Email :
              <TextField
                size='small'
               
            
                value={attributeTiersSearch.email}
                onChange={handleChangeAttributeTiersSearch('email')}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px",whiteSpace:"nowrap"}}>
            Pays :
              <TextField
                size='small'
             

              
                value={attributeTiersSearch.country}
                onChange={handleChangeAttributeTiersSearch('country')}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px",whiteSpace:"nowrap"}}>
              {/* <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Type
                            </Typography> */}
                            Type :
              <FormControl size="small" fullWidth>
                <Select
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  value={attributeTiersSearch.type}
                  onChange={handleChangeAttributeTiersSearch('type')}>
                  <MenuItem value="PASSAGER">Passager</MenuItem>
                  <MenuItem value="GRAND COMPTE">Grand compte</MenuItem>
                  <MenuItem value="PME">PME</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "end" }} >

            <Button  onClick={() => getALLClients()} sx={{ color: "black", backgroundColor: "#9155fd !important" , marginRight:"30px"}} >
                Chercher
              </Button>
                <CachedIcon className='color-orange pointer'  onClick={() => onReload()}/>
            </Grid>

          </Grid>
        </Paper>
      </Box>
      <Box sx={{ width: '100%', mt: 3 }}>

      <Grid item className='flex-Box' sx={{ flex: '1 1 100%' ,mb:2,justifyContent:"space-between"}}>
        <div className='d-flex'>
        <Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 }} >Liste des clients</Typography>
            <Box className='number-listing' > <Typography className='color-title' sx={{ fontSize: "0.85rem", fontWeight: '600' }} > {arrayAllClient.length} Clients</Typography>  </Box>
        </div>
            

            <button onClick={() => onOpenModalAddTiers()} className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black">
          + Ajouter
                </button>
          </Grid>


        <Paper sx={{ width: '100%', mb: 2 }}>
          {/* <EnhancedTableToolbar numSelected={selected.length} arrayAllClient={arrayAllClient} /> */}
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={arrayAllClient.length}
              />
              <TableBody>
                {stableSort(arrayAllClient, getComparator(order, orderBy))
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
                        key={row.fullname}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(event) => handleClick(event, row.fullname)}
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ color: "#3a3541ad", }}
                        >
                          {row.fullname}
                        </TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad", }}>{row.email}</TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad", }}>{row.type}</TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad", }}>{row.tvaNumber}</TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad", }}>{row.registrationNumber}</TableCell>
                        <TableCell align="left" sx={{ color: "#3a3541ad", }} >
                          <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer" }} onClick={() => showDetailsTiers(row)} />
                          <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => onDeleteClient(row)} />
                          <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => onUpdateClient(row)} />
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
            count={arrayAllClient.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

      </Box>

      <AddTiers
        title={editTiers ? "Modifier détails client" : showDetails ? "Détails client" : "Ajouter un nouveau client"}
        label={"client"}
        getALLList={() => getALLClients()}
        editTiers={editTiers}
        showDetails={showDetails}
        attributeTiers={attributeTiers}
        handleChangeAttributeTiers={handleChangeAttributeTiers}
        openModalAddTiers={openModalAddTiers}
        onCloseModalAddTiers={() => onCloseModalAddTiers()}
        afterSave={() => afterSave()}
      />
      </>}
    </>
    
  );
}

const mapStateToProps = (state) => {
  return {
    arrayAllClient: state.userServices.arrayAllClient
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    getAllClient: (data) => dispatch(actionCreator.getAllClient(data)),
    deleteClient: (data) => dispatch(actionCreator.deleteClient(data)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientAccount)

