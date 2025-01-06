import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WarehouseIcon from '@mui/icons-material/Warehouse';

function MenuAnchorInternalOrder(props) {
  

  return (
    <div className='anchor-container'>
         
        <span className={props.selectedItem === "Produits"?'anchor-element anchor-element-active':'anchor-element'}
        onClick={()=>props.handleSelectedItem("Produits")}>
          <LocalGroceryStoreIcon sx={{fontSize:"30px"}}/>
            Produits
            </span>

        
        
 
  {props.internalOrderId&&

  
<>

<span className="horizontal-line"></span>
            <span className={props.selectedItem === "Gestion des consommables"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Gestion des consommables")}>
          <WarehouseIcon sx={{fontSize:"30px"}}/>
          Gestion des consommables
            </span>

            {props.nbPieces > 0 &&
            <>
            <span className="horizontal-line"></span>
            <span className={props.selectedItem === "Gestion de production"?'anchor-element anchor-element-active':'anchor-element '}
        onClick={()=>props.handleSelectedItem("Gestion de production")}>
          <WarehouseIcon sx={{fontSize:"30px"}}/>
          Gestion de production 
            </span>
            </>}
           </>}

    </div>
  )
}

export default MenuAnchorInternalOrder