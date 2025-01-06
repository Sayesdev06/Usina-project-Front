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
  } from "@mui/material";
  import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
  } from "@mui/material";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
  
  import { Box } from "@mui/system";
  import { Close, InformationVariant, Magnify, Reload } from "mdi-material-ui";
  import React, { useState, useEffect, useRef } from "react";
  import { connect, useDispatch, useSelector } from "react-redux";
  import * as actionCreator from "../../actions";

  import { useSnackbar } from "notistack";
import ListProductForFinalProduct from "./listProductForFinalProduct";
import { useLocation, useNavigate } from "react-router-dom";
import ListProductofFinalProduct from "./listProductofFinalProduct";
import Loader from "../../components/loader";
import MenuAnchorDetailsFinalPorduct from "./MenuAnchorDetailsFinalPorduct";
import ListProductionFinalProduct from "./ListProductionFinalProduct";

function CreateFInalProduct(props) {

  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation()
  const navigate = useNavigate();
  
  const [selectedItem , setSelectedItem] = useState("Informations Générales")
  const [finalProduct , setFinalProduct] = useState({
    name: "",
    categoryId:"",
    unitId:"",
    quantity: 0,
    sellPriceHT: "",
    description : "",
    productIds:[],
    productions:[],
    unit:""
  })
  const [attributeProductSearch, setAttributeProductSearch] = useState({
    name: "",
    categoryId: "",
  })
  const [itemToDelete,setItemToDelete]= useState({})
  const [openModalDeleteOrder,setOpenModalDeleteOrder]= useState(false)
  const [allInputRequired,setAllInputRequired]= useState(false)
  const [loading,setLoading]= useState(false)
  

  
  const arrayAllCatgories = useSelector((state)=>state.productServices.arrayAllCatgories)
  const arrayAllUnits = useSelector((state)=>state.productServices.arrayAllUnits)
  const arrayAllProduct = useSelector((state)=>state.productServices.arrayAllProduct)
  const finalProductData = useSelector((state)=>state.finalProductReducer.finalProduct)

  useEffect(()=>{

      dispatch(actionCreator.getAllCategorys())
      dispatch(actionCreator.getAllUnits())
      searchProduct(attributeProductSearch)
  

  },[])

  useEffect(()=>{
    if(location.state &&location.state.finalProductId && location.state.source !== 'add')
      {
        setLoading(true)
        dispatch(actionCreator.getFinalProductById(location.state.finalProductId,setLoading))
       
      }
  },[location])

  useEffect(()=>{
    if(finalProductData && location.state.source !== 'add')
      {
        setFinalProduct({
          name: finalProductData.name,
          categoryId:finalProductData.categoryId,
          unitId:finalProductData.unitId,
          quantity: finalProductData.quantity,
          sellPriceHT: finalProductData.sellPriceHT,
          description : finalProductData.description,
          productIds:finalProductData.products,
          productions:finalProductData.productions,
          unit:finalProductData.unit
        })
      }
  },[finalProductData])

  function searchProduct(data){
    dispatch(actionCreator.searchProduct(data))
  }

  const handleChangeFinalProduct = (prop) => event => {
    setFinalProduct({ ...finalProduct, [prop]: event.target.value })
  }

  const handleChangeAttributeProductSearch = (prop) => event => {

    setAttributeProductSearch({ ...attributeProductSearch, [prop]: event.target.value })
  }

  const selectProduct = (product) =>{

    if(location.state.source === 'update'){
      const data={
        id:location.state.finalProductId,
        deleteProductIds:[],
        addProductIds:[product.id],
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
        }
      }
      dispatch(actionCreator.updateProductsForFinalProduct(data))
    }else{
      let productIds= finalProduct.productIds

      const index = productIds.findIndex(p => p.id === product.id);
      if (index !== -1) {
        productIds.splice(index, 1);
      } else {
        let data = Object.assign(product, {quantityNeeded:0})
        productIds.push(data);
      }
  
      setFinalProduct({ ...finalProduct, "productIds": productIds })
    }

   

    
  }

  const createFinalProduct = () => {
    if(finalProduct.name!=="" && finalProduct.categoryId!=="" && finalProduct.unitId!=="" &&
       finalProduct.quantity!=="" && finalProduct.sellPriceHT!=="" && finalProduct.description!==""&&finalProduct.productIds.length>0){
        const productIdAndQuantity  = finalProduct.productIds.map((item)=>{
          return {productId: item.id,quantityNeeded: item.quantityNeeded}

        })
        const data ={
          finalProduct,
          productIdAndQuantity,
          handleClickVariant: (msg, val) => {
            let variant = val
            enqueueSnackbar(msg, { variant });
            navigate('/produit-fini')
          }
        }
        dispatch(actionCreator.createFinalProduct(data))
       }
       else {
        setAllInputRequired(true)
        setTimeout(() => {
          setAllInputRequired(false)
        }, 3000);
       }
       
   
  }

  const handleDeleteProduct =(product)=>{
    setItemToDelete(product); // set the item to be deleted
    setOpenModalDeleteOrder(true); // show the confirmation modal
    // const data ={
    //   finalProduct,
    //   handleClickVariant: (msg, val) => {
    //     let variant = val
    //     enqueueSnackbar(msg, { variant });
    //     //navigate('/produit-fini')
    //     dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
    //   }
    // }
    // dispatch(actionCreator.updateProductsForFinalProduct(data))
  }

  const handleCancelDelete = () => {
    setItemToDelete({}); // set the item to be deleted
    setOpenModalDeleteOrder(false); // show the confirmation modal
  };

  const handleConfirmDelete = () => {
    const data={
      id:location.state.finalProductId,
      deleteProductIds:[itemToDelete.id],
      addProductIds:[],
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
      }
    }
    dispatch(actionCreator.updateProductsForFinalProduct(data))
    setItemToDelete({}); // reset itemToDelete state
    setOpenModalDeleteOrder(false); // hide the confirmation modal
  };


  const updateFinalProduct = () => {
    const data ={
      id:location.state.finalProductId,
      finalProduct,
      handleClickVariant: (msg, val) => {
        let variant = val
        enqueueSnackbar(msg, { variant });
        //navigate('/produit-fini')
        //dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
      }
    }
    dispatch(actionCreator.updateFinalProduct(data))
  }

  
  const handleOrderQuantityChange = (e,product) =>{
    const updatedList = finalProduct.productIds.map((item) => {
      if (item.id === product.id) {
        return { ...item, quantityNeeded: e.target.value};
      }
      return item;
    });


    
    setFinalProduct({...finalProduct,'productIds':updatedList});
  }

  const updateQuantityNeeded = (product) =>{
    console.log(product)

    const data={
      finalProductId:product.productFinalProducts.finalProductId,
      productId:product.productFinalProducts.productId,
      quantityNeeded:product.productFinalProducts.quantityNeeded,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
      }
    }

    dispatch(actionCreator.updateQuantityNeeded(data))
  }

  const getfinalProduct = () =>{
    dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
  }


  const handleOrderQuantityChangeInUpdate = (e,product) =>{
    const updatedList = finalProduct.productIds.map((item) => {
      if (item.id === product.id) {
        return { ...item, productFinalProducts: { ...item.productFinalProducts, quantityNeeded: e.target.value } };
      }
      return item;
    });
    
    setFinalProduct({...finalProduct,'productIds':updatedList});
  }

  
  const handleSelectedItem = (item)=>{
    setSelectedItem(item)
  }



  return (
    <>
  {loading?<Loader/>:

  
        <>
        
         <Box sx={{ width: "100%" }}>
          {location.state.source === "details" || location.state.source === "update"?
          <MenuAnchorDetailsFinalPorduct handleSelectedItem={handleSelectedItem} selectedItem={selectedItem}/>
          :null}
          
          {selectedItem === "Informations Générales"&&
          <>
            <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
            Produit final
            </Typography>
            <Paper sx={{ width: '100%',p:2  }}>

            <div className='w-50'>
            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                Nom du produit fini :
            </Typography>
            <TextField
                size='small'
                fullWidth
                value={finalProduct.name}
                onChange={handleChangeFinalProduct('name')}
                disabled={location && location.state.source === "details"}
            />

            {allInputRequired&&!finalProduct.name?
            <p className="red-color">le nom est obligatoire !</p>
            :null}


            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 , mt:3}}>
                Catégorie*
            </Typography>

            <FormControl fullWidth size='small'>

                <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={finalProduct.categoryId}
                onChange={(e)=>setFinalProduct({...finalProduct,'categoryId':e.target.value})}
                disabled={location && location.state.source === "details"}
                // input={<OutlinedInput label="Name" />}
                //MenuProps={MenuProps}
                >
                {arrayAllCatgories&&arrayAllCatgories.map((category, key) => (
                    <MenuItem
                    key={category.id}
                    value={category.id}
                    //style={getStyles(category.name, listCategories, theme)}
                    >
                    {category.name}
                    </MenuItem>
                ))} 
                </Select>
            </FormControl>

            {allInputRequired&&!finalProduct.categoryId?
            <p className="red-color">le categorie est obligatoire!</p>
            :null}




            {/* <TextField
                size='small'
                fullWidth
                value={product.piecesNumber}
                disabled
                //onChange={handleChangeAttributeProduct('piecesNumber')}
            /> */}

                
            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1, mt:3 }}>
                Unité*
            </Typography>
            <FormControl fullWidth size='small'>
            <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                onChange={(e)=>setFinalProduct({...finalProduct,'unitId':e.target.value})}
                value={finalProduct.unitId}
                disabled={location && location.state.source === "details"}
                //onChange={handleChange}
                // input={<OutlinedInput label="Name" />}
                //MenuProps={MenuProps}
                >
                {arrayAllUnits&&arrayAllUnits.map((unit, key) => (
                    <MenuItem
                    key={unit.id}
                    value={unit.id}
                    //style={getStyles(category.name, listCategories, theme)}
                    >
                    {unit.name} ({unit.unit})
                    </MenuItem>
                ))} 
                </Select>
            </FormControl>

            {allInputRequired&&!finalProduct.unitId?
            <p className="red-color">l'unite est obligatoire !</p>
            :null}
{/* 
            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 , mt:3 }}>
            quantité :
            </Typography>
            <TextField
                size='small'
                fullWidth
                type="number"
                value={finalProduct.quantity}
                onChange={handleChangeFinalProduct('quantity')}
                disabled={location && location.state.source === "details"}
            /> */}

            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 , mt:3 }}>
            prix de vente HT :
            </Typography>
            <TextField
                size='small'
                fullWidth
                type="number"
                value={finalProduct.sellPriceHT}
                onChange={handleChangeFinalProduct('sellPriceHT')}
                disabled={location && location.state.source === "details"}
                inputProps={{ min: 0}}
            />

          {allInputRequired&&!finalProduct.sellPriceHT?
            <p className="red-color">le prix de vente est obligatoire !</p>
            :null}

            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1, mt:3 }}>
                Description
            </Typography>
            <TextField
                size='small'
                fullWidth
                multiline
                minRows={3}
                placeholder='Description'
                value={finalProduct.description}
                onChange={handleChangeFinalProduct('description')}
                disabled={location && location.state.source === "details"}
            />
            </div>

            {allInputRequired&&!finalProduct.description?
            <p className="red-color">la description est obligatoire !</p>
            :null}

            {location && location.state.source === "update" ?
              <Box sx={{mt:2, textAlign:'end'}} >
              <button
               onClick={() => updateFinalProduct()}
              className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
              >
              Modifier
             </button>
            

          </Box>
          :null}
           
            

            </Paper>
            


            {/* <Typography sx={{pt:5,pb:1 , color:'#000' , fontWeight:"600",textAlign: "center"}}>Commandes qui contient : </Typography> */}
            {/* <Paper sx={{ width: '100%',p:2  }}>
                <ListOrderProduct productOrders = {productOrders}/>
            </Paper> */}

