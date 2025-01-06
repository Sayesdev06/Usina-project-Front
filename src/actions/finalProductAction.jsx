import * as actionsTypes from "./actionsTypes";
import Url from '../constants/Url';
import axios from 'axios';
import Cookies from "js-cookie";

// Product

export const searchFinalProduct= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`searchFinalProduct?categoryId=${data.categoryId}&name=${data.name}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading) {
                            setLoading(false)
                        }
                       dispatch({
                            type: actionsTypes.SEARCH_FINALPRODUCT,
                            payload: response.data
                        })
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        // data.handleClickVariant("Commande bien crée!", "success",)
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


export const getAllProductionNotDelivered= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`getAllProductionNotDelivered`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading) {
                            setLoading(false)
                        }
                       dispatch({
                            type: actionsTypes.GET_NOTDELIVERED_PRODUCTION ,
                            payload: response.data
                        })
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        // data.handleClickVariant("Commande bien crée!", "success",)
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

export const createFinalProduct= (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.post(`createFinalProduct`,{
                name: data.finalProduct.name,
                description: data.finalProduct.description,
                sellPriceHT: data.finalProduct.sellPriceHT,
                quantity: data.finalProduct.quantity,
                unitId: data.finalProduct.unitId,
                categoryId: data.finalProduct.categoryId,
                productIds : data.productIdAndQuantity
            })
                .then((response) => {
                    if (response.status === 200) {
                    //    dispatch({
                    //         type: actionsTypes.SEARCH_FINALPRODUCT,
                    //         payload: response.data
                    //     })

                    data.handleClickVariant("Produit fini bien crée!", "success",)

                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        // data.handleClickVariant("Commande bien crée!", "success",)
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


export const deleteFinalProduct = (data) => {
    return async (dispatch) => {
        try {
            await Url.Url3.delete(`deleteFinalProduct?id=${data.id}`)
                .then((response) => {
                    data.handleClickVariant("Produit fini supprimé", "success")
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


export const getFinalProductById= (data,setLoading) => {

    return async (dispatch) => {
        try {

            await Url.Url3.get(`getFinalProductById?id=${data}`)
                .then((response) => {
                    if (response.status === 200) {
                        if(setLoading){
                            setLoading(false);
                        }
                       dispatch({
                            type: actionsTypes.GET_FINALPRODUCT,
                            payload: response.data
                        })
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        // data.handleClickVariant("Commande bien crée!", "success",)
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

export const updateFinalProduct= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`updateFinalProduct?id=${data.id}`,{
                name: data.finalProduct.name,
                description: data.finalProduct.description,
                sellPriceHT: data.finalProduct.sellPriceHT,
                quantity: data.finalProduct.quantity,
                unitId: data.finalProduct.unitId,
                categoryId: data.finalProduct.categoryId
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
                        data.handleClickVariant("Produit final mis à jour!", "success",)
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


export const updateProductsForFinalProduct= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`updateProductsForFinalProduct?id=${data.id}`,{
                deleteProductIds:data.deleteProductIds,addProductIds:data.addProductIds
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

export const updateQuantityNeeded= (data) => {

    return async (dispatch) => {
        try {

            await Url.Url3.put(`updateQuantityNeeded?finalProductId=${data.finalProductId}&productId=${data.productId}`,{
                quantityNeeded:data.quantityNeeded,
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
                        data.handleClickVariant("produit final quantite mis à jour !", "success",)
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


export const updateProduction = (data) => {

    return async (dispatch) => {
        try {


            await Url.Url3.put(`updateProduction?id=${data.id}`,
                {
                    value:data.value
                }
            )
                .then((response) => {

                    if (response.status === 200) {
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        data.handleClickVariant("Element bien modifiée!", "success",)

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

export const updateStatusProduction = (data) => {

    return async (dispatch) => {
        try {


            await Url.Url3.put(`updateProduction?id=${data.id}`,
                {
                    statusDelivery :data.statusDelivery,
                    deliveryId:data.deliveryId
                }
            )
                .then((response) => {

                    if (response.status === 200) {
                        // data.getAllProduct()
                        // data.afterSave()
                        // data.onCloseModalAddProduct()
                        data.handleClickVariant("Element bien modifiée!", "success",)

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

export const deleteProduction = (data) => {

    return async (dispatch) => {
        try {
            await Url.Url3.delete(`deleteProduction?id=${data.id}`,
            )
                .then((res) => {
                    data.handleClickVariant("Element bien supprimé!", "success",)
                }
                )
                .catch(error => {

                })

        }
        catch (error) {

            console.error(error);
        }
    }

};