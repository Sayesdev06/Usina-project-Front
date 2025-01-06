import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import InventoryIcon from '@mui/icons-material/Inventory';

function MenuAnchorDetailsFinalPorduct(props) {


  return (
    <div className='anchor-container'>
        <span className={props.selectedItem === "Informations Générales"?'anchor-element anchor-element-active':'anchor-element '}
         onClick={()=>props.handleSelectedItem("Informations Générales")}>
          <InfoIcon sx={{fontSize:"30px"}}/>
            Informations Générales
            </span>
          
            <span className="horizontal-line"></span>
        <span className={props.selectedItem === "Stock"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Stock")}>
          <InventoryIcon sx={{fontSize:"30px"}}/>
            Stock
            </span>
    </div>
  )
}

export default MenuAnchorDetailsFinalPorduct