{location&&location.state.source === 'details'|| location.state.source ==='update'? 
        <Paper sx={{ width: "100%", p: 2 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", pt: 3 }}
          id="product-list"
        >
          <div className="box-icon-info  flex-Box">
            <InformationVariant sx={{ fontSize: "1.3rem" }} />
          </div>
          <Typography className="add-commande-span">
            {" "}
            Composition{" "}
          </Typography>
        </Box>

        <ListProductofFinalProduct
          arrayAllProduct={finalProduct.productIds}
          source={location.state.source}
          handleDeleteProduct={handleDeleteProduct}
          updateQuantityNeeded={updateQuantityNeeded}
          handleOrderQuantityChangeInUpdate={handleOrderQuantityChangeInUpdate}
        />
      </Paper>:null
        }

        {location&&location.state.source === 'add'|| location.state.source ==='update'? 
          <Paper sx={{ width: "100%", p: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", pt: 3 }}
            id="product-list"
          >
            <div className="box-icon-info  flex-Box">
              <InformationVariant sx={{ fontSize: "1.3rem" }} />
            </div>
            <Typography className="add-commande-span">
              {" "}
              Veulliez choisir les produit de composition{" "}
            </Typography>
          </Box>
          <Grid container sx={{ pl: 4, mt: 2 }} spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                fullWidth
                placeholder="Nom"
                value={attributeProductSearch.name}
                onChange={handleChangeAttributeProductSearch("name")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              {/* getAllCategorys */}
              <FormControl size="small" fullWidth>
                <Select
                  defaultValue=""
                  id="form-layouts-separator-select"
                  labelId="form-layouts-separator-select-label"
                  onChange={handleChangeAttributeProductSearch("categoryId")}
                >
                  {arrayAllCatgories && arrayAllCatgories.map((category, key) => (
                    <MenuItem key={key} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} sx={{ textAlign: "end" }}>
              <Button
                
                onClick={() => searchProduct(attributeProductSearch)}
                sx={{ color: "white", backgroundColor: "#9155fd !important" }}
              >
                Chercher
              </Button>
            </Grid>
          </Grid>
                 
          {allInputRequired&&!finalProduct.productIds.length>0?
            <p className="red-color">choisissez au moins 1 produit</p>
            :null}

          <ListProductForFinalProduct
            source={"finalProduct"}
            arrayAllProduct={arrayAllProduct}
            selectProduct={selectProduct}
            handleOrderQuantityChange={handleOrderQuantityChange}
            // openModalAddProductCommande={(details) =>
            //   openModalAddProductCommande(details)
            // }
          />
  {location && location.state.source === "add" ?


  <Box sx={{mt:2, textAlign:'end'}} >
             <button
            onClick={() => createFinalProduct()}
             className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
             >
             Creer
            </button>
        </Box>
          :null}
        </Paper>:null}
        </>}

        {selectedItem === "Stock"&&
        <>
         <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
            Production :
            </Typography>
            <Paper sx={{ width: '100%',p:2  }}>
        <ListProductionFinalProduct productions={finalProduct.productions} unit={finalProduct.unit.unit} getfinalProduct={getfinalProduct}/>
        </Paper>
        </>}

        </Box>
        </>
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

export default CreateFInalProduct