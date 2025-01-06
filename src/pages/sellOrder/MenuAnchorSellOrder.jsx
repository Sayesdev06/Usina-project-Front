import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Cookies from "js-cookie";


function MenuAnchorSellOrder(props) {
  const role = Cookies.get("role"); 
   return (
    <div className="anchor-container">
      <span
        className={
          props.selectedItem === "Informations générales"
            ? "anchor-element anchor-element-active"
            : "anchor-element "
        }
        onClick={() => props.handleSelectedItem("Informations générales")}
      >
        <InfoIcon sx={{ fontSize: "30px" }} />
        Informations générales
      </span>

      {(role ==="RESPONSABLE DE PRODUCTION" || props.source === "details" )? null : props.statusProduction &&
        props.statusProduction === "FINI" ? null : (
        <>
          <span className="horizontal-line"></span>

          <span
            className={
              props.selectedItem === "Produits à commander"
                ? "anchor-element anchor-element-active"
                : "anchor-element"
            }
            onClick={() => props.handleSelectedItem("Produits à commander")}
          >
            <LocalGroceryStoreIcon sx={{ fontSize: "30px" }} />
            Produits à commander
          </span>
        </>
      )}

      {props.sellOrderId && (
        <>
          <span className="horizontal-line"></span>

          <span
            className={
              props.selectedItem === "Recaputilatif"
                ? "anchor-element anchor-element-active"
                : "anchor-element "
            }
            onClick={() => props.handleSelectedItem("Recaputilatif")}
          >
            <InventoryIcon sx={{ fontSize: "30px" }} />
            Recaputilatif
          </span>
        </>
      )}

      {props.sellOrderId ? (
        role ==="RESPONSABLE DE PRODUCTION" ?null:<>
          <span className="horizontal-line"></span>
          <span
            className={
              props.selectedItem === "Paiements"
                ? "anchor-element anchor-element-active"
                : "anchor-element "
            }
            onClick={() => props.handleSelectedItem("Paiements")}
          >
            <MonetizationOnIcon sx={{ fontSize: "30px" }} />
            Paiements
          </span>
        </>
      ) : null}

      {props.sellOrderId &&
        props.statusProduction !== "CRÉER" &&
        props.type !== "direct" && (
          <>
            <span className="horizontal-line"></span>
            <span
              className={
                props.selectedItem === "Gestion de production"
                  ? "anchor-element anchor-element-active"
                  : "anchor-element "
              }
              onClick={() => props.handleSelectedItem("Gestion de production")}
            >
              <WarehouseIcon sx={{ fontSize: "30px" }} />
              Gestion de production
            </span>
          </>
        )}
    </div>
  );
}

export default MenuAnchorSellOrder;
