import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    arrayAllOrder: [],
    orderId:"",
    arrayPayment : [],
    order:{
        id: "",
        expectedDateReceipt: "",
        amountHt: "",
        amountTtc: "",
        amountPayed: "",
        file: "",
        status: "",
        statusPayment: "",
        createdAt: "",
        updatedAt: "",
        userId: "",
        vendorId: "",
        tvaId: "",
        user: {
            id: "",
            firstName: "",
            lastName: "",
            login: "",
            password: "",
            poste: "",
            createdAt: "",
            updatedAt: ""
        },
        vendor: {
            id: "",
            fullname: "",
            type: "",
            tvaNumber: "",
            registrationNumber: "",
            address: "",
            city: "",
            country: "",
            phoneNumber: "",
            contactPhoneNumber: "",
            email: "",
            contactEmail: "",
            createdAt: "",
            updatedAt: "",
            tvaId: ""
        },
        tva: {
            id: "",
            name: "",
            percentage: "",
            createdAt: "",
            updatedAt: ""
        },
        products: [],
        payments: []
    },
    arrayCodabars : []
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {

        //  CATEGORY

        case actionTypes.GET_ALL_ORDER: {
            return {
                ...state,
                arrayAllOrder: action.payload.arrayAllOrder
            }
        }

        case actionTypes.SET_ORDERID:{
            return{
                ...state,
                orderId : action.payload.orderId
            }
        }

        case actionTypes.GET_ALL_PAYMENT_BY_ORDERID:{
            return{
                ...state,
                arrayPayment : action.payload.arrayPayment
            }
        }

        
        case actionTypes.GET_ORDER_BY_ID:{
            return{
                ...state,
                order : action.payload.order,
                arrayPayment : action.payload.order.payments
            }
        }

        case actionTypes.EMPTY_STATE:{
            return{
                ...state,
                orderId : ""
            }
        }

        case actionTypes.CODABARS_IMAGES:{
            return{
                ...state,
                arrayCodabars : action.payload
            }
        }

        case actionTypes.EMPTY_ARRAY_PAYMENT:{
            return{
                ...state,
                arrayPayment : []
            }
        }

        case actionTypes.GET_ALL_PAYMENT_ORDER:{
            return{
                ...state,
                arrayPayment : action.payload
            }
        }

      
     
    
        default:
            return state;
    }
}


