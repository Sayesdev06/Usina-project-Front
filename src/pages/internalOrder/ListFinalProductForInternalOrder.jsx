import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, Checkbox, } from '@mui/material';

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'




function ListFinalProductForInternalOrder(props) {

    const {arrayAllProduct,source} = props


  return (
    <>
     <TableContainer >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead >
                <TableRow >
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Nom </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Quantité disponible </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Prix de vente HT</TableCell>
                  {source=== 'update' && <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>

              {arrayAllProduct && arrayAllProduct.map((row,index) => 
                <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
        
                  <TableCell sx={{ color: "#3a3541ad" }}>
                  <Checkbox
                        onClick={() => props.handleClick(row)}
                        color="primary"
                        checked={row.isSelected}
                      />
                  </TableCell>
                  <TableCell sx={{ color: "#3a3541ad" }}> {row.name}   </TableCell>
                  <TableCell sx={{ color: "#3a3541ad" }}> {row.quantity} {row.unit.unit}</TableCell>
                  <TableCell sx={{ color: "#3a3541ad" }}> {row.sellPriceHT} </TableCell>
                  </TableRow>
  
                      
              )}

              </TableBody>
            </Table>
          </TableContainer>
    </>
  )
}

export default ListFinalProductForInternalOrder


