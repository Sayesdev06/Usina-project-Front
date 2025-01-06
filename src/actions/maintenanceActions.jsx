import * as actionsTypes from "./actionsTypes";
import Url from '../constants/Url';
import axios from 'axios';
import Cookies from "js-cookie";


export const searchMaintenance= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchMaintenance?machine=${data.machine}&id=${data.id}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_MAINTENANCE,
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

export const searchProductForMaintenance= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchProductForMaintenance?name=${data.name}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false)
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_PRODUCT_FOR_MAINTENANCE,
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


export const addPieceToMaintenance = (data) => {

    return async (dispatch) => {
        try {


            await Url.Url3.put(`addPieceToMaintenance?id=${data.id}`,
                {
                    maintenanceId:data.maintenanceId,
                    isUsed:1
                }
            )
                .then((response) => {

                    if (response.status === 200) {
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        data.handleClickVariant("Piece bien modifiée!", "success",)

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

export const factureMaintenance = (data) => {
    return async (dispatch) =>{
        try {
            await Url.Url3.get(`factureMaintenance?id=${data.id}`)
                .then((response) => {
                    
                    data.openFile(response.data.fileName)
                    // if(setLoadingBarCodes){
                    //     setLoadingBarCodes(false)
                    // }
                    
                    dispatch({
                        type: actionsTypes.GET_MAINTENANCE_FILE,
                        payload: response.data.fileName
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

export const createMaintenance= (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.post(`createMaintenance`,{
                machine: data.machine ,
                issue:data.issue ,
                intervention:data.intervention ,
                products:data.productIds ,
                users:data.userId,
            })
                .then((response) => {
                    if (response.status === 200) {  
                    //    dispatch({
                    //         type: actionsTypes.SET_MAINTENANCE_ID,
                    //         payload: response.data.maintenanceId
                    //     })
                    data.handleClickVariant("Maintenance bien crée!", "success",)

                    data.handleStateMaintenance("id",response.data.maintenanceId)

                    



                    //getTheMaintenance(dispatch,response.data.maintenanceId)
                    
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




export const deleteMaintenance = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.delete(`deleteMaintenance?id=${data.id}`)
                .then((response) => {
                    data.handleClickVariant("Maintenance supprimé", "success")
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


export const getMaintenanceById= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`getMaintenanceById?id=${data}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false)
                        }
                       dispatch({
                            type: actionsTypes.GET_MAINTENANCE,
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




// export const updateDevis= (data) => {

//     return async (dispatch) => {
//         try {

//             await Url.Url3.put(`updateDevis?id=${data.id}`,{
//                 activityId: data.activityId ,
//                 quantity:data.quantity ,
//                 amountHt:data.amountHt ,
//                 amountTtc:data.amountTtc ,
//                 clientId:data.clientId ,
//                 // finalProductIds:data.finalProductIds,
//                 discounts:data.discounts,
//                 //amountPayed:0
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

export const searchTransferVoucher= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchTransferVoucher?userId=${data.userId}&file=${data.file}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_TRANSFER_VOUCHER,
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

export const transferWarehouse= (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.post(`transferWarehouse`,{
                id: data.id ,
                type:data.type ,
                warehouseId:data.warehouseId,
                userId:Cookies.get('userId'),
            })
                .then((response) => {
                    if (response.status === 200) {  
                    data.openFile(response.data.fileName)
                    data.handleClickVariant("Bon de transfer Ajoutee", "success")
                    
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



const getTheMaintenance =async (dispatch,id)=>{
    await Url.Url3.get(`getMaintenanceById?id=${id}`).then((response) => {
            dispatch({
                type: actionsTypes.GET_MAINTENANCE,
                payload: response.data
                //payload: { order: response.data }
            })
        }
        )
        .catch((err) => {
    
        });
}
