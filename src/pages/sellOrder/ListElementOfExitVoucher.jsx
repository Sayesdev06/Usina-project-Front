import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'
import { useNavigate } from 'react-router-dom';
import { DeleteOutline, Grid } from 'mdi-material-ui';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import {Button,TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import * as actionCreator from "../../actions";

function ListElementOfExitVoucher(props) {
  const productPieces = props.productPieces

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
    // ** States
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

  
  
    // ***********************************************************************
  
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

    

  return (
    <>
              <TableContainer>
        <Table aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Code à barres Element</TableCell>
              <TableCell>Nom de produit</TableCell>
              <TableCell align="left">Quantité</TableCell>
              <TableCell align="left">Statut de réservation</TableCell>
              <TableCell align="left">Statut d'utilisation </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          {productPieces&& productPieces.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((piece,key)=>(
            <TableRow key={key}>
              <TableCell align="left">{generateCode(piece.id)}</TableCell>
              <TableCell align="left">{piece.product.name}</TableCell>
              <TableCell align="left">{piece.value}{piece.product.unit.unit}</TableCell>
              <TableCell align="left">{piece.booked?"Réserver":"Non réserver"}</TableCell>
              <TableCell align="left">{piece.isUsed? <span className='used-element'>Utilisé</span>:<span className='not-used-element'>Non utilisé 2</span>}</TableCell>
            </TableRow>
          ))}

          </TableBody>
        </Table>
      </TableContainer>  
      <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={productPieces&&productPieces.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />   


    </>
  )
}

export default ListElementOfExitVoucher