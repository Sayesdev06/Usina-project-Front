import * as actionsTypes from "./actionsTypes";
import Url from '../constants/Url';



export const searchInternalOrder= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchInternalOrder`,{
                params:{
                    activityId: data.activityId,
                    endDate: data.endDate,
                    startDate: data.startDate
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_INTERNALORDER,
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

export const createInternalOrder= (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.post(`createInternalOrder`,{
                activityId: data.activityId ,
                finalProductIds:data.finalProductIds,
            })
                .then((response) => {
                    if (response.status === 200) {
                    
                        
                        getInternalOrder(response.data.internalOrderId,dispatch)

                    data.handleClickVariant("Commande interne bien crée!", "success",)
                     
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


export const deleteInternalOrder = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.delete(`deleteInternalOrder?id=${data.id}`)
                .then((response) => {
                    data.handleClickVariant("Commande de interne supprimé", "success")
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


export const getInternalOrderById= (data,setLoading) => {

    return async (dispatch) => {
        try {

            getInternalOrder(data,dispatch,setLoading)
        }
        catch (error) {

            console.error(error);
        }
    }
}


export const addProductionToInternalOrder = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.post(`addProductionToInternalOrder`,{
                internalOrderId:data.internalOrderId,
                productionData:data.productionData,
                finalProductId:data.finalProductId
            })
                .then((response) => {
                   // getTheSellOrder(dispatch,data.sellOrderId)
                   getInternalOrder(data.internalOrderId,dispatch)

                    dispatch({
                        type: actionsTypes.SET_PRODUCTION_BARCODES,
                        payload:response.data.barcodes
                    })
                    
                    data.handleClickVariant("Production ajoutée", "success")
                   
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

export const addPieceToInternalOrder= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`addPieceToInternalOrder?id=${data.id}`,{
                internalOrderId:data.internalOrderId
            })
                .then((response) => {
                    getInternalOrder(data.internalOrderId,dispatch)
                    data.handleClickVariant("Elément ajouter", "success",)
                })
                .catch(error => {
                    console.log(error)
                })

        }
        catch (error) {

            console.error(error);
        }
    }
}

export const emptyStateInternalOrder =() =>{
    return async (dispatch) =>{
        try {
            dispatch({ type: actionsTypes.EMPTY_STATE_INTERNALORDER })
        } catch (error) {
            console.log(error)
        }
    }
}

const getInternalOrder= async (id,dispatch,setLoading) => {
        try {

            await Url.Url3.get(`getInternalOrderById?id=${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading) {
                            setLoading(false)
                        }
                        
                       dispatch({
                            type: actionsTypes.GET_INTERNALORDER,
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


// export const updateInternalOrder= (data) => {

//     return async (dispatch) => {
//         try {

//             await Url.Url3.put(`updateSellOrder?id=${data.id}`,{
//                 activityId: data.sellOrder.activityId
//             })
//                 .then((response) => {
//                     if (response.status === 200) {
//                     //    dispatch({
//                     //         type: actionsTypes.GET_FINALPRODUCT,
//                     //         payload: response.data
//                     //     })
//                         // data.getAllProduct()
//                         // data.afterSave()
//                         // data.onCloseModalAddProduct()
//                         data.handleClickVariant("Mise à jour effectué avec succès", "success",)
//                         // emptyStateArrayPayment()
//                     }
//                 })
//                 .catch(error => {

//                 })

//         }
//         catch (error) {

//             console.error(error);
//         }
//     }
// }