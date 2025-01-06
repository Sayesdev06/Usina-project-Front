import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { DeleteOutline } from 'mdi-material-ui'


function RecapSellOrder(props) {

    const {source,arrayAllProductOrdered,tvaPercentage,discounts,profit,totalHt,totalTTC} = props

  return (
    <>
    {console.log(props)}
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
                    <TableRow key={index}>

                      <TableCell sx={{ color: "#3a3541ad" }}>{row.name} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.quantity} {row.unit.unit}</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellPriceHT} TND</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {row.sellOrderFinalProducts.quantity} </TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> {(row.sellOrderFinalProducts.quantity*row.sellPriceHT).toFixed(2)} TND</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}> 
                      {((row.sellOrderFinalProducts.quantity * row.sellPriceHT) + ((row.sellOrderFinalProducts.quantity * row.sellPriceHT)*tvaPercentage/100)).toFixed(2)} TND
                      </TableCell>
                     

                      {source === 'update'&&<TableCell sx={{ color: "#3a3541ad" }} >
                        <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 , color:"red"}} onClick={() => props.handleDeleteProduct(row)} />
                      </TableCell>}
                    </TableRow>
                  )
                })}

{totalHt >0 ?


<TableRow>

<TableCell sx={{ color: "#3a3541ad" }}></TableCell>
<TableCell sx={{ color: "#3a3541ad" }}></TableCell>
<TableCell sx={{ color: "#3a3541ad" }}></TableCell>
<TableCell sx={{ color: "#3a3541ad" }}></TableCell>
<TableCell sx={{ color: "#3a3541ad" }}>Prix total HT</TableCell>
<TableCell sx={{ color: "#3a3541ad" }}>{totalHt.toFixed(2)} TND</TableCell>
</TableRow>:null}
                

{tvaPercentage && tvaPercentage>0 ?
                       <TableRow>

                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>TVA({tvaPercentage}%)</TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>{((totalHt*tvaPercentage)/100).toFixed(2)} TND</TableCell>
                       </TableRow>:null
                }

               

                {totalTTC && totalTTC >0 ?


                <TableRow>

                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>Prix total TTC</TableCell>
                <TableCell sx={{ color: "#3a3541ad" }}>{totalTTC.toFixed(2)} TND</TableCell>
                </TableRow>:null}


                {discounts && discounts>0 && totalTTC >0 ? 
                       <TableRow>

                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>Remises ({discounts}%)</TableCell>
                       {/* <TableCell sx={{ color: "#3a3541ad" }}>{totalHtWithDiscount.toFixed(2)}</TableCell> */}
                       <TableCell sx={{ color: "#3a3541ad" }}>{((totalTTC*discounts)/100).toFixed(2)} TND</TableCell>
                       </TableRow>:null
                }

                
              {discounts && discounts>0 && totalTTC>0 ? 
                       <TableRow>

                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>Total a payer</TableCell>
                       {/* <TableCell sx={{ color: "#3a3541ad" }}>{totalHtWithDiscount.toFixed(2)}</TableCell> */}
                       <TableCell sx={{ color: "#3a3541ad" }}>{(totalTTC-((totalTTC*discounts)/100)).toFixed(2)}  TND</TableCell>
                       </TableRow>:
                       totalTTC >0 ?
                      <TableRow>
                      <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>Total a payer</TableCell>
                      <TableCell sx={{ color: "#3a3541ad" }}>{totalTTC.toFixed(2)} TND</TableCell>
                      </TableRow>:null}


            {profit?
                       <TableRow>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}></TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>Gain</TableCell>
                       <TableCell sx={{ color: "#3a3541ad" }}>{profit.toFixed(2)} TND</TableCell>
                       </TableRow>:null}
                

               
              </TableBody>
            </Table>
          </TableContainer>
    </>
  )
}

export default RecapSellOrder