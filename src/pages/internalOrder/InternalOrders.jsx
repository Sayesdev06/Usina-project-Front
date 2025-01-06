

import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, } from '@mui/material';

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

// import icons
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline';
import { Reload, Magnify, EyeOutline, DeleteOutline } from 'mdi-material-ui';
import { useSnackbar } from 'notistack';

import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import moment from 'moment';
import InputDate from '../../components/shared/InputDate';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import CardTicket from '../../components/CardTicket';
import CachedIcon from '@mui/icons-material/Cached';
import Loader from '../../components/loader';


//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable


const InternalOrders = (props) => {


  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [itemToDelete,setItemToDelete]= useState({})
  const [openModalDeleteOrder,setOpenModalDeleteOrder]= useState(false)
  const [loading,setLoading]= useState(false)

  const dispatch = useDispatch()

  const [attributeSearch, setAttributeSearch] = useState({
    activityId:"",
    endDate:"",
    startDate:"",
  })

  /**************Reducer data ******************* */
  const arrayAllActivity = useSelector((state)=>state.productServices.arrayAllActivity)
  const internalOrders = useSelector((state)=>state.internalOrderReducer.internalOrders)
 
  


  /****************************************** */
  const handleChangeAttributeSearch = prop => event => {
    setAttributeSearch({ ...attributeSearch, [prop]: event.target.value })
  }
  // ***********************************************************************

  // const handleChange = (prop, newValue) => {
  //   setAttributeSearch({ ...attributeSearch, [prop]: newValue })
  // };
  // ***********************************************************************

  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)


  // ***********************************************************************

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // ***********************************************************************

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }


  // ***********************************************************************
  useEffect(() => {
    setLoading(true)
    searchInternalOrder(attributeSearch)
    dispatch(actionCreator.getAllActivity())

    
  }, [])

  const searchInternalOrder = (data) => {
    dispatch(actionCreator.searchInternalOrder(data,setLoading))
  }


  // ***********************************************************************

  const handleDelete = (item) => {
    setItemToDelete(item); // set the item to be deleted
    setOpenModalDeleteOrder(true); // show the confirmation modal
  };

  const handleCancelDelete = () => {
    setItemToDelete({}); // set the item to be deleted
    setOpenModalDeleteOrder(false); // show the confirmation modal
  };


  const handleConfirmDelete = () => {
    const data={
      id:itemToDelete.id,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        searchInternalOrder(attributeSearch)
      }
    }
    dispatch(actionCreator.deleteInternalOrder(data))
    setItemToDelete({}); // reset itemToDelete state
    setOpenModalDeleteOrder(false); // hide the confirmation modal
  };


  const onReload = () => {
    setAttributeSearch({
        activityId:"",
        endDate:"",
        startDate:"",
    })
    const data = {
        activityId:"",
        endDate:"",
        startDate:"",
    }
    searchInternalOrder(data)
  }

  // ***********************************************************************
  const goToInternalOrder = (internalOrderId,source) => {
    navigate("/add-commande-interne",{state:{source,internalOrderId}})
  }
  // ***********************************************************************

  return (
    <div>
{loading?<Loader/>:

<>
<Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
          Gestion des Commandes interne
        </Typography>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container sx={{ p: 2 }} spacing={4}>


            <Grid item xs={12} md={2}>
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">Activities</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.activityId}
                  label="Activities"
                  onChange={handleChangeAttributeSearch("activityId")}
                >
                  {arrayAllActivity && arrayAllActivity.map((activity, key) =>
                    <MenuItem value={activity.id} key={key} >{activity.name}</MenuItem>
                  )}
                </Select>
              </FormControl>

            </Grid>

            <Grid item xs={12} md={2}>
       
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    inputFormat="YYYY-MM-DD"
                    label="Date de debut"
                    value={attributeSearch.startDate}
                    onChange={(newValue) =>
                      setAttributeSearch({ ...attributeSearch, startDate: newValue })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>

<Grid item xs={12} md={2}>
   

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                  inputFormat="YYYY-MM-DD"
                  label="Date de fin"
                  value={attributeSearch.endDate}
                  onChange={(newValue) =>
                    setAttributeSearch({ ...attributeSearch, endDate: newValue })
                  }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>

            
           
            <Grid item xs={12} md={6} className="flex-Box" sx={{ justifyContent: "end" }}  >
              
              <Button
                
                onClick={() => searchInternalOrder(attributeSearch)}
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
          sx={{ flex: "1 1 100%",mt:3, justifyContent: "space-between" }}
        >
          <div className="d-flex">
            <Typography
              className="color-title"
              sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
            >
              Liste des Commande de interne
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.85rem", fontWeight: "600" }}
              >
                {" "}
                {internalOrders &&internalOrders.length} Commande de interne
              </Typography>{" "}
            </Box>
          </div>

          <button
            onClick={() => goToInternalOrder(null,'add')}
            className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
          >
            + Ajouter
          </button>
        </Grid>

      <Grid container sx={{ mt: 1 }} >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead >
                <TableRow >
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Id </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Activite </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Date de creation </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {internalOrders && internalOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>
                        # {row.id}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.activity.name}   </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {moment(row.createdAt).format("DD/MM/YYYY")} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }} >
                        <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToInternalOrder(row.id,"details")} />
                        <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 , color:"red"}} onClick={() => handleDelete(row)} />
                        {/* <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToInternalOrder(row.id,"update")} /> */}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={internalOrders && internalOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>


      <Dialog
        open={openModalDeleteOrder}
        onClose={() => handleCancelDelete()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir supprimer ?
          </DialogContentText>
        </DialogContent>
        <div className="d-flex justify-content-between p-3">
          <Button
            onClick={() => handleCancelDelete()}
            className="red-button"
          >
            Non
          </Button>
          <Button
            onClick={() => handleConfirmDelete()}
            
            className="green-button"
          >
            Oui
          </Button>
        </div>
      </Dialog>
      </>}

    </div>
  )
}

export default InternalOrders

