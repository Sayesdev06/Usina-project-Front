import { BrowserRouter, Routes, Route, } from "react-router-dom";
// Layouts
//import LayoutAuth from "./layouts/LayoutAuth";
import LayoutAdmin from "./layouts/LayoutAdmin";
// Pages auth
import Login from "./pages/auth/Login";
//import Register from "./pages/auth/Register";
//import ForgetPassword from "./pages/auth/ForgetPassword";
// Pages admin
import Home from "./pages/admin/Home";
import Error404 from "./pages/Error404";
import SetupCompany from "./pages/Setup/SetupCompany";
import Tva from "./pages/Setup/Tva";
import Users from "./pages/Setup/Users";
import ClientAccount from "./pages/Tiers/ClientsAccount";
import ProvidersAccount from "./pages/Tiers/ProvidersAccount";

import { connect } from "react-redux";
//import * as actionCreator from "./actions";
//import { useEffect } from "react";
import PrivateRoutes from "./PrivateRoutes";
//import { useState } from "react";
import Cookies from "js-cookie";
import Enterpot from "./pages/enterpot/Enterpot";
import Categories from "./pages/products/Categories";
import Products from "./pages/products/Products";
import Activities from "./pages/activities/Activities";
//import { Comma } from "mdi-material-ui";
import Commandes from "./pages/Achat/Commandes";
import AddCommande from "./pages/Achat/AddCommande";
import CommandeDetails from "./pages/Achat/CommandeDetails";
//import Reception from "./pages/Achat/Reception";
import ProductDetails from "./pages/products/ProductDetails";
import FinalProduct from "./pages/finalProduct/finalProduct";
import CreateFinalProduct from "./pages/finalProduct/createFInalProduct";
import SellOrder from "./pages/sellOrder/sellOrder"
import CreateSellOrder from "./pages/sellOrder/createSellOrder"
import Payments from "./pages/payment/payments";
import OrderPayments from "./pages/payment/orderPayments";
import withAuthorization from './withAuthorization';
import Devis from "./pages/devis/Devis";
import CreateDevis from "./pages/devis/createDevis";
import ExitVoucher from "./pages/exitVoucher/ExitVoucher";
import ElementSellOrderDetails from "./pages/sellOrder/ElementSellOrderDetails";
import OrderFactures from "./pages/facture/OrderFactures";
import ListDirectSellOrder from "./pages/directSellOrder/ListDirectSellOrder";
import InternalOrders from "./pages/internalOrder/InternalOrders";
import CreateInternalOrder from "./pages/internalOrder/CreateInternalOrder";
import ListDelivery from "./pages/delivery/ListDelivery";
import CreateDelivery from "./pages/delivery/CreateDelivery";
import AddMaintenance from "./pages/exitVoucher/AddMaintenance";
import SellOrderFactures from "./pages/facture/SellOrderFactures";


