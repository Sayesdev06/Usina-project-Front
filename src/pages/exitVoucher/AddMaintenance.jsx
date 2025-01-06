
import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, TextareaAutosize, } from '@mui/material';

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
import { useLocation, useNavigate } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import CardTicket from '../../components/CardTicket';
import CachedIcon from '@mui/icons-material/Cached';
import Loader from '../../components/loader';
import MenuAnchorMaintenance from './MenuAnchorMaintenance';
import MaintenanceGenraleInfo from './MaintenanceGenraleInfo';
import ListSparePart from './ListSparePart';
import ListPartUsed from './ListPartUsed';


function AddMaintenance() {
  const location = useLocation()
  const dispatch= useDispatch()

    const [selectedItem , setSelectedItem] = useState("Information Géneral")
    const [allInputRequired,setAllInputRequired] = useState(false)

    const [maintenance,setMaintenance] = useState({
      id:"",
      machine:"",
      issue:"",
      intervention:"",
      userId:"",
      productIds:[],
      products:[],
      users:[],
      pieces:[],
      file:""
    })

    const { enqueueSnackbar } = useSnackbar();

    const maintenanceReducer = useSelector(state => state.maintenanceReducer.maintenance)

    useEffect(() =>{
      if(location.state.source === "details"){
        handleStateMaintenance("id",location.state.maintenanceId)
        getMaintenanceById(location.state.maintenanceId)
      }
    },[])

    useEffect(()=>{
      if(maintenanceReducer && maintenance.id){
        let produtIds = maintenanceReducer.products.map(p=>p.id)
        setMaintenance({
          id:maintenanceReducer.id,
          machine:maintenanceReducer.machine,
          issue:maintenanceReducer.issue,
          intervention:maintenanceReducer.intervention,
          userId:maintenanceReducer.users[0].id,
          productIds: produtIds,
          pieces:maintenanceReducer.pieces,
          file:maintenanceReducer.file,
        })
      }
    },[maintenanceReducer])

    const getMaintenanceById = (data)=>{
      dispatch(actionCreator.getMaintenanceById(data))
    }

    const handleSelectedItem = (item)=>{
      setSelectedItem(item)
    }

    const handleStateMaintenance = (att,data) =>{
      setMaintenance({...maintenance,[att]:data})
    }

    const createMaintenance = () =>{
      if(maintenance.machine && maintenance.issue && maintenance.productIds.length>0 && maintenance.intervention){

        const data = {
          machine : maintenance.machine,
          issue : maintenance.issue,
          intervention : maintenance.intervention,
          userId : [maintenance.userId],
          productIds : maintenance.productIds,
          handleClickVariant: (msg, val) => {
            let variant = val;
            enqueueSnackbar(msg, { variant });
            
          },
          handleStateMaintenance
        }

        dispatch(actionCreator.createMaintenance(data))

      }else{
        setAllInputRequired(true)
        setTimeout(() => {
          setAllInputRequired(false)
        }, 3000);
      }
    }

    
  
  return (
    <>
    {console.log(maintenance)}
    <MenuAnchorMaintenance handleSelectedItem={handleSelectedItem} selectedItem={selectedItem} maintenanceId={maintenance.id}/>

    {selectedItem === "Information Géneral"?
   <MaintenanceGenraleInfo handleSelectedItem={handleSelectedItem} source={location.state.source}
   handleStateMaintenance={handleStateMaintenance} maintenance={maintenance}/>:
   selectedItem === "Pièce de rechange"?
   <>
    {allInputRequired?
            <p className="red-color mt-2">Tous les champs sont obligatoire</p>
            :null}
   <ListSparePart handleStateMaintenance={handleStateMaintenance} maintenance={maintenance}/>
   <Box sx={{ mt: 2, textAlign: "end" }}>
      {maintenance.id?
             <button
             onClick={() => handleSelectedItem("Pièces a utiliser")}
             className="btn- bg-primary py-2 px-3 rounded-lg" style={{color:"#000"}}
           >
             Suivant
           </button>:
           <button
           onClick={() => createMaintenance()}
           className="btn- bg-primary py-2 px-3 rounded-lg" style={{color:"#000"}}
         >
           Cree
         </button>
             }
             </Box>
   </>:
   <ListPartUsed maintenance={maintenance} getMaintenanceById={getMaintenanceById}/>

  }
    
    </>
  )
}

export default AddMaintenance