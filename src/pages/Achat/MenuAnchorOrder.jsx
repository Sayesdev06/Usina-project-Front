import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Cookies from "js-cookie";

function MenuAnchorOrder(props) {
  const role = Cookies.get("role"); 

  return (
    <div className='anchor-container'>

        <span className={props.selectedItem === "Fournisseur"?'anchor-element anchor-element-active':'anchor-element '}
         onClick={()=>props.handleSelectedItem("Fournisseur")}>
          <InfoIcon sx={{fontSize:"30px"}}/>
            Fournisseur
            </span>
            <span className="horizontal-line"></span>

            {props.statusReception && props.statusReception === "REÇU"?null:
            <>

        <span className={props.selectedItem === "Produits à commander"?'anchor-element anchor-element-active':'anchor-element'}
        onClick={()=>props.handleSelectedItem("Produits à commander")}>
          <LocalGroceryStoreIcon sx={{fontSize:"30px"}}/>
            Produits à commander
            </span>
            <span className="horizontal-line">
              </span>
               </>}

        <span className={props.selectedItem === "Recaputilatif"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Recaputilatif")}>
          <InventoryIcon sx={{fontSize:"30px"}}/>
            Recaputilatif
            </span>

        {props.orderId && role !=="MAGASINIER"&&

         <>
            <span className="horizontal-line"></span>
        <span className={props.selectedItem === "Paiements"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Paiements")}>
          <MonetizationOnIcon sx={{fontSize:"30px"}}/>
          Paiements
            </span>
            </>
            }
   

   {props.orderId &&
            <>
            <span className="horizontal-line"></span>
            <span className={props.selectedItem === "Reception"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Reception")}>
          <WarehouseIcon sx={{fontSize:"30px"}}/>
          Reception
            </span>
            </>
              }

    </div>
  )
}

export default MenuAnchorOrder