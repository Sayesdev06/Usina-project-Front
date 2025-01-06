import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'
import * as actionCreator from "../../actions";
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, } from '@mui/material';
import { EyeOutline, DeleteOutline } from 'mdi-material-ui';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import CachedIcon from '@mui/icons-material/Cached';
import { useNavigate } from 'react-router-dom';

function ListDelivery() {

  let timeoutId;
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

    // ** States
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading,setLoading]= useState(false)
    const [itemToDelete,setItemToDelete]= useState({})
    const [attributeSearch, setAttributeSearch] = useState({
      activityId:"",
      clientId:"",
      statusDelivery:"",
      sellOrderId:"",
    })
    const [openModalDeleteOrder,setOpenModalDeleteOrder]= useState(false)

    /**reducer */
    const arrayAllActivity = useSelector((state)=>state.productServices.arrayAllActivity)
    const arrayAllDelivery = useSelector((state)=>state.sellOrderReducer.arrayAllDelivery)
    const arrayAllClient = useSelector((state)=>state.userServices.arrayAllClient)
    /*********************USEEFFECT***************** */
    useEffect(()=>{
      const data ={
        fullname: "",
          email: "",
          country: "",
          type: ""
    }
    dispatch(actionCreator.getAllClient(data))
    dispatch(actionCreator.getAllActivity())
      getAllDelivery(attributeSearch)
    },[])

    // ***********************************************************************
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
      setRowsPerPage(+event.target.value)
      setPage(0)
    }

      /****************************************** */
  const handleChangeAttributeSearch = prop => event => {
    setAttributeSearch({ ...attributeSearch, [prop]: event.target.value })
  }

  const goToCreateDelivery = (deliveryId,source) => {
    navigate("/add-livraison",{state:{source,deliveryId}})
  }

 

    const getAllDelivery = (data) => {
        dispatch(actionCreator.searchDelivery(data))
    }

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
          getAllDelivery({
            activityId:"",
            clientId:"",
            statusDelivery:"",
            sellOrderId:"",
          })
          enqueueSnackbar(msg, { variant });
          
        }
      }
      dispatch(actionCreator.deleteDelivery(data))
      setItemToDelete({}); // reset itemToDelete state
      setOpenModalDeleteOrder(false); // hide the confirmation modal
    };
  


  return (

<>
{loading?<Loader/>:

<div>
<Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
          Gestion de bon de livraison
        </Typography>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container sx={{ p: 2 }} spacing={4}>

          <Grid item xs={12} md={2}>
          <FormControl fullWidth size='small'>
                <TextField
                placeholder='ID Commande'
                size='small'
                value={attributeSearch.sellOrderId}
                onChange={(e)=>setAttributeSearch({...attributeSearch, sellOrderId:e.target.value })}
              />
                    
              </FormControl>
              </Grid>

          <Grid item xs={12} md={2}>
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">Clients</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.clientId}
                  label="Clients"
                  onChange={handleChangeAttributeSearch("clientId")}
                >
                  {arrayAllClient && arrayAllClient.map((client, key) =>
                    <MenuItem value={client.id} key={key} >{client.fullname}</MenuItem>
                  )}
                </Select>
              </FormControl>

            </Grid>

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
              <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Statut livraison</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.statusDelivery}
                  label="Statut livraison"
                  onChange={handleChangeAttributeSearch("statusDelivery")}
                >
                  <MenuItem value="LIVRÉE TOTALEMENT" key={1}>
                    LIVRÉE TOTALEMENT
                  </MenuItem>

                  <MenuItem value="LIVRÉE PARTIELLEMENT" key={2}>
                    LIVRÉE PARTIELLEMENT
                  </MenuItem>
                    
                  <MenuItem value="NON LIVRÉE" key={3}>
                    NON LIVRÉE
                  </MenuItem>
                    
                  <MenuItem value="RÉCEPTIONNÉ" key={4}>
                    RÉCEPTIONNÉ
                  </MenuItem>

                </Select>
              </FormControl>
            </Grid>
            
           
            <Grid item xs={12} md={4} className="flex-Box" sx={{ justifyContent: "end" }}  >
              
              <Button
                
                onClick={() => getAllDelivery(attributeSearch)}
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
              Liste de bon de livraison
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.85rem", fontWeight: "600" }}
              >
                {" "}
                {arrayAllDelivery &&arrayAllDelivery.length} Bon de livraison
              </Typography>{" "}
            </Box>
          </div>

          <button
            onClick={() => goToCreateDelivery(null,'add')}
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
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Commande ID </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Client </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Activite </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Statut Livraison</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Date de Livraison</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {arrayAllDelivery && arrayAllDelivery.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>
                        # {row.id}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>
                      {row.sellOrder.id}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellOrder && row.sellOrder.client && row.sellOrder.client.fullname}   </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellOrder.activity.name}   </TableCell>
                      
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellOrder.statusDelivery} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {moment(row.createdAt).format('DD/MM/YYYY')} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }} >
                        <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToCreateDelivery(row.id,"details")} />
                        <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 , color:"red"}} onClick={() => handleDelete(row)} />
                        {/* <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToCreateDelivery(row.id,"update")} /> */}
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
            count={arrayAllDelivery && arrayAllDelivery.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>

    </div>
    }

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
    </>

  )
  
}


export default ListDelivery