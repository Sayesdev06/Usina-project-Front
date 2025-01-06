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
import { useNavigate } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import CardTicket from '../../components/CardTicket';
import CachedIcon from '@mui/icons-material/Cached';
import Loader from '../../components/loader';


function ListPartUsed(props) {


  const dispatch= useDispatch()

  const { enqueueSnackbar } = useSnackbar();
    // ** States
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [openModalAddElement, setOpenModalAddElement] = useState(false);

      // ***********************************************************************

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // ***********************************************************************

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  let timeoutId;

  const addPieceToMaintenance = (value) => {
    if(value){
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {

      const data = {
        id:value,
        maintenanceId:props.maintenance.id,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          props.getMaintenanceById(props.maintenance.id)
          //dispatch(actionCreator.getSellOrderAndPiecesById(location.state.sellOrderId))
        }
      }

      dispatch(actionCreator.addPieceToMaintenance(data));
    }, 1000);
  }

  }

  function generateCode(id) {
    const code = id.toString().padStart(14, '0'); 
    return code;
  }

  return (
    <>

<Paper sx={{ width: "100%",mt:3}}>

<div className="d-flex align-items-center gap-2 p-2">
          Element a valide :
          <TextField
                  type='numbre'
                  size='small'
                  onChange={(e)=>addPieceToMaintenance(e.target.value)}
                />

          </div>

{/* <Grid
          item
          className="flex-Box"
          sx={{ flex: "1 1 100%",p:1, justifyContent: "space-between" }}
        >
          <div className="d-flex">
            <Typography
              className="color-title"
              sx={{ fontSize: "1.1rem", fontWeight: "600", mr: 3 }}
            >
              Liste des Pièce de rechange
            </Typography>
            <Box className="number-listing">
              {" "}
              <Typography
                className="color-title"
                sx={{ fontSize: "0.85rem", fontWeight: "600" }}
              >
                {" "}
                {props.maintenance.pieces &&props.maintenance.pieces.length} Pièce de rechange
              </Typography>{" "}
              
            </Box>
          </div>
        </Grid> */}

<Table aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Code à barres Element</TableCell>
              <TableCell>Nom de produit</TableCell>
              <TableCell align="left">Quantité</TableCell>
              {/* <TableCell align="left">Statut de réservation</TableCell> */}
              <TableCell align="left">Statut d'utilisation </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          {props.maintenance.pieces&& props.maintenance.pieces.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((piece,key)=>(
            <TableRow key={key}>
              <TableCell align="left">{generateCode(piece.id)}</TableCell>
              <TableCell align="left">{piece.product.name}</TableCell>
              <TableCell align="left">{piece.value}{piece.product.unit.unit}</TableCell>
              {/* <TableCell align="left">{piece.booked?"Réserver":"Non réserver"}</TableCell> */}
              <TableCell align="left">{piece.isUsed? <span className='used-element'>Utilisé</span>:<span className='not-used-element'>Non utilisé</span>}</TableCell>
            </TableRow>
          ))}

          </TableBody>
        </Table>
      <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={props.maintenance.pieces.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />   
        </Paper>


    </>
  )
}

export default ListPartUsed