import * as actionsTypes from "./actionsTypes";
import Url from '../constants/Url';
import axios from 'axios';
import Cookies from "js-cookie";

// Product

export const searchSellOrder= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchSellOrder?clientId=${data.clientId}&activityId=${data.activityId}&statusProduction=${data.statusProduction}&statusDelivery=${data.statusDelivery}&sellOrderType=${data.sellOrderType}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_SELLORDER,
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

export const searchFactureSellOrder= (data,setLoading) => {

    return async (dispatch) => {
        try {
            await Url.Url3.get(`searchFactureSellOrder?clientId=${data.clientId}&activityId=${data.activityId}&statusPayment=${data.statusPayment}&id=${data.id}&file=${data.file}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_SELLORDER,
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

export const searchDirectSellOrder= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchDirectSellOrder?clinetId=${data.clientId}&activityId=${data.activityId}&sellOrderType=${data.sellOrderType}&statusPayment=${data.statusPayment}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_SELLORDER,
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


export const getSellOrderAndElements= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`getSellOrderAndElements?id=${data.id}&clientId=${data.clientId}&activityId=${data.activityId}&statusProduction=${data.statusProduction}&sellOrderType=${data.sellOrderType}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.ELEMENTS_SELLORDER,
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


export const createSellOrder= (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.post(`createSellOrder`,{
                activityId: data.activityId ,
                quantity:data.quantity ,
                amountHt:data.amountHt ,
                amountTtc:data.amountTtc ,
                startProductionDate:data.startProductionDate ,
                endProductionDate:data.endProductionDate ,
                expectedDeliveryDate:data.expectedDeliveryDate ,
                statusDelivery:data.statusDelivery ,
                statusPayment:data.statusPayment ,
                statusProduction:data.statusProduction ,
                clientId:data.clientId ,
                finalProductIds:data.finalProductIds,
                discounts:data.discounts,
                amountPayed:0,
                sellOrderType:data.sellOrderType,
                noteInterne:data.noteInterne
            })
                .then((response) => {
                    if (response.status === 200) {
                    
                        dispatch({ type: actionsTypes.EMPTY_ARRAY_PAYMENT});
                        
                       dispatch({
                            type: actionsTypes.SET_SELLORDERID,
                            payload: response.data.sellOrderId
                        })

                    data.handleClickVariant("Commande de vente fini bien crée!", "success",)

                    setTimeout(() => {
                        dispatch({ type: actionsTypes.EMPTY_STATE });
                      }, 1000);
                     
                    }

                    getTheSellOrder(dispatch,response.data.sellOrderId)
                    
                })
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }
}


export const deleteSellOrder = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.delete(`deleteSellOrder?id=${data.id}`)
                .then((response) => {
                    data.handleClickVariant("Commande de vente fini supprimé", "success")
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


export const getSellOrderById= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`getSellOrderById?id=${data}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading) {
                            setLoading(false)
                        }
                        
                       dispatch({
                            type: actionsTypes.GET_SELLORDER,
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

export const getSellOrderAndPiecesById= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`getSellOrderAndPiecesById?id=${data}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading) {
                            setLoading(false)
                        }
                        
                       dispatch({
                            type: actionsTypes.GET_SELLORDER,
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


export const updateSellOrder= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`updateSellOrder?id=${data.id}`,{
                activityId: data.sellOrder.activityId,
                amountHt: data.sellOrder.amountHt,
                amountTtc: data.sellOrder.amountTtc,
                startProductionDate: data.sellOrder.startProductionDate,
                endProductionDate: data.sellOrder.endProductionDate,
                expectedDeliveryDate: data.sellOrder.expectedDeliveryDate,
                statusDelivery: data.sellOrder.statusDelivery,
                sellOrderType: data.sellOrder.sellOrderType,
                statusProduction: data.sellOrder.statusProduction,
                discounts: data.sellOrder.discounts,
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


export const updateFinalProductsForSellOrder= (data) => {

    return async (dispatch) => {
        try {
            console.log(data)
            await Url.Url3.put(`updateFinalProductsForSellOrder?id=${data.id}`,{
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


export const addFactureToSellOrder = (data=>{
    return async (dispatch) =>{
        try {
            await Url.Url3.post(`addFactureToSellOrder`,data.formData,{
                params:{
                    id:data.sellOrderId
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }
            })
                .then((res) => {
                    data.handleClickVariant("facture envoyée", "success",)
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }

})


export const getAllPaymentBySellOrderId = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.get(`getAllPaymentBySellOrderId`,{
                params:{
                    id:data
                }
            })
                .then((res) => {
                    dispatch({
                        type: actionsTypes.GET_ALL_PAYMENT_BY_ORDERID,
                        payload: { arrayPayment: res.data }
                    })

                    //emptyStateArrayPayment()
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

const getTheSellOrder =async (dispatch,id)=>{
    await Url.Url3.get(`getSellOrderById`,{
        params:{
            id:id
        }
    })
        .then((response) => {
            dispatch({
                type: actionsTypes.GET_SELLORDER,
                payload: response.data
                //payload: { order: response.data }
            })
        }
        )
        .catch((err) => {
    
        });
}

export const deletePaymentSellOrder = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.delete(`deletePayment?id=${data.id}&orderId=${data.orderId}&sellOrderId=${data.sellOrderId}`)
                .then((response) => {

                    functionGetPayment(dispatch,data.sellOrderId)



                    data.handleClickVariant("Paiement supprimé", "success")
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

export const getTheProductNeeded = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.get(`getTheProductNeeded?id=${data.sellOrderId}`)
                .then((response) => {
                    if(data.setLoadingGetProduct){
                        data.setLoadingGetProduct(false)
                    }
                    if(data.setOpenModalgetPieces){
                        data.setOpenModalgetPieces(true)
                    }

                    dispatch({
                        type: actionsTypes.GET_PIECES,
                        payload:response.data
                    })
                }
                )
                .catch((err) => {
                    data.handleClickVariant(err.response.data.message.error, "error")
                });
        }
        catch (error) {

            console.error(error);
        }
    }

}

export const validatePieceSelected = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.post(`validatePieceSelected`,{
                selectedPieces:data.selectedPieces,
                arrayFinalProductAndQuantity:data.arrayFinalProductAndQuantity,
                id:data.id
            })
                .then((response) => {


                    //functionGetPayment(dispatch,data.sellOrderId)
                    data.handleClickVariant("Eléments validés", "success")
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

export const addProductionTosellOrder = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.post(`addProductionTosellOrder`,{
                sellOrderId:data.sellOrderId,
                productionData:data.productionData,
                finalProductId:data.finalProductId
            })
                .then((response) => {
                    getTheSellOrder(dispatch,data.sellOrderId)

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


// export const sendSellOrderViaEmail = (data) => {
//     return async (dispatch) =>{
//         try {
//             await Url.Url3.get(`sendSellOrderViaEmail`,{
//                 params:{
//                     id:data.sellOrderId
//                 }
//             })
//                 .then((res) => {
//                     data.handleClickVariant(`Votre commande de vente "${res.data.orderId}" a été bien envoyé`, "success",)
//                     getTheSellOrder(dispatch,data.sellOrderId)
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                 });
            
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

export const emptyStateSellOrder =() =>{
    return async (dispatch) =>{
        try {
            dispatch({ type: actionsTypes.EMPTY_STATE_SELLORDER })
        } catch (error) {
            console.log(error)
        }
    }
}

export const factureSellOrderViaEmail = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.get(`factureSellOrderViaEmail`,{
                params:{
                    id:data.sellOrderId,
                    factureType:data.factureType
                }
            })
                .then((res) => {
                    data.handleClickVariant(`Votre Facture "${res.data.orderId}" a été bien envoyé`, "success",)
                    getTheSellOrder(dispatch,data.sellOrderId)
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }
}

export const functionGetPayment = async (dispatch,data) => {
try {
    await Url.Url3.get(`getAllPaymentBySellOrderId`,{
        params:{
            id:data
        }
    })
        .then((res) => {
            dispatch({
                type: actionsTypes.GET_ALL_PAYMENT_BY_ORDERID,
                payload: { arrayPayment: res.data }
            })
        }
        )
        .catch((err) => {

        });
}
catch (error) {

    console.error(error);
}
}

export const getAllPaymentSellOrder = (data,setLoading) => {
    return async (dispatch) => {
        try {
            await Url.Url3.get(`getAllPaymentSellOrder`,{
                params:{
                    sellOrderId:data.sellOrderId,
                    clientId:data.clientId,
                    startDate:data.startDate,
                    endDate:data.endDate,
                    type:data.type.join(','),
                    sellOrderType:data.sellOrderType
                }
            })
                .then((res) => {
                    if(setLoading){
                        setLoading(false);
                    }
                    dispatch({
                        type: actionsTypes.GET_ALL_PAYMENT_SELLORDER,
                        payload: res.data 
                    })
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

export const getHomeStatistic = (setLoading) => {
    return async (dispatch) => {
        try {
            await Url.Url3.get(`getHomeStatistic`)
                .then((res) => {
                    
                    dispatch({
                        type: actionsTypes.HOME_STATISTIC,
                        payload: res.data 
                    })
                    setLoading(false)
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

export const getActivityStatistic = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.get(`getActivityStatistic`)
                .then((res) => {
                    dispatch({
                        type: actionsTypes.ACTIVITYE_STATISTIC,
                        payload: res.data 
                    })
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

export const updatePiecequantity= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`updatePiecequantity?id=${data.id}`,{
                value: data.value
            })
                .then((response) => {
                    if (response.status === 200) {
                    //    dispatch({
                    //         type: actionsTypes.SET_CODABAR,
                    //         payload: response.data
                    //     })
                    data.setBarCode(response.data)
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        data.handleClickVariant("Nouvel élément ajouté", "success",)
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

export const changePieceStatus= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`changePieceStatus?id=${data.id}`)
                .then((response) => {
                    data.handleClickVariant("Elément valide", "success",)
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


export const createDelivery = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.post(`createDelivery`,{
                destination:data.destination,
                sellOrderId:data.sellOrderId,
                truckRegistrationNumber:data.truckRegistrationNumber,
                driver:data.driver,
            })
                .then((response) => {


                    data.handleClickVariant("Livraison Cree", "success",)
                    data.setDelivery({...data.delivery,id: response.data.delivery.id})
                    // if(setLoadingBarCodes){
                    //     setLoadingBarCodes(false)
                    // }
                    // dispatch({
                    //     type: actionsTypes.CODABARS_IMAGES,
                    //     payload: response.data
                    // })
                    //getTheOrder(dispatch,data.orderId)
                    
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }

}

export const getDeliveryById = (id) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.get(`getDeliveryById?id=${id}`)
                .then((response) => {
                    // if(setLoadingBarCodes){
                    //     setLoadingBarCodes(false)
                    // }
                    dispatch({
                        type: actionsTypes.GET_DELIVERY,
                        payload: response.data
                    })

                    //getTheOrder(dispatch,data.orderId)
                    
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }

}

export const updateDelivery = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.put(`updateDelivery`,{params:{id:data.id},
            body:{
                destination:data.destination
            }})
                .then((response) => {
                    // if(setLoadingBarCodes){
                    //     setLoadingBarCodes(false)
                    // }
                    // dispatch({
                    //     type: actionsTypes.CODABARS_IMAGES,
                    //     payload: response.data
                    // })
                    //getTheOrder(dispatch,data.orderId)
                    
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }

}

export const deleteDelivery = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.delete(`deleteDelivery`,{params:{id:data.id}})
                .then((response) => {

                    data.handleClickVariant("Livrison suprimee", "success",)
                    // if(setLoadingBarCodes){
                    //     setLoadingBarCodes(false)
                    // }
                    // dispatch({
                    //     type: actionsTypes.CODABARS_IMAGES,
                    //     payload: response.data
                    // })
                    //getTheOrder(dispatch,data.orderId)
                    
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }

}

export const searchDelivery = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.get(`searchDelivery`,{params:{
                activityId:data.activityId,
                clientId:data.clientId,
                statusDelivery:data.statusDelivery,
                sellOrderId:data.sellOrderId}})
                .then((response) => {
                    // if(setLoadingBarCodes){
                    //     setLoadingBarCodes(false)
                    // }
                    dispatch({
                        type: actionsTypes.SEARCH_DELIVERY,
                        payload: response.data
                    })
                    //getTheOrder(dispatch,data.orderId)
                    
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }

}

export const searchSellOrderForDelivery= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchSellOrderForDelivery?clientId=${data.clientId}&activityId=${data.activityId}&id=${data.id}&statusDelivery=${data.statusDelivery}`)
                .then((response) => {
                    if (response.status === 200) {
                       dispatch({
                            type: actionsTypes.SEARCH_SELLORDER,
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

export const factureDeliveryOrder = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.get(`factureDeliveryOrder?id=${data.id}`)
                .then((response) => {
                    data.openFile(response.data.fileName)
                    // if(setLoadingBarCodes){
                    //     setLoadingBarCodes(false)
                    // }
                    // dispatch({
                    //     type: actionsTypes.CODABARS_IMAGES,
                    //     payload: response.data
                    // })
                    //getTheOrder(dispatch,data.orderId)
                    
                })
                .catch((err) => {
                    console.log(err)
                });
            
        } catch (error) {
            console.log(error)
        }
    }

}


// export const emptyStateArrayPayment = () => {
//     return (dispatch) => {
//       setTimeout(() => {
//         dispatch({ type: actionsTypes.EMPTY_ARRAY_PAYMENT});
//       }, 1000);
//     };
//   }
