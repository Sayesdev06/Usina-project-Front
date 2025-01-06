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
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { Box } from "@mui/system";
import { Close, InformationVariant, Magnify, Reload } from "mdi-material-ui";
import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../actions";
import ListProducts from "../products/ListProducts";
import TablePaymentOrder from "./TablePaymentOrder";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import RecapDetailCommande from "./recapDetailCommande";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import Loader from "../../components/loader";
import Cookies from "js-cookie";

function Reception(props) {
  const role = Cookies.get("role"); 

  const [openModalReception, setOpenModalReception] = useState(false);
  const [loadingBarCodes, setLoadingBarCodes] = useState(false);
  // const [openModalMasse, setOpenModalMasse] = useState(false);
  const [products, setProducts] = useState([]);
  //const [warehouseSelected, setWarehouseSelected] = useState("Entrepot");
  const [productSelected, setProductSelected] = useState({});
  const [receptionType, setReceptionType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    unit: "",
  });
  const [inputnb, setInputnb] = useState(0);
  const [errorInGeneratedInput, setErrorInGeneratedInput] = useState("");
  const [genratedInputs, setGenratedInputs] = useState([]);
  const [nbElement, setNbElement] = useState(0);
  const [openModalCodabars, setOpenModalCodabars] = useState(false);

  const divRef = useRef(null);

  const location = useLocation();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  /************************************************* */
  const order = useSelector((state) => state.order.order);
  const arrayCodabars = useSelector((state) => state.order.arrayCodabars);
  const arrayAllWareHouse = useSelector(
    (state) => state.productServices.arrayAllWareHouse
  );
  const arrayAllUnits = useSelector(
    (state) => state.productServices.arrayAllUnits
  );

  /************************************************* */

  useEffect(() => {
    dispatch(actionCreator.getAllUnits());
    if (props.orderId) {
      dispatch(actionCreator.getOrderById(props.orderId));
      dispatch(actionCreator.searchEnterpot({ name: "", city: "" }));
    }
  }, [location]);

  useEffect(() => {
    if (order) {
      setProductsFromorder();
    }
  }, [order]);

  /******************************************** */

  const handleOpenModalReception = (product, type) => {
    setOpenModalReception(true);
    setReceptionType(type);
    setSelectedProduct({ name: product.name, unit: product.unit });
    if (product) {
      setProductSelected(product);

      if (type === "detailed") {
        //const productData = products.filter(product => (product.productId === productPiece.productId));
        //setNbPiece(nbPieces)
        // let arrayProductPieces = []
        //   for (let index = 0; index < product.value; index++) {
        //     arrayProductPieces.push({
        //       productId: product.productId,
        //       value: 0,
        //       inputId :index+1,
        //       orderId:product.orderId
        //     });
        //   }
        //   setGenratedInputs(arrayProductPieces)
      }
    }
  };

  const handleCloseModalReception = () => {
    setOpenModalReception(false);
    setProductSelected({});
    setReceptionType("");
    setGenratedInputs([]);
    setNbElement(0);
  };

  const handleConfirmReception = () => {
    //const arrayProduct = products.reduce((product,obj) => product.productId === productSelected.productId ? obj={orderId: product.orderId,productId:product.productId,warehouseId:product.warehouseId}:null);

    let arrayProductPieces = [];

    if (!productSelected.warehouseId) {
      setErrorInGeneratedInput("Veuillez choisir un entrepôt");
      return setTimeout(() => {
        setErrorInGeneratedInput("");
      }, 3000);
    }

    if (receptionType === "masse") {
      if (nbElement <= 0) {
        setErrorInGeneratedInput(
          "Le nombre d'éléments doit être supérieur à 0"
        );
        return setTimeout(() => {
          setErrorInGeneratedInput("");
        }, 3000);
      }

      if (!productSelected.value || parseInt(productSelected.value) <= 0) {
        setErrorInGeneratedInput(
          "Le nombre des pieces par élément doit être supérieur à 0"
        );
        return setTimeout(() => {
          setErrorInGeneratedInput("");
        }, 3000);
      }

      if (nbElement * productSelected.value > productSelected.quantity) {
        setErrorInGeneratedInput(
          "La quantite saiser a depasse la quantite commandée"
        );
        return setTimeout(() => {
          setErrorInGeneratedInput("");
        }, 3000);
      }

      for (let index = 0; index < nbElement; index++) {
        arrayProductPieces.push({
          productId: productSelected.productId,
          value: productSelected.value,
          orderId: productSelected.orderId,
        });
      }
    }
    if (receptionType === "detailed") {
      if (!productSelected.value || parseInt(productSelected.value) <= 0) {
        setErrorInGeneratedInput(
          "Le nombre des éléments doit être supérieur à 0"
        );
        return setTimeout(() => {
          setErrorInGeneratedInput("");
        }, 3000);
      }

      const hasZeroValue = genratedInputs.some((obj) =>
        Object.values(obj).includes(0)
      );

      if (hasZeroValue) {
        setErrorInGeneratedInput("Tous les éléments doivent avoir une valeur ");
        return setTimeout(() => {
          setErrorInGeneratedInput("");
        }, 3000);
      }

      const sum = genratedInputs.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.value);
      }, 0);

      if (sum + productSelected.quantityReceived > productSelected.quantity) {
        setErrorInGeneratedInput(
          "La quantite saiser a depasse la quantite commandée"
        );
        return setTimeout(() => {
          setErrorInGeneratedInput("");
        }, 3000);
      }

      arrayProductPieces = genratedInputs;
    }

    const data = {
      productOrderIds: productSelected,
      productPieces: arrayProductPieces,
      orderId: order.id,
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
        setOpenModalCodabars(true);
      },
    };
    setLoadingBarCodes(true);
    dispatch(
      actionCreator.addRecepetionToProductInOrder(data, setLoadingBarCodes)
    );
    setOpenModalReception(false);
    setProductSelected({});
    setReceptionType("");
    setGenratedInputs([]);
    setNbElement(0);
  };

  const handleSelectWarehouse = (warehouse, productId) => {
    const warehouseId = arrayAllWareHouse.filter((entrepot) => {
      return entrepot.name === warehouse;
    });

    //   const newProducts = [...products];
    //   const index = newProducts.findIndex(p => p.productId === productId);
    //   newProducts[index] = { ...newProducts[index], warehouse:warehouse,warehouseId:warehouseId[0].id };

    // setProducts(newProducts)

    const data = {
      ...productSelected,
      warehouse: warehouse,
      warehouseId: warehouseId[0].id,
    };
    setProductSelected(data);
    setInputnb(1);
  };

  // const handleSelectMode = (e) =>{
  //   setReceptionMode(e.target.value)
  //   setProductsFromorder()
  // }

  function setProductsFromorder() {
    const newProductObj = order.products.map((product) => {
      return {
        name: product.name,
        quantity: product.orderProducts.quantity,
        unit: product.unit.unit,
        warehouse: "Entrepot",
        warehouseId: null,
        orderId: order.id,
        productId: product.id,
        value: null,
        quantityReceived: product.orderProducts.quantityReceived,
      };
    });

    setProducts(newProductObj);
  }

  const handleInputProductPackage = (e, productData) => {
    const data = { ...productSelected, value: e.target.value };
    setProductSelected(data);

    if (receptionType === "detailed") {
      let arrayProductPieces = [];

      for (let index = 0; index < e.target.value; index++) {
        arrayProductPieces.push({
          productId: productData.productId,
          value: 0,
          inputId: index + 1,
          orderId: productData.orderId,
        });
      }
      setGenratedInputs(arrayProductPieces);

      const newProducts = [...products];
      const index = newProducts.findIndex(
        (p) => p.productId === productData.productId
      );
      newProducts[index] = {
        ...newProducts[index],
        value: e.target.value,
      };
      setProducts(newProducts);
    }
  };

  const handleGenreatedInputs = (e, inputId) => {
    const newInputs = [...genratedInputs];
    const index = newInputs.findIndex((input) => input.inputId === inputId);
    newInputs[index] = { ...newInputs[index], value: e.target.value };
    setGenratedInputs(newInputs);
  };

  const handlePrint = useReactToPrint({
    content: () => divRef.current,
  });

  const getProductCodeAbars = (product) => {
    setLoadingBarCodes(true);
    dispatch(
      actionCreator.getProductCodeAbars(
        { productId: product.productId, orderId: order.id },
        setLoadingBarCodes
      )
    );
    setOpenModalCodabars(true);
    setSelectedProduct({ name: product.name, unit: product.unit });
  };

  return (
    <div>
      <Paper sx={{ width: "100%", p: 2, mt: 3 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", pt: 1, pl: 1, pb: 2 }}
        >
          <div className="box-icon-info  flex-Box">
            <InformationVariant sx={{ fontSize: "1.3rem" }} />
          </div>
          <Typography className="add-commande-span">
            {" "}
            Récepetion de commande d'achat N° : {order && order.id}
          </Typography>
        </Box>

        <Typography className="add-commande-span pt-5">
          Liset des produits{" "}
        </Typography>
        <div className="table-reception">
          <TableContainer>
            <Table aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Nom produit</TableCell>
                  <TableCell>Quantité commandé</TableCell>
                  <TableCell>Quantité reçu</TableCell>
                  <TableCell>Quantité restante</TableCell>
                  {role ==="COMMERCIALE"?null:<TableCell>Récepetion </TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products &&
                  products.map((product, key) => (
                    <TableRow key={key}>
                      <TableCell align="left">{product.name}</TableCell>
                      <TableCell align="left">
                        {product.quantity} {product.unit}(s)
                      </TableCell>
                      <TableCell align="left">
                        {product.quantityReceived
                          ? product.quantityReceived
                          : 0}{" "}
                        {product.unit}(s)
                      </TableCell>
                      <TableCell align="left">
                        {Number(product.quantity) -
                          Number(product.quantityReceived)}{" "}
                        {product.unit}(s)
                      </TableCell>
                      {product.quantity > product.quantityReceived ? (
                        role ==="COMMERCIALE"?null:
                        <TableCell align="left">
                          <Button
                            sx={{
                              backgroundColor: "#BDEB00 !important",
                              marginRight: "20px",
                              marginLeft: "20px",
                              color: "#000",
                            }}
                            onClick={() =>
                              handleOpenModalReception(product, "masse")
                            }
                          >
                            Réception en masse
                          </Button>

                          <Button
                            sx={{
                              backgroundColor: "#9155fd !important",
                              color: "#000",
                            }}
                            onClick={() =>
                              handleOpenModalReception(product, "detailed")
                            }
                          >
                            Réception détaillé
                          </Button>
                        </TableCell>
                      ) : (
                        <TableCell align="left">Produit reçu</TableCell>
                      )}

                      <TableCell align="left">
                        {product.quantityReceived > 0 ? (
                          <PrintIcon
                            className="pointer"
                            onClick={() => getProductCodeAbars(product)}
                          />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>

      <Dialog
        open={openModalCodabars}
        onClose={() => setOpenModalCodabars(false)}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Code à barres</DialogTitle>
        <DialogContent>
          {loadingBarCodes ? (
            <Loader />
          ) : (
            <div className="codabar-container" ref={divRef}>
              {arrayCodabars &&
                arrayCodabars.map((imageData, index) => (
                  <div className="element-container" key={index}>
                    <img
                      key={index}
                      src={`${imageData.barcodeDataURL}`}
                      alt={`Image ${index}`}
                      className="divider"
                      width="200px"
                    />

                    <span className="white-space f-12">
                      {selectedProduct.name} - {imageData.value}(
                      {selectedProduct.unit})
                    </span>
                  </div>
                ))}
            </div>
          )}
        </DialogContent>
        {loadingBarCodes ? (
          <Loader />
        ) : (
          <div className="d-flex p-3">
            <Button onClick={handlePrint} className="green-button">
              Imprimer
            </Button>
          </div>
        )}
      </Dialog>

      <Dialog
        open={openModalReception}
        onClose={() => handleCloseModalReception()}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmation réception de Produit {productSelected.productId}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Validez vous la réception de{" "}
            <strong>
              {productSelected.quantity} {productSelected.unitSelected}
            </strong>{" "}
            de <strong>{productSelected.name}</strong> dans Entreprot{" "}
            <strong>{productSelected.warehouse}</strong>
          </DialogContentText>

          <div className="d-flex mt-5 mb-4">
            <div className="flex-col">
              Entrepot
              <FormControl size="small" fullWidth sx={{ width: "200px" }}>
                <Select
                  defaultValue="Entrepot"
                  id="form-layouts-separator-select"
                  labelId="form-layouts-separator-select-label"
                  onChange={(e) =>
                    handleSelectWarehouse(
                      e.target.value,
                      productSelected.productId
                    )
                  }
                  value={productSelected.warehouse}
                >
                  <MenuItem key={"first"} value="Entrepot" disabled>
                    Entrepot
                  </MenuItem>
                  {arrayAllWareHouse &&
                    arrayAllWareHouse.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.name}>
                        {warehouse.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>

            {receptionType === "detailed" ? (
              <div className="flex-col">
                Nombre des elements
                <TextField
                  size="small"
                  placeholder="Nombre des elements"
                  type="number"
                  value={productSelected.value}
                  onChange={(e) =>
                    handleInputProductPackage(e, productSelected)
                  }
                />
              </div>
            ) : receptionType === "masse" ? (
              <div className="d-flex">
                <div className="flex-col">
                  Nombre des elements
                  <TextField
                    size="small"
                    placeholder="Nombre des elements"
                    type="number"
                    value={nbElement}
                    onChange={(e) => setNbElement(e.target.value)}
                  />
                </div>

                <div className="flex-col">
                  Nombre des pieces par element
                  <TextField
                    size="small"

                    type="number"
                    value={productSelected.value}
                    onChange={(e) =>
                      handleInputProductPackage(e, productSelected)
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>
          {errorInGeneratedInput && (
            <span className="red-color">{errorInGeneratedInput}</span>
          )}

          <div className="input-container">
            {genratedInputs &&
              genratedInputs.map((input, key) => (
                <div className="flex-column" key={key}>
                  <span>Elément {key + 1}: </span>
                  <TextField
                    size="small"
                    type="number"
                    sx={{
                      marginBottom: "15px",
                    }}
                    value={input.value}
                    onChange={(e) => handleGenreatedInputs(e, input.inputId)}
                  />
                </div>
              ))}
          </div>
        </DialogContent>
        <div className="d-flex justify-content-between p-3">
          <Button
            onClick={() => handleCloseModalReception()}
            className="red-button"
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleConfirmReception()}
            className="green-button"
          >
            Confirmer
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Reception;
