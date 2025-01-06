

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


const ListExitVoucherOrder = (props) => {


  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading,setLoading]= useState(false)
  const [openModalAddElement, setOpenModalAddElement] = useState(false);
  const [elementId,setElementId]=useState(0);
  const [valueReturned,setValueReturned]=useState(0);
  const [barCode,setBarCode]=useState("");

  const dispatch = useDispatch()

  const divRef = useRef(null);

  const [attributeSearch, setAttributeSearch] = useState({
    id:"",
    clientId:"",
    activityId:"",
    statusProduction:"",
    //statusDelivery:"",
    sellOrderType:"",
  })

  /**************Reducer data ******************* */
  const arrayAllClient = useSelector((state)=>state.userServices.arrayAllClient)
  const arrayAllActivity = useSelector((state)=>state.productServices.arrayAllActivity)
  const elementsSellOrder = useSelector((state)=>state.sellOrderReducer.elementsSellOrder)
 
  


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
    getSellOrderAndElements(attributeSearch)
    const data ={
        fullname: "",
          email: "",
          country: "",
          type: ""
    }
    dispatch(actionCreator.getAllClient(data))
    dispatch(actionCreator.getAllActivity())

    
  }, [])

  const getSellOrderAndElements = (data) => {
    dispatch(actionCreator.getSellOrderAndElements(data,setLoading))
  }


  const onReload = () => {
    setAttributeSearch({
        id:"",
        clientId:"",
        activityId:"",
        statusProduction:"",
        //statusDelivery:"",
        sellOrderType:"",
    })
    const data = {
        id:"",
        clientId:"",
        activityId:"",
        statusProduction:"",
        //statusDelivery:"",
        sellOrderType:"",
    }
    getSellOrderAndElements(data)
  }

  // ***********************************************************************
  const goToElementSellOrderDetails = (sellOrderId) => {
    navigate("/element-commande-de-vente-details",{state:{sellOrderId}})
  }
  // ***********************************************************************


    const updatePiecequantity = (id,value) => {
    const data = {
      id:elementId,
      value:valueReturned,
      setBarCode,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        //dispatch(actionCreator.getSellOrderById(sellOrderId));
      },
    };
    dispatch(actionCreator.updatePiecequantity(data))
  };

  const handlePrint = useReactToPrint({
    content: () => divRef.current,
  });
  
  const goToAddSellOrder = (sellOrderId,source) => {
    navigate("/add-commande-vente",{state:{source,sellOrderId}})
  }

  return (
    <div>
{loading?<Loader/>:

<>
<Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
          Gestion des Bon de srotie
        </Typography>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container sx={{ p: 2 }} spacing={4}>

          <Grid item xs={12} md={2}>
          <FormControl fullWidth size='small'>
                <TextField
                placeholder='ID Commande'
                size='small'
                value={attributeSearch.id}
                onChange={(e)=>setAttributeSearch({...attributeSearch, id:e.target.value })}
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
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">Statut Production</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.statusProduction}
                  label="Statut Production"
                  onChange={handleChangeAttributeSearch("statusProduction")}
                >
                    {/* <MenuItem value="" key={0}></MenuItem> */}
                   
                    <MenuItem value="CRÉER" key={1}>
                    CRÉER
                  </MenuItem>
                  <MenuItem value="EN COURS DE PRODUCTION" key={2}>
                    EN COURS DE PRODUCTION
                  </MenuItem>
                  <MenuItem value="FINI" key={3}>
                    FINI
                  </MenuItem>
                </Select>
              </FormControl>

            </Grid>

            {/* <Grid item xs={12} md={2}>
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
            </Grid> */}

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.orderType}
                  label="orderType"
                  onChange={handleChangeAttributeSearch("sellOrderType")}
                >
                  <MenuItem value="LOCAUX">Locaux</MenuItem>
                  <MenuItem value="IMPORTATION">Importation</MenuItem>
                </Select>
              </FormControl>

            </Grid>
            
           
            <Grid item xs={12} md={2} className="flex-Box" sx={{ justifyContent: "end" }}  >
              
              <Button
              
                onClick={() => getSellOrderAndElements(attributeSearch)}
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
            Bon de srotie
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.85rem", fontWeight: "600" }}
              >
                {" "}
                {elementsSellOrder &&elementsSellOrder.length} Bon de srotie
              </Typography>{" "}
              
            </Box>
          </div>

          <button
            onClick={() => setOpenModalAddElement(true)}
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
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} >  N° commande </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Activite </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Client </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Status Production</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Type</TableCell>
                  {/* <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Statu de paiement</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Facture </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Bon de commande</TableCell> */}
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {elementsSellOrder && elementsSellOrder.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>
                        <a className='a-href' onClick={()=> goToAddSellOrder(row.id,"details")}>{row.id}</a>
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.activity.name}   </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.client&&row.client.fullname} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.statusProduction} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellOrderType} </TableCell>
                      
                      {/* <TableCell sx={{ color: "#3a3541ad" }}> {row.statusDelivery} </TableCell> */}
                      {/* <TableCell sx={{ color: "#3a3541ad" }}> {row.statusPayment} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}><span className='pointer' onClick={()=>{openFile(row.file)}}>{row.file? getFileName(row.file):""}</span></TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}><span className='pointer' onClick={()=>{openFile(row.sellOrderFile)}}>{row.sellOrderFile? getFileName(row.sellOrderFile):""}</span></TableCell> */}
                      <TableCell sx={{ color: "#3a3541ad" }} >
                        <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToElementSellOrderDetails(row.id)} />
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
            count={elementsSellOrder && elementsSellOrder.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>

      <Dialog
        open={openModalAddElement}
        onClose={() => {setOpenModalAddElement(false),setElementId(0),setValueReturned(0),setBarCode("")}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Element"}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            entre le code a bar de element:
          </DialogContentText> */}
        </DialogContent>
        <div className="flex-column algin-items-center p-4 gap-4">

<div style={{width:"430px"}}>
Entre le code a bar de element :
<TextField
                  fullWidth
                  type='numbre'
                  size='small'
                  onChange={(e)=>setElementId(e.target.value)}
                />

</div>
        
{elementId ?
  <div  style={{width:"430px"}}>
nouvelle valeur retourner :
        <TextField
                  fullWidth
                  type='numbre'
                  size='small'
                  onChange={(e)=>setValueReturned(e.target.value)}
                />
                </div>:null
}

{barCode? 
  <img src={barCode} alt="codabar" width={"160px"} height={"80px"} ref={divRef}/>
:null}


{barCode?
 <Button
 onClick={handlePrint}
 className="green-button"
>
 Imprimer
</Button>
          :
          <Button
            onClick={() => updatePiecequantity()}
          
            className="green-button"
          >
           + Ajouter
          </Button>
          }
        </div>
      </Dialog>

      </>}

    </div>
  )
}

export default ListExitVoucherOrder