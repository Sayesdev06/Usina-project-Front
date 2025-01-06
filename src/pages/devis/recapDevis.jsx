import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, Checkbox, } from '@mui/material';

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

// import icons

import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline';
import { Reload, Magnify, EyeOutline, DeleteOutline } from 'mdi-material-ui';
import { useSnackbar } from 'notistack';

import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import moment from 'moment';
import InputDate from '../../components/shared/InputDate';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';

function RecapDevis(props) {

    const {source,arrayAllProductOrdered,tvaPercentage,discounts} = props

    const [totalHt,setTotalHt] = useState(0)
    const [totalTtc,setTotalTtc] = useState(0)
    const [totalTTCWithDiscount, setTotalTTCWithDiscount] = useState(0);
    const [totalHtWithDiscount, setTotalHtWithDiscount] = useState(0);

    useEffect(()=>{
        if(arrayAllProductOrdered && tvaPercentage){
            calculateTotalHt()
            calculateTotalTtc()
        }
    },[arrayAllProductOrdered,tvaPercentage,discounts])

    const calculateTotalHt = () => {
        let total = 0;
        for (let i = 0; i < arrayAllProductOrdered.length; i++) {
          const row = arrayAllProductOrdered[i];
          total += row.devisFinalProducts.quantity * row.sellPriceHT;
        }
        setTotalHt(total)

        if(discounts>0){
          let discountDecimal = discounts / 100;
    
    
          let discountAmount = total * discountDecimal;
          let newTotalPrice = total - discountAmount;
          setTotalHtWithDiscount(newTotalPrice);
        }
    
        //props.handleSetTotalAmount('amountHt',total)
      };

      const calculateTotalTtc = () => {
        let total = 0;
        for (let i = 0; i < arrayAllProductOrdered.length; i++) {
          const row = arrayAllProductOrdered[i];
          total += (row.devisFinalProducts.quantity * row.sellPriceHT) + ((row.devisFinalProducts.quantity * row.sellPriceHT)*tvaPercentage/100);
        }
        setTotalTtc(total)

        if(discounts>0){
          let discountDecimal = discounts / 100;
    
    
          let discountAmount = total * discountDecimal;
          let newTotalPrice = total - discountAmount;
          setTotalTTCWithDiscount(newTotalPrice);
        }
        //props.handleSetTotalAmount('amountTtc',total)
      };

  return (
    <>
     <TableContainer >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead >
                <TableRow >
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Nom </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Quantité disponible </TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Prix de vente HT</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Quantité a produire</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Prix total HT</TableCell>
                  <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Prix total TTC</TableCell>
                  
                  {source === 'update'&&<TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
          
                {arrayAllProductOrdered && arrayAllProductOrdered.map((row,index) => {

                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                      <TableCell sx={{ color: "#3a3541ad" }}>{row.name} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.quantity} {row.unit.unit}</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellPriceHT} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.devisFinalProducts.quantity} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {(row.devisFinalProducts.quantity*row.sellPriceHT).toFixed(2)} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> 
                      {((row.devisFinalProducts.quantity * row.sellPriceHT) + ((row.devisFinalProducts.quantity * row.sellPriceHT)*tvaPercentage/100)).toFixed(2)}
                      </TableCell>
                     

                      {source === 'update'&&<TableCell sx={{ color: "#3a3541ad" }} >
                        <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 , color:"red"}} onClick={() => props.handleDeleteProduct(row)} />
                      </TableCell>}
                    </TableRow>
                  )
                })}

                <TableRow hover role='checkbox' tabIndex={-1} key={9999}>

                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>Total</TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>{totalHt.toFixed(2)}</TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>{totalTtc.toFixed(2)}</TableCell>
                </TableRow>
                
                {discounts && discounts>0 && 
                       <TableRow hover role='checkbox' tabIndex={-1} key={9999}>

                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>Total avec remises</TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>{totalHtWithDiscount.toFixed(2)}</TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>{totalTTCWithDiscount.toFixed(2)}</TableCell>
                       </TableRow>
                }
               
              </TableBody>
            </Table>
          </TableContainer>
    </>
  )
}

export default RecapDevis