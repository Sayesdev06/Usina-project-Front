import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import InventoryIcon from '@mui/icons-material/Inventory';
import Cookies from "js-cookie";

function MenuAnchorExitVoucher(props) {
  const role = Cookies.get("role");

  return (
    <div className='anchor-container'>
        <span className={props.selectedItem === "Bon de srotie commande"?'anchor-element anchor-element-active':'anchor-element '}
         onClick={()=>props.handleSelectedItem("Bon de srotie commande")}>
          <InfoIcon sx={{fontSize:"30px"}}/>
          Bon de srotie commande 
            </span>
            <span className="horizontal-line"></span>
        <span className={props.selectedItem === "Bon de sortie maintenance"?'anchor-element anchor-element-active anchor-line':'anchor-element anchor-line'}
        onClick={()=>props.handleSelectedItem("Bon de sortie maintenance")}>
          <LocalGroceryStoreIcon sx={{fontSize:"30px"}}/>
          Bon de sortie maintenance
            </span>
            <span className="horizontal-line"></span>
        <span className={props.selectedItem === "Bon de transfert"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Bon de transfert")}>
          <InventoryIcon sx={{fontSize:"30px"}}/>
            Bon de transfert
            </span>
    </div>
  )
}

export default MenuAnchorExitVoucher