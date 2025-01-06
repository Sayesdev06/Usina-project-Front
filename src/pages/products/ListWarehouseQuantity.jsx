import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination'

function ListWarehouseQuantity(props) {
  const productWarehouses = props.productWarehouses

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
console.log("productWarehouses",productWarehouses)
  return (
    <div>
        <TableContainer>
        <Table aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Entrepot</TableCell>
              <TableCell align="left">Quantite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productWarehouses && productWarehouses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((warehouse,key)=>(
                <TableRow key={key}>
                  <TableCell align="left">{warehouse.warehouse ? warehouse.warehouse.name:null}</TableCell>
                  <TableCell align="left">{warehouse.quantity}</TableCell>
                </TableRow>
            ))}
           

          </TableBody>
        </Table>
      </TableContainer> 
      <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={productWarehouses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />  
    </div>
  )
}

export default ListWarehouseQuantity