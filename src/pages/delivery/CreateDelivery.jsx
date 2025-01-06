import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { DeleteOutline } from "mdi-material-ui";
import PencilOutline from "mdi-material-ui/PencilOutline";
import * as actionCreator from "../../actions";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useState } from "react";
import {
  FormControl,
  Grid,
  Paper,
  Select,
  TextField,
  MenuItem,
  Button,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogContentText,
  InputLabel,
} from "@mui/material";
import ProductionForDelivery from "./ProductionForDelivery";
import SellOrderForDelivery from "./SellOrderForDelivery";
import { useLocation } from "react-router-dom";
import MenuAnchorDelivery from "./MenuAnchorDelivery";

function CreateDelivery() {
  let timeoutId;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const [allInputRequired, setAllInputRequired] = useState(false);
  const [delivery, setDelivery] = useState({
    id: "",
    file: "",
    destination: "",
    sellOrder: "",
    productions: [],
    sellOrderId: "",
    driver: "",
    truckRegistrationNumber: "",
  });
  const [selectedItem, setSelectedItem] = useState("Commande");

  /******************reducer */
  const arrayAllClient = useSelector(
    (state) => state.userServices.arrayAllClient
  );
  const arrayAllActivity = useSelector(
    (state) => state.productServices.arrayAllActivity
  );
  const sellOrders = useSelector((state) => state.sellOrderReducer.sellOrders);
  const deliveryReducer = useSelector(
    (state) => state.sellOrderReducer.delivery
  );

  // const arrayAllUser = useSelector(state =>state.userServices.arrayAllUsers)

  // useEffect(() => {
  //   const data = {
  //     firstName: "",
  //     login: "",
  //     poste: "",
  //     permissionId: ""
  //   }
  //   dispatch(actionCreator.getAllUsers(data))
  // },[])

  useEffect(() => {
    dispatch(actionCreator.emptyStateDelivery());
    if (location.state.deliveryId && location.state.source === "details") {
      getDeliveryById(location.state.deliveryId);
    }
    const dataOrder = {
      clientId: "",
      activityId: "",
      id: "",
      statusDelivery: "",
    };
    searchSellOrderForDelivery(dataOrder);
    const data = {
      fullname: "",
      email: "",
      country: "",
      type: "",
    };
    dispatch(actionCreator.getAllClient(data));
    dispatch(actionCreator.getAllActivity());
  }, []);

  useEffect(() => {
    setDelivery(deliveryReducer);
  }, [deliveryReducer]);

  const searchSellOrderForDelivery = (data) => {
    dispatch(actionCreator.searchSellOrderForDelivery(data));
  };

  const handleClick = (sellOrder) => {
    if (!delivery.id) {
      setDelivery({
        destination: sellOrder.client
          ? sellOrder.client.country +
            "," +
            sellOrder.client.city +
            "," +
            sellOrder.client.address
          : "",
        sellOrder: sellOrder,
        productions: sellOrder.productions,
        sellOrderId: sellOrder.id,
        driver: sellOrder.driver,
        truckRegistrationNumber: sellOrder.truckRegistrationNumber,
      });
    }
  };

  const createDelivery = () => {
    if (delivery.destination && delivery.sellOrderId) {
      const data = {
        destination: delivery.destination,
        sellOrderId: delivery.sellOrderId,
        truckRegistrationNumber: delivery.truckRegistrationNumber,
        driver: delivery.driver,
        delivery,
        setDelivery,
        handleClickVariant: (msg, val) => {
          let variant = val;
          enqueueSnackbar(msg, { variant });
        },
      };

      dispatch(actionCreator.createDelivery(data));
    } else {
      setAllInputRequired(true);
      setTimeout(() => {
        setAllInputRequired(false);
      }, 3000);
    }
  };

  const getDeliveryById = (id) => {
    dispatch(actionCreator.getDeliveryById(id));
  };

  const openFile = (fileUrl) => {
    window.open("http://127.0.0.1:8082/static/file/" + fileUrl, "_blank");
  };

  const factureDeliveryOrder = () => {
    const data = {
      id: delivery.id,
      openFile,
    };
    dispatch(actionCreator.factureDeliveryOrder(data));
  };

  const getFileName = (name) => {
    if (!name) return;
    let array = name.split("/");
    //return array[array.length - 1];
    openFile(array[array.length - 1]);
  };

  const handleSelectedItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      <MenuAnchorDelivery
        handleSelectedItem={handleSelectedItem}
        selectedItem={selectedItem}
        deliveryId={delivery.id}
      />

      {selectedItem === "Commande" && (
        <>
          <Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
            Commandes de vente
          </Typography>
          {location.state.source !== "details" ? (
            <SellOrderForDelivery
              sellOrders={sellOrders}
              arrayAllClient={arrayAllClient}
              arrayAllActivity={arrayAllActivity}
              handleClick={handleClick}
              searchSellOrderForDelivery={searchSellOrderForDelivery}
            />
          ) : (
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#3a3541de",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Id{" "}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#3a3541de",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Client{" "}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#3a3541de",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Activite{" "}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#3a3541de",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Statut Livraison
                    </TableCell>
                    {/* <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Destination</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={delivery.sellOrder.id}
                  >
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      # {delivery.sellOrder.id}
                    </TableCell>
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      {" "}
                      {delivery.sellOrder.client &&
                        delivery.sellOrder.client.fullname}{" "}
                    </TableCell>
                    <TableCell sx={{ color: "#3a3541ad" }}>
                      {" "}
                      {delivery.sellOrder.activity &&
                        delivery.sellOrder.activity.name}{" "}
                    </TableCell>

                    <TableCell sx={{ color: "#3a3541ad" }}>
                      {" "}
                      {delivery.sellOrder.statusDelivery}{" "}
                    </TableCell>
                    {/* <TableCell sx={{ color: "#3a3541ad" }}> {delivery.destination} </TableCell> */}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <div className="d-flex justify-content-end my-5">
            <button
              className="btn- bg-primary py-2 px-3 rounded-lg"
              style={{ color: "#000" }}
              onClick={() => setSelectedItem("Information Géneral")}
            >
              Suivant
            </button>
          </div>
        </>
      )}

      {selectedItem === "Information Géneral" && (
        <>
          <Typography className="color-title" sx={{ fontWeight: "600", mt: 2 }}>
            Information Géneral
          </Typography>
          <Paper sx={{ width: "100%", p: 2 }}>
            <div className="d-flex align-items-center w-50 white-space gap-2">
              <div className="w-30">Destination :</div>
              <FormControl fullWidth size="small">
                <TextField
                  size="small"
                  value={delivery.destination}
                  onChange={(e) =>
                    setDelivery({ ...delivery, destination: e.target.value })
                  }
                  disabled={location.state.source === "details" ? true : false}
                />
              </FormControl>
            </div>

            {/* <div className='d-flex align-items-center w-50 white-space gap-2 py-4'>
                Utilisateur :
              <FormControl fullWidth size="small">
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={delivery.user}
                onChange={(e) =>
                  setDelivery({...delivery,user:e.target.value})
                }
                disabled={location.state.source === "details"?true:false}
              >
                {arrayAllUser &&
                  arrayAllUser.map((user, key) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
              </div> */}

            <div className="d-flex align-items-center w-50 white-space gap-2 py-4">
              <div className="w-30">Chauffeur :</div>
              <FormControl fullWidth size="small">
                <TextField
                  size="small"
                  value={delivery.driver}
                  onChange={(e) =>
                    setDelivery({ ...delivery, driver: e.target.value })
                  }
                  disabled={location.state.source === "details" ? true : false}
                />
              </FormControl>
            </div>

            <div className="d-flex align-items-center w-50 white-space gap-2">
              <div className="w-30">Matricule de camion :</div>
              <FormControl fullWidth size="small">
                <TextField
                  size="small"
                  value={delivery.truckRegistrationNumber}
                  onChange={(e) =>
                    setDelivery({
                      ...delivery,
                      truckRegistrationNumber: e.target.value,
                    })
                  }
                  disabled={location.state.source === "details" ? true : false}
                />
              </FormControl>
            </div>

            {allInputRequired && (
              <p className="red-color">
                La Commande et la Destination sont obligatoire!
              </p>
            )}

            <div className="d-flex justify-content-end gap-3 mt-3">
              {!delivery.id && (
                <button
                  onClick={() => createDelivery()}
                  className="btn- bg-primary py-2 px-3 rounded-lg"
                  style={{ color: "#000" }}
                >
                  Cree
                </button>
              )}
            </div>
          </Paper>

          {delivery.id && (
            <div className="d-flex justify-content-end my-5">
              <button
                className="btn- bg-primary py-2 px-3 rounded-lg"
                style={{ color: "#000" }}
                onClick={() => setSelectedItem("Produits à livrer")}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}

      {selectedItem === "Produits à livrer" && (
        <ProductionForDelivery
          productions={delivery.productions}
          getDeliveryById={getDeliveryById}
          deliveryId={delivery.id}
          file={delivery.file}
          source={location.state.source}
          factureDeliveryOrder={factureDeliveryOrder}
          getFileName={getFileName}
        />
      )}
    </>
  );
}

export default CreateDelivery;
