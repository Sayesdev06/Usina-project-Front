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
import moment from 'moment';

function ListProductionFinalProduct(props) {
  const productions = props.productions
  const unit = props.unit

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
    // ** States
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [openModalDeleteElement,setOpenModalDeleteElement] = useState(false)
    const [openModalUpdateElement,setOpenModalUpdateElement] = useState(false)
    const [elementSelected, setElementSelected] = useState("")
  
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

    
    const handleConfirmDelete = () => {
      const data = {
        id:elementSelected.id,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          setOpenModalDeleteElement(false)
          props.getfinalProduct()
        }
      }
      dispatch(actionCreator.deleteProduction(data))
    }

    const handleConfirmUpdate = () => {
      const data = {
        id:elementSelected.id,
        value:elementSelected.value,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
          setOpenModalUpdateElement(false)
          props.getfinalProduct()
        }
      }
      dispatch(actionCreator.updateProduction(data))
    }

    
    const goToAddSellOrder = (sellOrderId,source) => {
      navigate("/add-commande-vente",{state:{source,sellOrderId}})
    }

  return (
    <div>
              <TableContainer>
        <Table aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Code à barres Element</TableCell>
              <TableCell align="left">Quantité disponible</TableCell>
              <TableCell align="left"> Date d'insertion</TableCell>
              <TableCell align="left">Entrepôt</TableCell>
              <TableCell align="left">Commande de vente</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          {productions&& productions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((production,key)=>(
            <TableRow key={key}>
              <TableCell align="left">{generateCode(production.id)}</TableCell>
              <TableCell align="left">{production.value} {unit}</TableCell>
              <TableCell align="left">{moment(production.createdAt).format('DD/MM/YYYY')}</TableCell>
              <TableCell align="left">{production.warehouse&&production.warehouse.name}</TableCell>
              <TableCell align="left">
              <a className='a-href' onClick={()=> goToAddSellOrder(production.sellOrderId,"details")}>{production.sellOrderId}</a></TableCell>
              <TableCell sx={{ color: "#3a3541ad" }} >
                        <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} 
                        onClick={()=>{setElementSelected(production);setOpenModalUpdateElement(true)}} />
                        <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 , color:"red"}}
                        onClick={()=>{setElementSelected(production);setOpenModalDeleteElement(true)}}  />
                      </TableCell>
            </TableRow>
          ))}

          </TableBody>
        </Table>
      </TableContainer>  
      <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={productions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />   

          
<Dialog
        open={openModalDeleteElement}
        onClose={() => setOpenModalDeleteElement(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Element"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir supprimer cette Element ?
          </DialogContentText>
        </DialogContent>
        <div className="d-flex justify-content-between p-3">
          <Button
            onClick={() => setOpenModalDeleteElement(false)}
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


      <Dialog
        open={openModalUpdateElement}
        onClose={() => setOpenModalUpdateElement(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Element : {elementSelected && generateCode(elementSelected.id)}</DialogTitle>
        <DialogContent>
         
            Quantite:
              <FormControl fullWidth size='small'>
                <TextField
                size='small'
                value={elementSelected && elementSelected.value}
                onChange={(e)=>setElementSelected({...elementSelected, value:e.target.value })}
              />
                    
              </FormControl>

        
        </DialogContent>
        <div className="d-flex justify-content-end p-3">
          <Button
            onClick={() => handleConfirmUpdate()}
            
            className="green-button"
          >
            Confirmer
          </Button>
        </div>
      </Dialog>

    </div>
  )
}

export default ListProductionFinalProduct