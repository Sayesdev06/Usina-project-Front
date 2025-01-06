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
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
  
  import { Box } from "@mui/system";
  import React, { useState, useEffect, useRef } from "react";
  import {useDispatch, useSelector } from "react-redux";
  import * as actionCreator from "../../actions";
  import { useSnackbar } from "notistack";
  import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import ListElementOfExitVoucher from "./ListElementOfExitVoucher";
    
  function ElementSellOrderDetails(props) {
    const toDayDate = new Date()
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const navigate = useNavigate();

    let timeoutId;

    const [loading, setLoading] = useState(false);


    const sellOrder = useSelector(
      (state) => state.sellOrderReducer.sellOrder
    );

    const arrayAllClient = useSelector(
      (state) => state.userServices.arrayAllClient
    );
    const arrayAllActivity = useSelector(
      (state) => state.productServices.arrayAllActivity
    );


    useEffect(() => {
      const dataClinet = {
        fullname: "",
        email: "",
        country: "",
        type: "",
      };
      dispatch(actionCreator.getAllClient(dataClinet));
      dispatch(actionCreator.getAllActivity());
      dispatch(actionCreator.getAllCategorys());
    }, []);
  
    useEffect(() => {
      if (
        location.state &&
        location.state.sellOrderId &&
        location.state.source !== "add"
      ) {
        setLoading(true);
        dispatch(actionCreator.getSellOrderAndPiecesById(location.state.sellOrderId,setLoading));
      }
    }, [location]);

    const handleValidationPieces = (value) => {
      if(value){
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const element = sellOrder.pieces.find(piece => piece.id == value)

        if(!element){
          enqueueSnackbar("L'élément n'existe pas", { variant: "error" });
          return;
        }
        
        const data = {
          id:value,
          handleClickVariant: (msg, val) => {
            let variant = val;
            enqueueSnackbar(msg, { variant });
            dispatch(actionCreator.getSellOrderAndPiecesById(location.state.sellOrderId))
          }
        }

        dispatch(actionCreator.changePieceStatus(data));
      }, 1000);
    }

    }
  
    return (
      <>
      {loading?<Loader/>:
  
      <>
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
            Commande de vente
          </Typography>
          <Paper sx={{ width: "100%", p: 2 }}>
            <div className="sell-order-container">
            <div className="w-50">
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 3 }}
              >
                Activite*
              </Typography>
  
              <FormControl fullWidth size="small">
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={sellOrder.activityId}
                //   onChange={(e) =>
                //     setSellOrder({ ...sellOrder, activityId: e.target.value })
                //   }
                  disabled={true}
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
  
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
              >
                Client*
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={sellOrder.clientId}
                //   onChange={(e) =>
                //     setSellOrder({ ...sellOrder, clientId: e.target.value })
                //   }
                  disabled={true}
                  // input={<OutlinedInput label="Name" />}
                  //MenuProps={MenuProps}
                >
                  {arrayAllClient &&
                    arrayAllClient.map((client, key) => (
                      <MenuItem
                        key={client.id}
                        value={client.id}
                        onClick={()=>setSelectedTva(client.tva)}
                        //style={getStyles(category.name, listCategories, theme)}
                      >
                        {client.fullname}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
              >
                Status Production
              </Typography>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  {/* <InputLabel id="demo-simple-select-label">Status Production</InputLabel> */}
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sellOrder.statusProduction}
                    label="Statut Production"
                    // onChange={handleChangeSellOrder("statusProduction")}
                    disabled={true}
                  >
                    {/* <MenuItem value="" key={0}></MenuItem> */}
                    <MenuItem value="CRÉER" key={1}>
                      CRÉER
                    </MenuItem>
                    <MenuItem value="EN COURS DE PRODUCTION" key={2}>
                      EN COURS DE PRODUCTION
                    </MenuItem>
                    <MenuItem value="FINI" key={3} disabled>
                      FINI
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
           
  
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
              >
                Status de livraison
              </Typography>
  
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  {/* <InputLabel id="demo-simple-select-label"></InputLabel> */}
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sellOrder.statusDelivery}
                    label="Statut Production"
                    //onChange={handleChangeSellOrder("statusDelivery")}
                    disabled={true}
                  >
                    {/* <MenuItem value="" key={0}></MenuItem> */}
  
                    <MenuItem value="LIVRÉE TOTALEMENT" key={1}>
                      LIVRÉE TOTALEMENT
                    </MenuItem>
  
                    {/* {(sellOrder.statusProduction === "EN COURS DE PRODUCTION"|| sellOrder.statusProduction === "FINI")&& */}
                    <MenuItem value="LIVRÉE PARTIELLEMENT" key={2}>
                      LIVRÉE PARTIELLEMENT
                    </MenuItem>
                      
  
                    {/* {(sellOrder.statusProduction === "EN COURS DE PRODUCTION" || sellOrder.statusProduction === "FINI")&& */}
                    <MenuItem value="NON LIVRÉE" key={3}>
                      NON LIVRÉE
                    </MenuItem>
                      
  
                    {/* {sellOrder.statusProduction === "FINI"&& */}
                    <MenuItem value="RÉCEPTIONNÉ" key={4}>
                      RÉCEPTIONNÉ
                    </MenuItem>
  
                  </Select>
                </FormControl>
              </Grid>

            </div>
                
              <div>
                  
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 3 }}
              >
                Date d’entré en prodcution prévus
              </Typography>
  
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                minDate = {toDayDate}
                  inputFormat="YYYY-MM-DD"
                  value={sellOrder.startProductionDate}
                  // onChange={(newValue) => {
                  //   console.log(newValue)
                  // }}
                  renderInput={(params) => <TextField {...params} />}
                  disabled={true}
                />
              </LocalizationProvider>
  
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
              >
                Date Fin de prodcution prévus
              </Typography>
  
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  minDate = {toDayDate}
                  inputFormat="YYYY-MM-DD"
                  value={sellOrder.endProductionDate}
                  // onChange={(newValue) => {
                  //   console.log(newValue)
                  // }}
                  renderInput={(params) => <TextField {...params} />}
                  disabled={true}
                />
              </LocalizationProvider>
  
              <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
              >
                Date de livraison prévus
              </Typography>
  
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                minDate = {toDayDate}
                  inputFormat="YYYY-MM-DD"
                  value={sellOrder.expectedDeliveryDate}
                  // onChange={(newValue) => {
                  //   console.log(newValue)
                  // }}
                  renderInput={(params) => <TextField {...params} />}
                  disabled={true}
                />
              </LocalizationProvider>
  
                           
            <Typography
                className="color-title-1"
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, mt: 1 }}
              >
                Type
              </Typography>
              <FormControl size='small' sx={{width:"200px"}}>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sellOrder.sellOrderType}
                                placeholder=""
                                label="sellOrderType"
                                //onChange={(e)=>setSellOrder({ ...sellOrder, sellOrderType: e.target.value })}
                                disabled={true}
                              >
                                <MenuItem value="LOCAUX">Locaux</MenuItem>
                                <MenuItem value="EXPORTATION">
                                Exportation
                              </MenuItem>
                              </Select>
                            </FormControl>
  
                          </div>
            
            </div>
          </Paper>
          
          
          <Typography sx={{ pt: 2, pb: 1, color: "#000", fontWeight: "600" }}>
           List de element de bon de sortie
          </Typography>
         
          <Paper sx={{ width: "100%", p: 2 }}>
          <div className="d-flex align-items-center gap-2 mb-2">
          Element a valide :
          <TextField
                  type='numbre'
                  size='small'
                  onChange={(e)=>handleValidationPieces(e.target.value)}
                />

          </div>

            <ListElementOfExitVoucher
            productPieces={sellOrder.pieces&&sellOrder.pieces}
            />
            </Paper>
            
        </Box>
        </>} 
      </>
    );
  }
  
  export default ElementSellOrderDetails;
  