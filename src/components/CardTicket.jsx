import React from "react";
import { Link } from "react-router-dom";
import { RiTicketLine, RiMore2Fill, RiAddLine } from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ArticleIcon from '@mui/icons-material/Article';

const CardTicket = (props) => {
  const { ticket, totalTickets, text,sellOrderByProductionStatus,orderBystatusReception,sellorderByStatusProductin,devisBystatus } = props;

  let status = "";
  let textColor = "";

  switch (ticket) {
    case "pending":
      status = "bg-yellow-500/10 text-yellow-500";
      textColor = "text-yellow-500";
      break;
    case "inProcess":
      status = "bg-blue-500/10 text-blue-500";
      textColor = "text-blue-500";
      break;
    case "close":
      status = "bg-green-500/10 text-green-500";
      textColor = "text-green-500";
      break;
    case "total":
      status = "bg-pink-500/10 text-pink-500";
      textColor = "text-pink-500";
      break;
  }

  return (
    <div className="bg-secondary-100 p-3 rounded-xl h-214">
      <div className="flex items-center justify-between mb-4">
        <div className="d-flex items-center gap-5" >
        {sellOrderByProductionStatus && sellOrderByProductionStatus.length > 0&&
          <ShoppingCartIcon className={`text-4xl ${status} p-2 box-content rounded-xl mr-2 font-size-50`}/>}
          {orderBystatusReception && orderBystatusReception.length > 0 &&
          <ShoppingBasketIcon className={`text-4xl ${status} p-2 box-content rounded-xl mr-2 font-size-50`}/>}
          {sellorderByStatusProductin &&
          <ArticleIcon className={`text-4xl ${status} p-2 box-content rounded-xl mr-2 font-size-50`}/>}
            {devisBystatus &&
          <ArticleIcon className={`text-4xl ${status} p-2 box-content rounded-xl mr-2 font-size-50`}/>}
          <div className="ticket-titel">
          <p className={textColor}>{text}</p>
          <h1 className="text-4xl text-white font-bold mb-4">{totalTickets}</h1>
          </div>
        </div>
       
      </div>
      {/* Number of tickets */}
      <hr className="border border-dashed border-gray-500/50 my-4" />
      
      {sellOrderByProductionStatus && sellOrderByProductionStatus.length > 0 &&sellOrderByProductionStatus.map((data)=>(
        data.statusProduction !== ""?
        <p className={textColor}>{data.statusProduction} : {data.numOrders}</p>:null
      ))}
      
      {orderBystatusReception && orderBystatusReception.length > 0 &&orderBystatusReception.map((data)=>(
        <p className={textColor}>{data.statusReception ? data.statusReception:"Pas encore reçu"} : {data.numOrders}</p>
      ))}
        {/* {sellorderByStatusProductin &&
        <>
           <p className={textColor}>CRÉER : {sellorderByStatusProductin.CRÉER?sellorderByStatusProductin.CRÉER:0}</p>
          <p className={textColor}>EN COURS DE PRODUCTION : {sellorderByStatusProductin['EN COURS DE PRODUCTION']?sellorderByStatusProductin['EN COURS DE PRODUCTION']:0}</p>
          <p className={textColor}>FINI : {sellorderByStatusProductin.FINI?sellorderByStatusProductin.FINI:0}</p>
        </>
         
        }  */}

{devisBystatus &&devisBystatus.map((data)=>(
        <>
          <p className={textColor}>{data.status} : {data.numDevis}</p>
        </>))
         
        } 
            



      
      {/* <div>
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:underline"
        >
          <RiAddLine /> Agregar nuevo ticket
        </Link>
      </div> */}
    </div>
  );
};

export default CardTicket;
