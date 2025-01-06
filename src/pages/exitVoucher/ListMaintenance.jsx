

import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, } from '@mui/material';

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { useReactToPrint } from 'react-to-print';

// import icons

import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline';
import { Reload, Magnify, EyeOutline, DeleteOutline, Barcode } from 'mdi-material-ui';
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


const ListMaintenance = (props) => {


  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


  const [loading,setLoading]= useState(false)

  const [openModalDeleteMaintenance,setOpenModalDeleteMaintenance]= useState(false)
  const [itemToDelete,setItemToDelete]= useState({})

  const dispatch = useDispatch()

  const arrayAllMaintenance = useSelector(state=> state.maintenanceReducer.maintenances)


  const [attributeSearch, setAttributeSearch] = useState({
    id:"",
    machine:"",
  })


  /****************************************** */


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
    getAllMaintenance(attributeSearch)
  }, [])

  const getAllMaintenance = (data) => {
    dispatch(actionCreator.searchMaintenance(data,setLoading))
  }


  const onReload = () => {
    setAttributeSearch({
        id:"",
        machine:"",
    })
    const data = {
        id:"",
        machine:"",
    }
    getAllMaintenance(data)
  }

  // ***********************************************************************
  const goToAddMaintenance = (maintenanceId,source) => {
    navigate("/add-maintenance",{state:{maintenanceId,source}})
  }
  // ***********************************************************************

 // ***********************************************************************

 const handleDelete = (item) => {
  setItemToDelete(item); // set the item to be deleted
  setOpenModalDeleteMaintenance(true); // show the confirmation modal
};

const handleCancelDelete = () => {
  setItemToDelete({}); // set the item to be deleted
  setOpenModalDeleteMaintenance(false); // show the confirmation modal
};


const handleConfirmDelete = () => {
  const data={
    id:itemToDelete.id,
    handleClickVariant: (msg, val) => {
      let variant = val;
      enqueueSnackbar(msg, { variant });
      getAllMaintenance(attributeSearch)
    }
  }
  dispatch(actionCreator.deleteMaintenance(data))
  setItemToDelete({}); // reset itemToDelete state
  setOpenModalDeleteMaintenance(false); // hide the confirmation modal
};

  return (
    <div>
{loading?<Loader/>:

<>
<Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
          Gestion des bon de sortie maintenance
        </Typography>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container sx={{ p: 2 }} spacing={4}>

          <Grid item xs={12} md={2}>
          <FormControl fullWidth size='small'>
                <TextField
                placeholder='Machine'
                size='small'
                value={attributeSearch.id}
                onChange={(e)=>setAttributeSearch({...attributeSearch, machine:e.target.value })}
              />
                    
              </FormControl>
              </Grid>

          <Grid item xs={12} md={2}>
        
          <FormControl fullWidth size='small'>
                <TextField
                placeholder='ID Maintenance'
                size='small'
                value={attributeSearch.id}
                onChange={(e)=>setAttributeSearch({...attributeSearch, id:e.target.value })}
              />
                    
              </FormControl>

            </Grid>
            
           
            <Grid item xs={12} md={8} className="flex-Box" sx={{ justifyContent: "end" }}  >
              
              <Button
              
                //onClick={() => getSellOrderAndElements(attributeSearch)}
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
              Liste des bon de sortie maintenance
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.85rem", fontWeight: "600" }}
              >
                {" "}
                {arrayAllMaintenance &&arrayAllMaintenance.length} Bon de sortie maintenance
              </Typography>{" "}
              
            </Box>
          </div>

          <button
            onClick={() => goToAddMaintenance(null,"add")}
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
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Id Maintenance </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Machine </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Probléme</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Date de creation </TableCell>
                  {/* <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Statu de paiement</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Facture </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Bon de commande</TableCell> */}
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {arrayAllMaintenance && arrayAllMaintenance.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>
                       {row.id}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.machine} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.issue} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {moment(row.createdAt).format("DD/MM/YYYY")} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }} >
                        <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToAddMaintenance(row.id,"details")} />
                        <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 , color:"red"}} onClick={() => handleDelete(row)} />
                        {/* <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToAddMaintenance(row.id,"update")} /> */}
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
            count={arrayAllMaintenance && arrayAllMaintenance.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>


      </>}

      <Dialog
        open={openModalDeleteMaintenance}
        onClose={() => handleCancelDelete()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir supprimer cette bon de sortie ?
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

    </div>
  )
}

export default ListMaintenance