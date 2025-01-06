

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
import CachedIcon from '@mui/icons-material/Cached';
import Loader from '../../components/loader';


//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable




const FinalProduct = (props) => {


  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [itemToDelete,setItemToDelete]= useState({})
  const [openModalDeleteOrder,setOpenModalDeleteOrder]= useState(false)
  const [loading,setLoading]= useState(false)
  const dispatch = useDispatch()

  const [attributeSearch, setAttributeSearch] = useState({
    categoryId: "",
    name: ""
  })

  /**************Reducer data ******************* */
  const arrayAllCatgories = useSelector((state)=>state.productServices.arrayAllCatgories)
  const finalProducts = useSelector((state)=>state.finalProductReducer.finalProducts)


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
    searchFinalProduct(attributeSearch)
    dispatch(actionCreator.getAllCategorys())
    
  }, [])

  const searchFinalProduct = (data) => {
    dispatch(actionCreator.searchFinalProduct(data,setLoading))
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
        searchFinalProduct(attributeSearch)
      }
    }
    dispatch(actionCreator.deleteFinalProduct(data))
    setItemToDelete({}); // reset itemToDelete state
    setOpenModalDeleteOrder(false); // hide the confirmation modal
  };


  const onReload = () => {
    setAttributeSearch({
      categoryId: "",
      name: ""
    })
    const data = {
      categoryId: "",
      name: ""
    }
    searchFinalProduct(data)
  }

  // ***********************************************************************
  const goToAddFinalProduct = (finalProductId,source) => {
    navigate("/add-produit-fini",{state:{source,finalProductId}})
  }
  // ***********************************************************************

  return (
    <div>
      {
        loading? <Loader/>:
      

<>
<Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
          Gestion des Produit Fini
        </Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container sx={{ p: 2 }} spacing={4}>

          <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            Nom:
              <FormControl fullWidth size='small'>
                <TextField
                size='small'
                value={attributeSearch.name}
                onChange={handleChangeAttributeSearch('name')}
              />
                    
              </FormControl>

            </Grid>
          

            <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            Categorie:
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.categoryId}
                  onChange={handleChangeAttributeSearch("categoryId")}
                >
                  {arrayAllCatgories && arrayAllCatgories.map((category, key) =>
                    <MenuItem value={category.id} key={key} >{category.name}</MenuItem>
                  )}
                </Select>
              </FormControl>

            </Grid>
            
           
            <Grid item xs={12} md={6} className="flex-Box" sx={{ justifyContent: "end" }}  >
              <Button
                
                onClick={() => searchFinalProduct(attributeSearch)}
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
              Liste des Produits fini
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.85rem", fontWeight: "600" }}
              >
                {" "}
                {finalProducts &&finalProducts.length} Produit Fini
              </Typography>{" "}
            </Box>
          </div>

          <button
            onClick={() => goToAddFinalProduct(null,'add')}
            className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black"
          >
            + Ajouter
          </button>
        </Grid>

      <Grid container sx={{ mt:2 }} >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead >
                <TableRow >
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Id </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Nom </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Catégorie </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Quantité  </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> prix de vente HT</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finalProducts && finalProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>
                        # {row.id}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.name}   </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.category&&row.category.name} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.quantity} {row.unit.unit} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellPriceHT} TND</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }} >
                        <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToAddFinalProduct(row.id,"details")} />
                        <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 , color:"red"}} onClick={() => handleDelete(row)} />
                        <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToAddFinalProduct(row.id,"update")} />
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
            count={finalProducts && finalProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      </>}


      <Dialog
        open={openModalDeleteOrder}
        onClose={() => handleCancelDelete()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir supprimer?
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

export default FinalProduct

