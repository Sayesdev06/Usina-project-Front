import * as actionsTypes from "./actionsTypes";
import Url from '../constants/Url';
import axios from 'axios';
import Cookies from "js-cookie";

// Product

export const searchDevis= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchDevis?clientId=${data.clientId}&activityId=${data.activityId}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_DEVIS,
                            payload: response.data
                        })

                        //emptyStateArrayPayment()


                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        // data.handleClickVariant("Commande bien crée!", "success",)
                        // 
                    }
                })
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }
}


export const createDevis= (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.post(`createDevis`,{
                activityId: data.activityId ,
                //quantity:data.quantity ,
                amountHt:data.amountHt ,
                amountTtc:data.amountTtc ,
                clientId:data.clientId ,
                finalProductIds:data.finalProductIds,
                discounts:data.discounts,
                //amountPayed:0
            })
                .then((response) => {
                    if (response.status === 200) {
                    
                        dispatch({ type: actionsTypes.EMPTY_ARRAY_PAYMENT});
                        
                       dispatch({
                            type: actionsTypes.SET_DEVISID,
                            payload: response.data.devisId
                        })

                    data.handleClickVariant("Devis fini bien crée!", "success",)

                    setTimeout(() => {
                        dispatch({ type: actionsTypes.EMPTY_STATE });
                      }, 1000);
                     
                    }

                    getTheDevis(dispatch,response.data.devisId)
                    
                })
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }
}


export const deleteDevis = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.delete(`deleteDevis?id=${data.id}`)
                .then((response) => {
                    data.handleClickVariant("Devis fini supprimé", "success")
                }
                )
                .catch((err) => {

                });
        }
        catch (error) {

            console.error(error);
        }
    }

}


export const getDevisById= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`getDevisById?id=${data}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false)
                        }
                       dispatch({
                            type: actionsTypes.GET_DEVIS,
                            payload: response.data
                        })
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        // data.handleClickVariant("Commande bien crée!", "success",)
                        // emptyStateArrayPayment()

                        //getTheSellOrder(dispatch,response.data.sellOrderId)
                    }
                })
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }
}




export const updateDevis= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`updateDevis?id=${data.id}`,{
                activityId: data.activityId ,
                quantity:data.quantity ,
                amountHt:data.amountHt ,
                amountTtc:data.amountTtc ,
                clientId:data.clientId ,
                // finalProductIds:data.finalProductIds,
                discounts:data.discounts,
                //amountPayed:0
            })
                .then((response) => {
                    if (response.status === 200) {
                    //    dispatch({
                    //         type: actionsTypes.GET_FINALPRODUCT,
                    //         payload: response.data
                    //     })
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        data.handleClickVariant("Mise à jour effectué avec succès", "success",)
                        // emptyStateArrayPayment()
                    }
                })
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }
}


export const updateFinalProductsForDevis= (data) => {

    return async (dispatch) => {
        try {
            console.log(data)
            await Url.Url3.put(`updateFinalProductsForDevis?id=${data.id}`,{
                deleteFinalProductIds:data.deleteFinalProductIds,addFinalProductIds:data.addFinalProductIds
            })
                .then((response) => {
                    if (response.status === 200) {
                    //    dispatch({
                    //         type: actionsTypes.GET_FINALPRODUCT,
                    //         payload: response.data
                    //     })
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        data.handleClickVariant("produit final mis à jour !", "success",)
                        // emptyStateArrayPayment()
                    }
                })
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }
}


const getTheDevis =async (dispatch,id)=>{
    await Url.Url3.get(`getDevisById?id=${id}`).then((response) => {
            dispatch({
                type: actionsTypes.GET_DEVIS,
                payload: response.data
                //payload: { order: response.data }
            })
        }
        )
        .catch((err) => {
    
        });
}


export const sendDevisViaEmail = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.get(`sendDevisViaEmail`,{
                params:{
                    id:data.devisId
                }
            })
                .then((res) => {
                    data.handleClickVariant(`Votre devis "${res.data.orderId}" a été bien envoyé`, "success",)
                    //getTheDevis(dispatch,data.devisId)
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }
}

export const convertDevisToOrder= (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.get(`convertDevisToOrder?id=${data.devisId}`)
                .then((response) => {
                    if (response.status === 200) {
                       data.navigateToSellOrder(response.data.sellOrderId)

                    }
                })
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }
}