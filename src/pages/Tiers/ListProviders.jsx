import React, { useEffect, useState } from 'react';
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
        label: 'Nom du fournisseur',
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
        label: 'Type de fournisseur',
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
    // {
    //     id: 'actions',
    //     numeric: null,
    //     disablePadding: false,
    //     label: 'Actions',
    // },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, source } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ backgroundColor: "#F7F6F9" }} >
            <TableRow>
                <TableCell padding="checkbox" sx={{ color: "#3a3541de", fontSize: '0.87rem', fontWeight: '600' }}>
                    {source === 'providerComponent' ?
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        /> : null}
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
                {source === 'providerComponent' ?
                    <TableCell sx={{ color: "#3a3541de", fontSize: '0.87rem', fontWeight: '600' }}>
                        Actions
                    </TableCell> : null}
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
    const { numSelected, } = props;

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
                    <Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 }} >Liste des Fournisseurs </Typography>
                    <Box className='number-listing' > <Typography className='color-title' sx={{ fontSize: "0.75rem", fontWeight: '600' }} > {props.arrayAllProvider.length} Fournisseurs</Typography>  </Box>
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

                    <IconButton id='tooltip-with-border' sx={{ ml: 1 }} onClick={() => props.onOpenModalAddTiers()} >
                        <PlusCircleOutline />
                        <Typography>Fournisseur</Typography>
                    </IconButton>
                </>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};





const ListProviders = (props) => {
    const { arrayAllProvider, source ,addUser} = props
    
    const { enqueueSnackbar } = useSnackbar();


    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(source === "providerComponent" ? 8 : 3);
    const [openModalAddTiers, setopenModalAddTiers] = useState(false);
    const [editTiers, setEditTiers] = useState(false);
    const [showDetails, setShowDetails] = useState(false);


    const [attributeTiersSearch, setAttributeTiersSearch] = useState({
        fullname: "",
        country: "",
        email: "",
        type: '',
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
    const onOpenModalAddTiers = () => {
        setopenModalAddTiers(true);
        setEditTiers(false)
        afterSave()
    };
    const onCloseModalAddTiers = () => {
        setopenModalAddTiers(false);
        props.setAddUserToFalse()
    };

    const handleChangeAttributeTiersSearch = prop => event => {
        setAttributeTiersSearch({ ...attributeTiersSearch, [prop]: event.target.value })
    }

    const handleChangeAttributeTiers = prop => event => {
        setAttributeTiers({ ...attributeTiers, [prop]: event.target.value })
    }
    useEffect(() => {
        getALLProviders()
    }, [])

    useEffect(() => {
        if(addUser){
            onOpenModalAddTiers()
        }
    }, [addUser])

    

    const getALLProviders = () => {
        const data = {
            ...attributeTiersSearch
        }
        props.getAllProvider(data)
    }
    const onUpdateProvider = (data) => {

        setEditTiers(true)
        setAttributeTiers(data)
        setopenModalAddTiers(true)
    }
    const onDeleteProvider = (row) => {
        const data = {
            id: row.id,
            getAllProvider: () => {
                getALLProviders()
            },
            handleClickVariant: (msg, val) => {
                let variant = val
                enqueueSnackbar(msg, { variant });
            }
        }
        props.deleteProvider(data)
    }

    const showDetailsTiers = (data) => {
        setShowDetails(true)
        setEditTiers(false)
        setAttributeTiers(data)
        setopenModalAddTiers(true)
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


    }




    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = arrayAllProvider.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name, details) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1 && selected.length===0) {
            //newSelected = [{selected, name}]
            newSelected = newSelected.concat(selected, name);

        } else if (selectedIndex === 0) {
            console.log("2t")
            newSelected = [{selected:selected}];
        } else if (selectedIndex === selected.length - 1) {
            console.log("3t")
            newSelected = [{selected:selected}];
        } else if (selectedIndex > 0) {
            console.log("4t")
            newSelected = []
        }

        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(selected, name);

        // } else if (selectedIndex === 0) {
        //     newSelected = newSelected.concat(selected.slice(1));
        // } else if (selectedIndex === selected.length - 1) {
        //     newSelected = newSelected.concat(selected.slice(0, -1));
        // } else if (selectedIndex > 0) {
        //     newSelected = newSelected.concat(
        //         selected.slice(0, selectedIndex),
        //         selected.slice(selectedIndex + 1),
        //     );
        // }

       setSelected(newSelected);


        if (props.source === 'commandeComponenet') {
            props.handleClickCheckProvider(name, details)
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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayAllProvider.length) : 0;

    return (
        <>

            <Box sx={{ width: '100%'}}>
                {/* <Paper sx={{ width: '100%', mb: 2 }}> */}
                {/* {source === 'providerComponent' ?
                    <EnhancedTableToolbar numSelected={selected.length}
                        arrayAllProvider={arrayAllProvider}
                        source={source}
                        onOpenModalAddTiers={() => onOpenModalAddTiers()}
                    /> : null

                } */}

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
                            rowCount={arrayAllProvider.length}
                            source={source}
                        />
                        <TableBody>
                            {stableSort(arrayAllProvider, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.fullname);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.fullname, row)}

                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.fullname}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
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
                                            {source === "providerComponent" ?
                                                <TableCell align="left" sx={{ color: "#3a3541ad", }} >
                                                    <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer" }} onClick={() => showDetailsTiers(row)} />
                                                    <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => onDeleteProvider(row)} />
                                                    <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => onUpdateProvider(row)} />
                                                </TableCell> : null}
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
                    count={arrayAllProvider.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* </Paper> */}

            </Box>

            <AddTiers
                title={editTiers ? "Modifier détails Fournisseur" : showDetails ? "Détails Fournisseur" : "Ajouter un nouveau Fournisseur"}
                label={"fournisseur"}
                openModalAddTiers={openModalAddTiers}
                onOpenModalAddTiers={() => onOpenModalAddTiers()}
                onCloseModalAddTiers={() => onCloseModalAddTiers()}
                getALLList={() => getALLProviders()}

                showDetails={showDetails}
                editTiers={editTiers}
                attributeTiers={attributeTiers}
                handleChangeAttributeTiers={handleChangeAttributeTiers}
                afterSave={() => afterSave()}
            />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        arrayAllProvider: state.userServices.arrayAllProvider
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        getAllProvider: (data) => dispatch(actionCreator.getAllProvider(data)),
        deleteProvider: (data) => dispatch(actionCreator.deleteProvider(data)),

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListProviders)

