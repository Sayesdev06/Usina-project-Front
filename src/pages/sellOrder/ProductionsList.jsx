import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, Checkbox, } from '@mui/material';

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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useReactToPrint } from 'react-to-print';
import Cookies from "js-cookie";


function ProductionList(props) {
  const role = Cookies.get("role"); 

    const {arrayProductions,sellOrderId,arrayAllFinalProduct,type,internalOrderId} = props

    const [nbElement,setNbElement] = useState(0)
    const [elementPerPiece,setElementPerPiece] = useState(0)
    const [finalProductId,setFinalProductId] = useState(null)
    const [allInputRequired, setAllInputRequired] = useState(false);
    const [quantityRelaised, setQuantityRelaised] = useState([]);
    const [quantityError, setQuantityError] = useState('');
    const [selectedWareHouse, setSelectedWareHouse] = useState(null);
    const [productionWithData, setProductionWithData] = useState([]);
    const [allArrayProductions, setAllArrayProductions] = useState([]);
    const [openModalAddProduction, setOpenModalAddProduction] = useState(false);
    const [productionType, setProductionType] = useState("");
    const [genratedInputs, setGenratedInputs] = useState([]);
    const [openModalCodabars, setOpenModalCodabars] = useState(false);
    const divRef = useRef(null);
    

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const arrayAllWareHouse = useSelector(
      (state) => state.productServices.arrayAllWareHouse
    );

    const barCodes = useSelector(
      (state) => state.sellOrderReducer.barCodes
    );
 // ***********************************************************************

 useEffect(()=>{
  dispatch(actionCreator.searchEnterpot({ name: "", city: "" }));
 },[])

  useEffect(() =>{
    if(arrayProductions&& arrayProductions.length>0){
     
      const sumByFinalProductId = {};

      for (const obj of arrayProductions) {
        const { finalProductId, value } = obj;
      
        if (finalProductId in sumByFinalProductId) {
          sumByFinalProductId[finalProductId] += value;
        } else {
          sumByFinalProductId[finalProductId] = value;
        }
      }
      
      const result = Object.entries(sumByFinalProductId).map(([finalProductId, valueTotal]) => ({
        finalProductId: Number(finalProductId),
        valueTotal
      }));

      setQuantityRelaised(result)

      setAllArrayProductions(arrayProductions)
    }
  },[arrayProductions])

  useEffect(()=>{

if(type==="sellOrder"){
      if(arrayAllFinalProduct && arrayAllFinalProduct.length > 0){
        let arrayData = arrayAllFinalProduct
        for (let i = 0; i < arrayData.length; i++) {
          arrayData[i].percentege = '0';
          arrayData[i].checked = false;
        }
  
        setProductionWithData(arrayData)
      }
  
      if(arrayAllFinalProduct && arrayAllFinalProduct.length > 0&&
        quantityRelaised && quantityRelaised.length > 0 &&
        productionWithData && productionWithData.length > 0){
          //console.log("first",arrayAllFinalProduct,quantityRelaised)
          
          let newProductionWithData = [...productionWithData]; // Create a copy of the state array
  
        for (let i = 0; i < quantityRelaised.length; i++) {
          const element = quantityRelaised[i];
          let finalProduct = arrayAllFinalProduct.find(obj => obj.id === element.finalProductId);
          let percent = 0
          if(finalProduct){
            percent = (quantityRelaised[i].valueTotal / finalProduct.sellOrderFinalProducts.quantity) * 100;
          }
         
  
          for (let j = 0; j < newProductionWithData.length; j++) {
            if (element.finalProductId === newProductionWithData[j].id) {
              newProductionWithData[j].percentege = percent;
              break; // No need to continue the loop once the object is found and updated
            }
          }
        }
        setProductionWithData(newProductionWithData);  
      }
    
   
    }
  },[arrayAllFinalProduct,quantityRelaised])//productionWithData

  // ***********************************************************************

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // ***********************************************************************

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }



    const addProductionTosellOrder = () =>{
      if(nbElement>0 && finalProductId && selectedWareHouse){

        const pro = arrayAllFinalProduct.filter((item)=>{
          if(item.id === finalProductId){
            return item
          }
        })

        let sum

        if(productionType==="similar"){
          sum = nbElement * elementPerPiece
        }else{
          sum = genratedInputs.reduce((acc, obj) => acc + parseInt(obj.value), 0);
        }
        console.log("pro[0]",pro[0].sellOrderFinalProducts.quantity)
        console.log("sum",sum)
        console.log("quantityRelaised",quantityRelaised)
if(parseFloat(sum)>pro[0].sellOrderFinalProducts.quantity){
  setQuantityError(`Vous avez depassér la quantité nécessaire pour le produit fini : ${pro[0].name}`);
  setTimeout(() => {
    setQuantityError("");
  }, 3000);
  return
}
          for (let index = 0; index < quantityRelaised.length; index++) {
            const item = quantityRelaised[index];
            if(item.finalProductId === finalProductId){
              if(item.valueTotal+parseFloat(sum)>pro[0].sellOrderFinalProducts.quantity){
                setQuantityError(`Vous avez depassér la quantité nécessaire pour le produit fini : ${pro[0].name}`);
                setTimeout(() => {
                  setQuantityError("");
                }, 3000);
                return
              }
            }
            
          }

          let productionData = []

          if(productionType==="similar"){
            for (let i = 0; i < nbElement; i++) {
              productionData.push({ 
                finalProductId,
                warehouseId:selectedWareHouse,
                value:elementPerPiece,
                sellOrderId
               });
            }
          }else{
  
            productionData = genratedInputs.map((item)=>{
              return {
                finalProductId,
                warehouseId:selectedWareHouse,
                value:item.value,
                sellOrderId
              }
              })
          }
          

        const data = {
          sellOrderId,
          finalProductId,
          productionData,
          warehouseId:selectedWareHouse,
          handleClickVariant: (msg, val) => {
            let variant = val;
            setNbElement(0)
            setElementPerPiece(0)
            setGenratedInputs([])
            setFinalProductId(null)
            setOpenModalAddProduction(false)
            setOpenModalCodabars(true)
            enqueueSnackbar(msg, { variant });
           
          },
        };

        dispatch(actionCreator.addProductionTosellOrder(data));
      }
      else {
        setAllInputRequired(true);
        setTimeout(() => {
          setAllInputRequired(false);
        }, 3000);
      }
    }
    
    const addProductionToInternalOrder = () =>{
      if(nbElement>0 && finalProductId && selectedWareHouse){

        // const pro = arrayAllFinalProduct.filter((item)=>{
        //   if(item.id === finalProductId){
        //     return item
        //   }
        // })

        let sum

        if(productionType==="similar"){
          sum = nbElement * elementPerPiece
        }else{
          sum = genratedInputs.reduce((acc, obj) => acc + parseInt(obj.value), 0);
        }


          let productionData = []

          if(productionType==="similar"){
            for (let i = 0; i < nbElement; i++) {
              productionData.push({ 
                finalProductId,
                warehouseId:selectedWareHouse,
                value:elementPerPiece,
                internalOrderId
               });
            }
          }else{
  
            productionData = genratedInputs.map((item)=>{
              return {
                finalProductId,
                warehouseId:selectedWareHouse,
                value:item.value,
                internalOrderId
              }
              })
          }
          

        const data = {
          internalOrderId,
          finalProductId,
          productionData,
          warehouseId:selectedWareHouse,
          handleClickVariant: (msg, val) => {
            let variant = val;
            setNbElement(0)
            setElementPerPiece(0)
            setGenratedInputs([])
            setFinalProductId(null)
            setOpenModalAddProduction(false)
            setOpenModalCodabars(true)
            enqueueSnackbar(msg, { variant });
           
          },
        };
        dispatch(actionCreator.addProductionToInternalOrder(data));
      }
      else {
        setAllInputRequired(true);
        setTimeout(() => {
          setAllInputRequired(false);
        }, 3000);
      }
    }
    const handleFilterfinalProduct = async (finalproduct)=>{
      let newProductionWithData = [...productionWithData]

      let chekedFinalProduct = []

      for (let i = 0; i < newProductionWithData.length; i++) {
        const element = newProductionWithData[i];
        if (element.id === finalproduct.id) {
          newProductionWithData[i].checked = !newProductionWithData[i].checked;
          //break; // No need to continue the loop once the object is found and updated
        }
        if(newProductionWithData[i].checked){
          chekedFinalProduct.push(newProductionWithData[i].id)
        }
      }

      let newAllArrayProductions = arrayProductions.filter(obj => chekedFinalProduct.includes(obj.finalProductId));
     
      setProductionWithData(newProductionWithData);
      setAllArrayProductions(newAllArrayProductions)
    }

    const handleOpenModalProduction = (type) => {
      setOpenModalAddProduction(true);
      setProductionType(type)
    }

    const handleChangeNbElement = (value) => {
      setNbElement(value)
      if(productionType === 'Not similar'){
        let arrayProduction = []
        
        for (let index = 0; index < value; index++) {
          arrayProduction.push({
            finalProductId: finalProductId? finalProductId:"",
            value: 0,
            inputId :index+1,
            warehouseId : selectedWareHouse? selectedWareHouse:"",
            sellOrderId:sellOrderId? sellOrderId:"",
            internalOrderId:internalOrderId? internalOrderId:"",
          });
        }
        setGenratedInputs(arrayProduction)
      }
    }

    const handleGenreatedInputs = (e,inputId) =>{
      const newInputs = [...genratedInputs];
      const index = newInputs.findIndex(input => input.inputId === inputId);
      newInputs[index] = { ...newInputs[index], value:e.target.value };
      setGenratedInputs(newInputs);
    }

    const handleCloseAddProduction = () =>{
      setOpenModalAddProduction(false)
      setGenratedInputs([]);
      setNbElement(0)
    }

    const handlePrint = useReactToPrint({
      content: () => divRef.current,
    });

    function generateCode(id) {
      const code = id.toString().padStart(14, '0'); 
      return code;
    }

  return (
    <>
    <div className='flex-Column gap-3'>
    {role ==="COMMERCIALE"?null:  <div className='d-flex align-items-center gap-2'>
        Type de Production :
    <Button
                            sx={{
                              backgroundColor: "#BDEB00 !important",
                              marginRight: "20px",
                              marginLeft: "20px",
                              color: "#000",
                            }}
                            onClick={() => handleOpenModalProduction("similar")}
                          >
                            Quantités similaires
                          </Button>
                        
                        
                          <Button
                            sx={{
                              backgroundColor: "#9155fd !important",
                              color: "#000",
                            }}
                            onClick={() => handleOpenModalProduction("Not similar")}
                          >
                            Quantités non similaires
                          </Button>
                          </div>
   }
                          <div className='d-flex gap-2 align-items-center'>
    {productionWithData && productionWithData.map((finalProduct,key) =>
    <div className='d-flex align-items-center' key={key}>
       <Checkbox
        color="primary"
        //indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={finalProduct.checked}
        onChange={()=>handleFilterfinalProduct(finalProduct)}
        inputProps={{
          'aria-label': 'select all desserts',
        }}
      />
      <InputLabel id="demo-simple-select-label">{finalProduct.name}{finalProduct&&finalProduct.percentege>0&&"("+finalProduct.percentege.toFixed(2)+"%)"}</InputLabel>
     
    </div>
  
    )}
    </div>

  </div>





     <TableContainer >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead >
                <TableRow >
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Id </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Produit fini </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Valeur </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Entrepot </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Date d'insertion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
               
                   {allArrayProductions && allArrayProductions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {

                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>{generateCode(row.id)} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.finalProduct.name}</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.value}</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.warehouse.name}</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {moment(row.createdAt).format('DD/MM/YYYY')}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={allArrayProductions && allArrayProductions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />


<Dialog
        open={openModalAddProduction}
        onClose={() => handleCloseAddProduction()}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Ajoute production"}</DialogTitle>
        <DialogContent>
<div className='d-flex gap-3'>

<FormControl size='small' sx={{width:"200px"}}>
Nombre des elements
      <TextField
      type='number'
      size='small'
      inputProps={{ min: 0}}
      placeholder='Nom'
      value={nbElement}
      onChange={(e)=>handleChangeNbElement(e.target.value)}
    />
          
    </FormControl>

                {productionType==="similar"?
                <FormControl size='small' sx={{width:"250px"}}>
                Nombre des pieces par element
                  <TextField
                  type='number'
                  size='small'
                  inputProps={{ min: 0}}
                  placeholder='Nom'
                  value={elementPerPiece}
                  onChange={(e)=>setElementPerPiece(e.target.value)}
                />
                </FormControl>
                :null}
    
          
   

    <FormControl size='small' sx={{width:"200px"}}>
    Produit fini
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={finalProductId}
        label="categorie"
        onChange={(e)=>setFinalProductId(e.target.value)}
      >
        {arrayAllFinalProduct && arrayAllFinalProduct.map((finalProduct, key) =>
          <MenuItem value={finalProduct.id} key={key} >{finalProduct.name}</MenuItem>
        )}
      </Select>
    </FormControl>

          <FormControl
            size="small"
            sx={{width:"200px"}}
          >
            Entrepot
            <Select
              defaultValue="Entrepot"
              id="form-layouts-separator-select"
              labelId="form-layouts-separator-select-label"
              onChange={(e) =>
                setSelectedWareHouse(e.target.value)
              }
              value={selectedWareHouse}
            >
              <MenuItem key={"first"} value="Entrepot" disabled>
                Entrepot
              </MenuItem>
              {arrayAllWareHouse &&
                arrayAllWareHouse.map((warehouse) => (
                  <MenuItem
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
       
            </div>

            {allInputRequired ? (
              <p className="red-color">Tous les champs sont obligatoire</p>
            ) : null}

            
  {quantityError ? (
              <p className="red-color">{quantityError}</p>
            ) : null}


          <div className="input-container">
           {genratedInputs&& genratedInputs.map((input, key) =>(
              <div className="flex-column"  key={key}>
                <span >Elément {key+1}: </span>
                <TextField
                  size="small"
                  type= "number"
                  sx={{
                    marginBottom: "15px",
                  }}
                  value={input.value}
                  onChange={(e)=>handleGenreatedInputs(e,input.inputId)}
                />
              </div>

            ))}
            </div>


        </DialogContent>
        <div className="d-flex justify-content-end p-3">
        <button onClick={() => {
          type==="internal"?
          addProductionToInternalOrder()
          :addProductionTosellOrder()
          }} className="btn-with-border flex-Box " style={{ marginLeft: ".5rem" }} >
          <AddCircleOutlineIcon/>
          <Typography>Ajouter</Typography>
        </button>
        </div>
      </Dialog>


      <Dialog
        open={openModalCodabars}
        onClose={() => setOpenModalCodabars(false)}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        Code à barres
        </DialogTitle>
        <DialogContent>
            <div className="codabar-container" ref={divRef}>
              {barCodes&&barCodes.map((imageData, index) => (
                <div className="element-container" key={index}>
                <img key={index} src={imageData.barcodeDataURL} alt={`Image ${index}`} className="divider" width="200px"/>
                <span className="white-space f-12">{imageData.finalProduct} - {imageData.value}({imageData.unit})</span>
                </div>
              ))}
            </div>
      
          </DialogContent>

          <div className="d-flex p-3">
          <Button
            onClick={handlePrint}
            className="green-button"
          >
            Imprimer
          </Button>

        </div>

      </Dialog>





    </>

    
  )
}

export default ProductionList