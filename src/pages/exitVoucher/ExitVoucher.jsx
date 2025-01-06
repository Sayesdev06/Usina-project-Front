

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
import MenuAnchorExitVoucher from '../sellOrder/MenuAnchorExitVoucher';
import ListExitVoucherOrder from './ListExitVoucherOrder';
import ListMaintenance from './ListMaintenance';
import ListTransferPieces from './ListTransferPieces';



//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable


const ExitVoucher = (props) => {

  const [selectedItem , setSelectedItem] = useState("Bon de srotie commande")

  const handleSelectedItem = (item)=>{
    setSelectedItem(item)
  }


  return (
<>
{/* <MenuAnchorExitVoucher handleSelectedItem={handleSelectedItem} selectedItem={selectedItem} />

{selectedItem === "Bon de srotie commande"? */}
<ListExitVoucherOrder/>
{/* // selectedItem === "Bon de sortie maintenance"?
// <ListMaintenance/>:
// <ListTransferPieces/> */}


</>
  )
}

export default ExitVoucher