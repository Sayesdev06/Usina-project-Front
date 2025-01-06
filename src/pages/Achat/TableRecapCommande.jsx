import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PencilOutline } from 'mdi-material-ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const TAX_RATE = 0.07;

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

function priceRow(qty, unitHT) {
    return qty * unitHT;
}

function createRow(desc, qty, unitHT, unitTTC, TotalHT, TotalTTC) {
    const price = priceRow(qty, unitHT);
    return { desc, qty, unitHT, unitTTC, TotalHT, TotalTTC };
}

function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
    createRow('Paperclips (Box)', 100, 1.15, 1.2, 115, 120),
    createRow('Paper (Case)', 10, 45.99, 46.99, 459.9, 469.9),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceSubtotal;

export default function TableRecapCommande(props) {
    
    const { arrayAllProductOrder, totalHt, totalTTC } = props

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableHead>

                    <TableRow>
                        <TableCell>Nom produit</TableCell>
                        <TableCell align="right">Quantité</TableCell>
                        <TableCell align="right">Tva</TableCell>
                        <TableCell align="right">Prix Unitaire HT (TND)</TableCell>
                        <TableCell align="right">Prix Unitaire TTC (TND)</TableCell>
                        <TableCell align="right">Prix Total HT (TND)</TableCell>
                        <TableCell align="right">Prix Total TTC (TND)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {arrayAllProductOrder.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.tva}%</TableCell>

                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.priceTTC}</TableCell>
                            <TableCell align="right">{ccyFormat(row.priceTotalHT)}</TableCell>
                            <TableCell align="right">{ccyFormat(row.priceTotalTTC)}</TableCell>
                            <TableCell align="right">
                                    <DeleteOutlinedIcon className='pointer red-color' onClick={()=>props.handleProductFromRecap(row.id)} />
                                    <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={()=>props.handleUpdateProductFromRecap(row)} />
                                </TableCell>
                            {/* <TableCell align="right">{ccyFormat(row.price)}</TableCell> */}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell rowSpan={4} />
                        <TableCell rowSpan={4} />
                        <TableCell rowSpan={2} />
                        <TableCell rowSpan={2} />
                        <TableCell colSpan={1}>Total </TableCell>
                        <TableCell align="right">{ccyFormat(totalHt)}</TableCell>
                        <TableCell align="right">{ccyFormat(totalTTC)}</TableCell>
                    </TableRow>

                    {/* <TableRow>
                        <TableCell colSpan={1}>Total</TableCell>
                        <TableCell align="right">150002</TableCell>
                        <TableCell align="right">150002</TableCell>
                    </TableRow> */}
                </TableBody>
            </Table>
        </TableContainer>
    );
}