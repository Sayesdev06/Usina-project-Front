import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'
import { DeleteOutline } from 'mdi-material-ui';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import * as actionCreator from "../../actions";
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import {
  FormControl,
  Grid,
  Paper,
  Select,
  TextField,
  MenuItem,
  Button,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogContentText,
  InputLabel,
} from "@mui/material";

function ProductionForDelivery(props) {
  let timeoutId;
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
    // ** States
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [productions, setProductions] = useState([])
    const [listProduct, setListProduct] = useState([])
    const [listWarehouse, setListWarehouse] = useState([])
    const [attributeSearch, setAttributeSearch] = useState({
      product :"",
      warehouse : ""
    })

    // ***********************************************************************

    useEffect(() =>{
      if(props.productions.length>0){
        extractProduct(props.productions)
        extractWarehouse(props.productions)
        // let filteredProductions = props.productions
        // if(props.source === "details"){
        //   filteredProductions = props.productions.filter(item => item.deliveryId === props.deliveryId)
        // }



        setProductions(props.productions)
      }

    },[props.productions])

    function extractProduct(objectsArray) {
      const uniqueProduct = [...new Set(objectsArray.map(obj => obj.finalProduct.name))];
      setListProduct(uniqueProduct)
    }

    function extractWarehouse(objectsArray) {
      const uniqueWarehouse = [...new Set(objectsArray.map(obj => obj.warehouse&&obj.warehouse.name?obj.warehouse.name:""))];
      setListWarehouse(uniqueWarehouse)
    }


  
    const handleChangePage = (event, newPage) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
      setRowsPerPage(+event.target.value)
      setPage(0)
    }

    
    function generateCode(id) {
      const code = id.toString().padStart(14, '0'); 
      return code;
    }


    const handleUpdateStatusProduction = (value) => {
      if(value){
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {

        const data = {
          id:value,
          statusDelivery:"LIVRÉE",
          deliveryId:props.deliveryId,
          handleClickVariant: (msg, val) => {
            let variant = val;
            enqueueSnackbar(msg, { variant });
            props.getDeliveryById(props.deliveryId)
            //dispatch(actionCreator.getSellOrderAndPiecesById(location.state.sellOrderId))
          }
        }

        dispatch(actionCreator.updateStatusProduction(data));
      }, 1000);
    }

    }

    const searchProduction = (search) => {
      let dataProduction  = props.productions
      if(props.source=== "details"){
        dataProduction = dataProduction.filter(item => item.deliveryId === props.deliveryId)
      }
      let filteredProductions = dataProduction.filter(obj => {
        if (search.product && search.warehouse) {
          return obj.finalProduct.name === search.product && obj.warehouse.name === search.warehouse;
        } else if (search.product) {
          return obj.finalProduct.name === search.product;
        } else if (search.warehouse) {
          return obj.warehouse.name === search.warehouse;
        }
        return obj; // No filters provided, so no filtering is done
      });

      setProductions(filteredProductions)
    }

    const onReload = () =>{
      let data ={
        product :"",
        warehouse : ""
      }
      searchProduction(data)
      setAttributeSearch({
        product :"",
        warehouse : ""
      })
    }

  return (
    <>
    <div className='d-flex align-items-center mt-2'>

   
     <Typography className="color-title" sx={{ fontWeight: "600",mt:1}}>
              Produits à livrer / livrés :
        </Typography>

        {!props.file && 

<TextField
        type='numbre'
        size='small'
        onChange={(e)=>handleUpdateStatusProduction(e.target.value)}
        sx={{backgroundColor: "#fff"}}
      />
    
        }
       </div>





<Paper sx={{ width: "100%"}}>
<Grid container sx={{mt:1,pr:2,pl:2,pb:2}}  spacing={4}>

<Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center",whiteSpace:"nowrap"}}>
            Produit : 
              <FormControl fullWidth size='small'>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.product}
                  onChange={(e)=>setAttributeSearch({... attributeSearch, product: e.target.value})}
                >
                 {listProduct && listProduct.map((product,key) =>
                    <MenuItem value={product} key={key}>{product}</MenuItem>
                 )}
                </Select>
              </FormControl>

            </Grid>

            <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center",whiteSpace:"nowrap" }}>
            Entrepôt :
              <FormControl fullWidth size='small'>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.warehouse}
                  onChange={(e)=>setAttributeSearch({... attributeSearch, warehouse: e.target.value})}
                >
                  {listWarehouse && listWarehouse.map((warehouse,key) =>
                    <MenuItem value={warehouse} key={key}>{warehouse}</MenuItem>
                 )}
                </Select>
              </FormControl>

            </Grid>

          
            <Grid item xs={12} md={4} className="flex-Box" sx={{ justifyContent: "end" }}  >
              
              <Button
                
                onClick={() => searchProduction(attributeSearch)}
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

            <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "end" }}>
            {props.deliveryId?
                !props.file ?
                 <button
                 onClick={() => props.factureDeliveryOrder()}
                 className="btn- bg-primary py-2 px-3 rounded-lg" style={{color:"#000"}}
               >
                 Bon de Livraison
               </button>:
                <button
                onClick={() => props.getFileName(props.file)}
                className="btn- bg-primary py-2 px-3 rounded-lg" style={{color:"#000"}}
              >
                Bon de Livraison
              </button>:null
            }
            </Grid>

          

          </Grid>

       <TableContainer>
        <Table aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Code à barres Element</TableCell>
              <TableCell align="left">Produit</TableCell>
              <TableCell align="left">Quantité disponible</TableCell>
              <TableCell align="left"> Date d'insertion</TableCell>
              <TableCell align="left">Entrepôt</TableCell>
              <TableCell align="left">status livraison</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           { console.log(productions)}

          {productions&& productions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((production,key)=>(
            <TableRow key={key}>
              <TableCell align="left">{generateCode(production.id)}</TableCell>
              <TableCell align="left">{production.finalProduct.name}</TableCell>
              <TableCell align="left">{production.value} {production.finalProduct.unit.unit}</TableCell>
              <TableCell align="left">{moment(production.createdAt).format('DD/MM/YYYY')}</TableCell>
              <TableCell align="left">{production.warehouse && production.warehouse.name}</TableCell>
              <TableCell align="left">{}
              {production.statusDelivery==="LIVRÉE"? <span className='used-element'>LIVRÉE</span>:<span className='not-used-element'>NON LIVRÉE</span>}</TableCell>

            </TableRow>
          ))}

          </TableBody>
        </Table>
      </TableContainer>  
      <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={productions&&productions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />   
          </Paper>
    </>
  )
}

export default ProductionForDelivery