function App() {

  return (
    <>
  
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login jwt={Cookies.get('token')} />} />
          {/* <Route path="/registre" element={<Register />} /> */}
          {/* <Route path="/olvide-password" element={<ForgetPassword />} /> */}
          <Route path="/" element={
            <PrivateRoutes jwt={Cookies.get('token')}  >
              <LayoutAdmin />
            </PrivateRoutes>}>

            <Route index element={<Home />} />
           
            <Route path="configuration-Societe" element={
              withAuthorization(SetupCompany, ['ADMIN'])
            } 
            />
            <Route path="tva" element={
            withAuthorization(Tva, ['ADMIN'])} 
            />
            <Route path="gestion-des-utilisateurs" element={
            withAuthorization(Users, ['ADMIN'])}
            />
            <Route path="comptes-Clients" element={
              withAuthorization(ClientAccount, ['ADMIN',"COMMERCIALE"])} 
              />
            <Route path="comptes-fournisseurs" element={
            withAuthorization(ProvidersAccount, ['ADMIN',"COMMERCIALE"])} 
            />
            <Route path="gestion-des-entrepots" element={
            withAuthorization(Enterpot, ['ADMIN','MAGASINIER'])} 
            />
            <Route path="categories-des-produits" element={
              withAuthorization(Categories, ['ADMIN','MAGASINIER'])

            } />
              <Route path="gestion-des-produits" element={
              withAuthorization(Products, ['ADMIN','MAGASINIER'])} 
              />
               <Route path="details-produit" element={
              withAuthorization(ProductDetails, ['ADMIN',"MAGASINIER"])
            } />
              <Route path="list-bon-de-sortie-stock" element={
              withAuthorization(ExitVoucher, ['ADMIN',"MAGASINIER"])
            } />


          
             <Route path="add-maintenance" element={
              withAuthorization(AddMaintenance, ['ADMIN'])
            } />
             <Route path="element-commande-de-vente-details" element={
              withAuthorization(ElementSellOrderDetails, ['ADMIN',"MAGASINIER"])
            } />
          
              <Route path="commande-interne" element={
              withAuthorization(InternalOrders, ['ADMIN'])} 
              />

              <Route path="livraison" element={
              withAuthorization(ListDelivery, ['ADMIN'])} 
              />  
               <Route path="add-livraison" element={
              withAuthorization(CreateDelivery, ['ADMIN'])} 
              />  

               <Route path="add-commande-interne" element={
              withAuthorization(CreateInternalOrder, ['ADMIN','COMMERCIALE' ])} 
              />
            <Route path="gestion-des-activités" element={
              withAuthorization(Activities, ['ADMIN'])
            } />
            <Route path="commandes" element={
              withAuthorization(Commandes, ['ADMIN','COMMERCIALE' ,"MAGASINIER" ])
            } />
             <Route path="factures-commande-achat" element={
              withAuthorization(OrderFactures, ['ADMIN' , 'COMPTABLE'])
            } />
             <Route path="commandes-direct" element={
              withAuthorization(ListDirectSellOrder, ['ADMIN','COMMERCIALE' ])
            } />
            <Route path="add-commande" element={
              withAuthorization(AddCommande, ['ADMIN','COMMERCIALE',"MAGASINIER"])
            } />
            <Route path="commande-details" element={
              withAuthorization(CommandeDetails, ['ADMIN','COMMERCIALE' ,"MAGASINIER"])
            } />
            {/* <Route path="reception" element={
              withAuthorization(Reception, ['ADMIN'])
            } /> */}
           
            <Route path="produit-fini" element={
              withAuthorization(FinalProduct, ['ADMIN','COMMERCIALE',"MAGASINIER"])
            } />
            <Route path="add-produit-fini" element={
              withAuthorization(CreateFinalProduct, ['ADMIN','COMMERCIALE',"MAGASINIER"])
            } />
            <Route path="commande-vente" element={
              withAuthorization(SellOrder, ['ADMIN','COMMERCIALE','RESPONSABLE DE PRODUCTION'])
            } />
             <Route path="factures-commande-vente" element={
              withAuthorization(SellOrderFactures, ['ADMIN', 'COMPTABLE'])
            } />
            <Route path="add-commande-vente" element={
              withAuthorization(CreateSellOrder, ['ADMIN','COMMERCIALE','RESPONSABLE DE PRODUCTION'])
            } />
            <Route path="paiements" element={
              withAuthorization(Payments, ['ADMIN', 'COMPTABLE'])
            } />
            <Route path="paiement-commande-achat" element={
              withAuthorization(OrderPayments, ['ADMIN' , 'COMPTABLE'])
            } />
             <Route path="devis" element={
              withAuthorization(Devis, ['ADMIN','COMMERCIALE'])
            } />
            <Route path="add-devis" element={
              withAuthorization(CreateDevis, ['ADMIN','COMMERCIALE'])
            } />
             
            
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const mapStateToProps = (state) => {
  return {

    authSuccess: state.auth.authSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    // getAllOfSampleDetails: (dataEdit) => dispatch(actionCreator.getAllOfSampleDetails(dataEdit)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// how to test if not logged in?

