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
  import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
  } from "@mui/material";

  
  import { Box } from "@mui/system";
  import React, { useState, useEffect, useRef } from "react";
  import { connect, useDispatch, useSelector } from "react-redux";
  import * as actionCreator from "../../actions";
  
  import { useSnackbar } from "notistack";

  import { useLocation, useNavigate } from "react-router-dom";


  import CachedIcon from '@mui/icons-material/Cached';
  import moment from "moment";
  
  import Loader from "../../components/loader";

import MenuAnchorInternalOrder from "./MenuAnchorInternalOrder";
import ListFinalProductForInternalOrder from "./ListFinalProductForInternalOrder";
import ProductionList from "../sellOrder/ProductionsList";
import ListElementOfExitVoucher from "../sellOrder/ListElementOfExitVoucher";
  
  
  function CreateInternalOrder(props) {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    let timeoutId;
  
    const [internalOrder, setInternalOrder] = useState({
      activityId: "",
      finalProducts: [],
      pieces:[],
      productions:[]
    });
    const [attributeSearch, setAttributeSearch] = useState({
      categoryId: "",
      name: ""
    })
    const [loading, setLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({});
    const [openModalDeleteOrder, setOpenModalDeleteOrder] = useState(false);
    const [allInputRequired, setAllInputRequired] = useState(false);
    const [productRequired, setProductRequired] = useState(false);
    const [listFinalProduct, setListFinalProduct] = useState([]);

    const [internalOrderId, setInternalOrderId] = useState(null)

    const [selectedItem , setSelectedItem] = useState("Produits")

    const arrayAllCatgories = useSelector((state)=>state.productServices.arrayAllCatgories)

    const finalProducts = useSelector(
      (state) => state.finalProductReducer.finalProducts
    );
    const arrayAllActivity = useSelector(
      (state) => state.productServices.arrayAllActivity
    );

    const internalOrderReducer = useSelector(
      (state) => state.internalOrderReducer.internalOrder
    );

  
  
    useEffect(() => {

      dispatch(actionCreator.emptyStateInternalOrder());

      dispatch(actionCreator.getAllActivity());
      dispatch(actionCreator.getAllCategorys());

      
      
  
      const dataFinalProduct = {
        categoryId: "",
        name: "",
      };
      dispatch(actionCreator.searchFinalProduct(dataFinalProduct));
  
  
    }, []);
  
    useEffect(() => {
      if (
        location.state.internalOrderId &&
        location.state.source !== "add"
      ) {
        setLoading(true);
        setInternalOrderId(location.state.internalOrderId)
        dispatch(actionCreator.getInternalOrderById(location.state.internalOrderId,setLoading));
      }
    }, [location]);

    useEffect(()=>{
      if(finalProducts.length > 0) {
  
        let data = finalProducts.map((item)=>{
          return {...item,isSelected: false }
          })
          setListFinalProduct(data)
      }
    },[finalProducts])

    useEffect(()=>{

      if(internalOrderReducer ) { //&& location.state.source !=="add"
        setInternalOrder({
          activityId: internalOrderReducer.activityId,
          finalProducts: internalOrderReducer.finalProducts,
          pieces:internalOrderReducer.pieces,
          productions:internalOrderReducer.productions
        })
        setInternalOrderId(internalOrderReducer.id)
      }
    },[internalOrderReducer])

    
  
    const handleChangeAttributeSearch = (prop) => (event) => {
      setAttributeSearch({
        ...attributeSearch,
        [prop]: event.target.value,
      });
    };
  
  
    const createInternalOrder = () => {
  
      const selectedFinalProduct =[]
  
      for (let index = 0; index < listFinalProduct.length; index++) {
        if(listFinalProduct[index].isSelected ){
          selectedFinalProduct.push(listFinalProduct[index].id) 
        }
      }
      if (
        internalOrder.activityId !== "" && selectedFinalProduct.length>0) {
        const data = {
          activityId: internalOrder.activityId ,
          finalProductIds: selectedFinalProduct,
          handleClickVariant: (msg, val) => {
            let variant = val;
            enqueueSnackbar(msg, { variant });
            setSelectedItem("Gestion des consommables")
            //navigate("/commande-vente");
            //dispatch(actionCreator.getSellOrderById(internalOrderId));
          },
        };
        dispatch(actionCreator.createInternalOrder(data));
      } else {
        if(internalOrder.activityId === ""){
          setAllInputRequired(true);
        }
       
        if(!selectedFinalProduct.length>0){
          setProductRequired(true)
        }
        setTimeout(() => {
          if(internalOrder.activityId !== ""){
            setAllInputRequired(false);
          }
          if(!selectedFinalProduct.length>0){
            setProductRequired(false)
          }
        }, 3000);
      }
    };
  
    // const handleDeleteProduct = (product) => {
    //   setItemToDelete(product); // set the item to be deleted
    //   setOpenModalDeleteOrder(true); // show the confirmation modal
    // };
  
    const handleCancelDelete = () => {
      setItemToDelete({}); // set the item to be deleted
      setOpenModalDeleteOrder(false); // show the confirmation modal
    };
  
    const handleConfirmDelete = () => {
      const data = {
        id: internalOrderId,
        deleteFinalProductIds: [itemToDelete.id],
        addFinalProductIds: [],
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          dispatch(actionCreator.getInternalOrderById(internalOrderId));
        },
      };
      dispatch(actionCreator.updateFinalProductsForSellOrder(data));
      setItemToDelete({}); // reset itemToDelete state
      setOpenModalDeleteOrder(false); // hide the confirmation modal
    };
  
    // const updateSellOrder = () => {
    //   const data = {
    //     id: internalOrderId,
    //     internalOrder,
    //     handleClickVariant: (msg, val) => {
    //       let variant = val;
    //       enqueueSnackbar(msg, { variant });
    //       //navigate('/produit-fini')
    //       //dispatch(actionCreator.getFinalProductById(location.state.finalProductId))
    //     },
    //   };
    //   dispatch(actionCreator.updateSellOrder(data));
    // };
  
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
  
    const searchFinalProduct = (data) => {
      dispatch(actionCreator.searchFinalProduct(data))
    }
  
  
    const handleClick = (finalProduct) =>{
      const updatedList = listFinalProduct.map((item) => {
        if (item.id === finalProduct.id) {
          return { ...item, isSelected: !item.isSelected };
        }
        return item;
      });
      
      setListFinalProduct(updatedList);
    }

    const handleAddPieceToInternalOrder = (value) => {
      if(value){
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {

        const data = {
          id:value,
          internalOrderId,
          handleClickVariant: (msg, val) => {
            let variant = val;
            enqueueSnackbar(msg, { variant });
            //dispatch(actionCreator.getSellOrderAndPiecesById(location.state.sellOrderId))
          }
        }

        dispatch(actionCreator.addPieceToInternalOrder(data));
      }, 1000);
    }

    }

  
    return (
      <>
      {loading?<Loader/>:
  
      <>
        <Box sx={{ width: "100%" }}>
        <MenuAnchorInternalOrder handleSelectedItem={setSelectedItem} selectedItem={selectedItem} internalOrderId={internalOrderId}
         source={location.state.source} nbPieces={internalOrder.pieces.length}/>
  
          {selectedItem ===  "Produits" &&
          <>
          <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
            Commande Interne
          </Typography>
          <Paper sx={{ width: "100%", p: 2 }}>

            <div className="w-25">
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1}}
              >
                Activite*
              </Typography>
  
              <FormControl fullWidth size="small">
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={internalOrder.activityId}
                  onChange={(e) =>
                    setInternalOrder({ ...internalOrder, activityId: e.target.value })
                  }
                  disabled={location && location.state.source === "details"}
                  // input={<OutlinedInput label="Name" />}
                  //MenuProps={MenuProps}
                >
                  {arrayAllActivity &&
                    arrayAllActivity.map((activity, key) => (
                      <MenuItem
                        key={activity.id}
                        value={activity.id}
                        //style={getStyles(category.name, listCategories, theme)}
                      >
                        {activity.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              </div>
              {allInputRequired   ? (
              <p className="red-color">
                {" "}
               L'activite est obligatoire
              </p>
            ) : null}
          </Paper>

         
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
           
          </Grid>
          {productRequired  ? (
              <p className="red-color">
                {" "}
                Choisissez au moins un produit fini
              </p>
            ) : null}
          <Paper sx={{ width: "100%",mt:2}}>

              <ListFinalProductForInternalOrder
                arrayAllProduct={listFinalProduct}
                source={location.state.source}
                handleClick={handleClick}
              />
  
  </Paper>
  
  
            </>
          
  
            {/* {location && location.state.source === "update" ? (
              <Box sx={{ mt: 2, textAlign: "end" }}>
                <button
                  onClick={() => updateSellOrder()}
                  className="btn- bg-primary py-2 px-3 m-1 rounded-lg"
                >
                  Modifier
                </button>
              </Box>
            ) : null} */}
      
          <Grid item xs={12} md={2} sx={{ textAlign: "end" , mt:2}}>
            {internalOrderId?
                    <button className="btn- bg-primary py-2 px-3 rounded-lg" style={{color:"#000"}} 
                    onClick={()=>setSelectedItem("Gestion de production")}>
                    Suivant
                    </button>
                    
                    :<button className="btn- bg-primary py-2 px-3 rounded-lg" style={{color:"#000"}} 
                    onClick={()=>createInternalOrder()}>
                    Creer
                    </button>}

                  </Grid>
                  </>
          }
             
          {selectedItem ===  "Gestion de production" &&
          <>
            

                <>
              <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
                Productions
              </Typography>
  
            
              <Paper sx={{ width: "100%", p: 2 }} >
                <ProductionList 
                source={location.state.source} 
                arrayProductions={internalOrder.productions} 
                internalOrderId={internalOrderId}
                arrayAllFinalProduct = {internalOrder.finalProducts}
                type="internal"
                />
              </Paper>
              </>
          
              
          </>
          }


{selectedItem ===  "Gestion des consommables" &&
          <>
            

                <>
              <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
              List de element de bon de sortie
              </Typography>
  
            
              <Paper sx={{ width: "100%", p: 2 }} >

              <div className="d-flex align-items-center gap-2 mb-2">
          Element a Ajoutee :
          <TextField
                  type='numbre'
                  size='small'
                  onChange={(e)=>handleAddPieceToInternalOrder(e.target.value)}
                />

          </div>
              <ListElementOfExitVoucher
            productPieces={internalOrder.pieces&&internalOrder.pieces}
            />
              </Paper>
              </>
          
              
          </>
          }

       
        </Box>
        </>}
  
  
  
        <Dialog
          open={openModalDeleteOrder}
          onClose={() => handleCancelDelete()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Suppression Produit"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              êtes-vous sûr de vouloir supprimer cette produit ?
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
    );
  }
  
  export default CreateInternalOrder;
  