import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import InventoryIcon from '@mui/icons-material/Inventory';

function MenuAnchorMaintenance(props) {


  return (
    <div className='anchor-container'>
        <span className={props.selectedItem === "Information Géneral"?'anchor-element anchor-element-active':'anchor-element '}
         onClick={()=>props.handleSelectedItem("Information Géneral")}>
          <InfoIcon sx={{fontSize:"30px"}}/>
          Information Géneral 
            </span>
            <span className="horizontal-line"></span>
        <span className={props.selectedItem === "Pièce de rechange"?'anchor-element anchor-element-active anchor-line':'anchor-element anchor-line'}
        onClick={()=>props.handleSelectedItem("Pièce de rechange")}>
          <LocalGroceryStoreIcon sx={{fontSize:"30px"}}/>
          Pièce de rechange
            </span>
          {props.maintenanceId&&
            <>
            <span className="horizontal-line"></span>
        <span className={props.selectedItem === "Pièces a utiliser"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Pièces a utiliser")}>
          <InventoryIcon sx={{fontSize:"30px"}}/>
          Pièces a utiliser
            </span>
            </>
            }
    </div>
  )
}

export default MenuAnchorMaintenance