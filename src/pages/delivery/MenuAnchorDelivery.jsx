import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import InventoryIcon from '@mui/icons-material/Inventory';

function MenuAnchorDelivery(props) {


  return (
    <div className='anchor-container'>
          <span className={props.selectedItem === "Commande"?'anchor-element anchor-element-active anchor-line':'anchor-element anchor-line'}
        onClick={()=>props.handleSelectedItem("Commande")}>
          <LocalGroceryStoreIcon sx={{fontSize:"30px"}}/>
          Commande
            </span>

        <>
            <span className="horizontal-line"></span>
            <span className={props.selectedItem === "Information Géneral"?'anchor-element anchor-element-active':'anchor-element '}
         onClick={()=>props.handleSelectedItem("Information Géneral")}>
          <InfoIcon sx={{fontSize:"30px"}}/>
          Information Géneral 
            </span>
            </>


{props.deliveryId&&


            <>
            <span className="horizontal-line"></span>
            <span className={props.selectedItem === "Produits à livrer"?'anchor-element anchor-element-active':'anchor-element '}
            onClick={()=>props.handleSelectedItem("Produits à livrer")}>
            <InfoIcon sx={{fontSize:"30px"}}/>
            Produits à livrer 
            </span>
            </>
}

    </div>
  )
}

export default MenuAnchorDelivery