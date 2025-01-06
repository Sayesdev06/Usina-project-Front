import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { DeleteOutline, PencilOutline } from "mdi-material-ui";
import { useState } from "react";
import * as actionCreator from "../../actions";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function TablePaymentOrder(props) {
  const { totalTTC, arrayPayment, totalTTCWithDiscount } = props;

  const [paymentTodelete, setPaymentTodelete] = useState({});
  const [openModalDeletePayment, setOpenModalDeletePayment] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [amoutPayed, setAmoutPayed] = useState(0);
  const [rest, setRest] = useState(0);

  useEffect(() => {
    let paid = 0;
    for (let index = 0; index < arrayPayment.length; index++) {
      const payment = arrayPayment[index];
      paid += payment.amount;
    }

    let res = totalTTC - amoutPayed;

    setAmoutPayed(paid);
    setRest(res);
  });

  useEffect(() => {
    if (rest === 0) {
      props.setDisablePayment(true);
    } else {
      props.setDisablePayment(false);
    }
  }, [rest]);

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082" + fileUrl, "_blank");
  };

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    return array[array.length - 1];
  };

  const handleDeletePayment = (payment) => {
    setPaymentTodelete(payment);
    setOpenModalDeletePayment(true);
  };

  const handleCloseModalDeletePayment = () => {
    setOpenModalDeletePayment(false);
    setPaymentTodelete({}); //
  };

  const handleConfirmDeletePayment = () => {
    const data = {
      id: paymentTodelete.id,
      orderId: paymentTodelete.orderId ? paymentTodelete.orderId : null,
      sellOrderId: paymentTodelete.sellOrderId
        ? paymentTodelete.sellOrderId
        : null,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    if (paymentTodelete.orderId) {
      dispatch(actionCreator.deletePayment(data));
    } else {
      dispatch(actionCreator.deletePaymentSellOrder(data));
    }
    setOpenModalDeletePayment(false);
    setPaymentTodelete({});
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Type de paiement</TableCell>
              <TableCell align="right">Montant</TableCell>
              <TableCell align="right">Date d'éxecution</TableCell>
              <TableCell align="right">Date d'échéance</TableCell>
              <TableCell align="right">Eupreuve</TableCell>
              <TableCell align="center">Banque</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {arrayPayment &&
              arrayPayment.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell align="right">
                    {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {payment.executionDate
                      ? moment(payment.executionDate).format("DD/MM/YYYY")
                      : payment.createdAt //payment.type === "ESPÈCE"
                      ? moment(payment.createdAt).format("DD/MM/YYYY")
                      : null}
                  </TableCell>
                  <TableCell align="right">
                    {payment.dueDate &&
                      moment(payment.dueDate).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    <span
                      className="pointer"
                      onClick={() => {
                        openFile(payment.file);
                      }}
                    >
                      {payment.file ? getFileName(payment.file) : ""}
                    </span>
                  </TableCell>
                  <TableCell align="center">{payment.bank}</TableCell>
                  <TableCell align="center " sx={{ color: "#3a3541ad" }}>
                    <DeleteOutline
                      sx={{
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        ml: 2,
                        color: "red",
                      }}
                      onClick={() => handleDeletePayment(payment)}
                    />
                    <PencilOutline
                      sx={{ fontSize: "1.2rem", cursor: "pointer", ml: 2 }}
                      onClick={() => props.handleUpdatePayment(payment)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell align="left">Total Payé</TableCell>
              <TableCell align="right">{amoutPayed.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Reste</TableCell>
              <TableCell align="right">{rest.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openModalDeletePayment}
        onClose={() => handleCloseModalDeletePayment()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Envoi de commande"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir supprimer cette paiement ?
          </DialogContentText>
        </DialogContent>
        <div className="d-flex justify-content-between p-3">
          <Button
            onClick={() => handleCloseModalDeletePayment()}
            className="red-button"
          >
            Non
          </Button>
          <Button
            onClick={() => handleConfirmDeletePayment()}
            className="green-button"
          >
            Oui
          </Button>
        </div>
      </Dialog>
    </>
  );
}
