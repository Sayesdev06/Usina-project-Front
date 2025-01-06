import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from "moment";
import TablePagination from '@mui/material/TablePagination'
import { Reload, Magnify, EyeOutline, DeleteOutline } from 'mdi-material-ui';
import { useNavigate } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';


function ListOrderProduct(props) {
  const productOrders = props.productOrders

  const navigate= useNavigate()

  
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

    const goToOrderDetails = (id) => {
      navigate("/commande-details", {
        state: {
          orderId: id,
        }
      })
    }

    // const goToReception = (id) =>{
    //   navigate("/reception",{
    //     state: {orderId: id,}})
    // }


  return (
    <div>
        <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Montant(TND)</TableCell>
              <TableCell align="left">Date de réception</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productOrders&& productOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order , key)=>(
               <TableRow key={key}>
                <TableCell align="left">{order.id}</TableCell>
                <TableCell align="left">{order.status} / {order.statusPayment} / {order.statusReception}</TableCell>
                <TableCell align="left">{order.amountTtc}</TableCell>
                <TableCell align="left">{moment(order.expectedDateReceipt).format("DD/MM/YYYY")}</TableCell>
                <TableCell align="left">
                  <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToOrderDetails(order.id)} />
                  {/* <Inventory2Icon sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => goToReception(order.id)} /> */}
                </TableCell>
              </TableRow>

            ))}
           

          </TableBody>
        </Table>
      </TableContainer>   
      <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={productOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />   
    </div>
  )
}

export default ListOrderProduct