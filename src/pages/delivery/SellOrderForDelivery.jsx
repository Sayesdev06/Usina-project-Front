import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'
import * as actionCreator from "../../actions";
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, Checkbox, } from '@mui/material';
import { EyeOutline, DeleteOutline } from 'mdi-material-ui';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import CachedIcon from '@mui/icons-material/Cached';
import { useNavigate } from 'react-router-dom';

function SellOrderForDelivery(props) {

  let timeoutId;
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

    // ** States
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [attributeSearch, setAttributeSearch] = useState({
      activityId:"",
      clientId:"",
      statusDelivery:"",
      id:"",
    })

    // ***********************************************************************
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
      setRowsPerPage(+event.target.value)
      setPage(0)
    }

      /****************************************** */
  const handleChangeAttributeSearch = prop => event => {
    setAttributeSearch({ ...attributeSearch, [prop]: event.target.value })
  }

  const onReload = ( ) =>{
    const data={
      activityId:"",
      clientId:"",
      statusDelivery:"",
      id:"",
    }
    setAttributeSearch(
      {
        activityId:"",
        clientId:"",
        statusDelivery:"",
        id:"",
      }
    )
    props.searchSellOrderForDelivery(data)
  }




  return (

<>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container sx={{ p: 2 }} spacing={4}>

          <Grid item xs={12} md={2}>
          <FormControl fullWidth size='small'>
                <TextField
                placeholder='ID Commande'
                size='small'
                value={attributeSearch.id}
                onChange={(e)=>setAttributeSearch({...attributeSearch, id:e.target.value })}
              />
                    
              </FormControl>
              </Grid>

          <Grid item xs={12} md={2}>
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">Clients</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.clientId}
                  label="Clients"
                  onChange={handleChangeAttributeSearch("clientId")}
                >
                  {props.arrayAllClient && props.arrayAllClient.map((client, key) =>
                    <MenuItem value={client.id} key={key} >{client.fullname}</MenuItem>
                  )}
                </Select>
              </FormControl>

            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">Activities</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.activityId}
                  label="Activities"
                  onChange={handleChangeAttributeSearch("activityId")}
                >
                  {props.arrayAllActivity && props.arrayAllActivity.map((activity, key) =>
                    <MenuItem value={activity.id} key={key} >{activity.name}</MenuItem>
                  )}
                </Select>
              </FormControl>

            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Statut livraison</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attributeSearch.statusDelivery}
                  label="Statut livraison"
                  onChange={handleChangeAttributeSearch("statusDelivery")}
                >
                  {/* <MenuItem value="LIVRÉE TOTALEMENT" key={1}>
                    LIVRÉE TOTALEMENT
                  </MenuItem> */}

                  <MenuItem value="LIVRÉE PARTIELLEMENT" key={2}>
                    LIVRÉE PARTIELLEMENT
                  </MenuItem>
                    
                  <MenuItem value="NON LIVRÉE" key={3}>
                    NON LIVRÉE
                  </MenuItem>
                    
                  {/* <MenuItem value="RÉCEPTIONNÉ" key={4}>
                    RÉCEPTIONNÉ
                  </MenuItem> */}

                </Select>
              </FormControl>
            </Grid>
            
           
            <Grid item xs={12} md={4} className="flex-Box" sx={{ justifyContent: "end" }}  >
              
              <Button
                
                onClick={() => props.searchSellOrderForDelivery(attributeSearch)}
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

      <Grid container sx={{ mt: 1 }} >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead >
                <TableRow >
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Id </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Client </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Activite </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Statut Livraison</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.sellOrders && props.sellOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>
                      <Checkbox
                        onClick={() => props.handleClick(row)}
                        color="primary"
                        //checked={row.isSelected}
                      />
                        # {row.id}
                      </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.client && row.client.fullname}   </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.activity.name}   </TableCell>
                     
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.statusDelivery} </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component='div'
            count={props.sellOrders && props.sellOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>

    </>
    

  )
  
}


export default SellOrderForDelivery