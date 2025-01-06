import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    sellOrders : [],
    elementsSellOrder: [],
    sellOrder : {
        name: "",
        categoryId:"",
        unitId:"",
        quantity: "",
        sellPriceHT: "",
        description : "",
        productIds:[],
        pieces:[],
        factureFile:"",
        noteInterne:""
    },
    sellOrderId:"",
    dataPieces:{},
    allPayment : [],
    statistics : {},
    barCodes : [{}],
    arrayAllDelivery:[],
    delivery:{
        id:"",
        file: "",
        destination: "",
        sellOrder:"",
        productions:{},
        driver: "",
        truckRegistrationNumber:""
    }
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        
        
        case actionTypes.GET_DELIVERY :{
            return {
                ...state,
                delivery:{
                    id: action.payload.id,
                    file: action.payload.file,
                    destination: action.payload.destination,
                    sellOrder:action.payload.sellOrder,
                    productions:action.payload.sellOrder.productions,
                    driver: action.payload.driver,
                    truckRegistrationNumber:action.payload.truckRegistrationNumber
                },
            }
        }

        case actionTypes.SEARCH_DELIVERY :{
            return {
                ...state,
                arrayAllDelivery: action.payload,
            }
        }

        case actionTypes.SEARCH_SELLORDER :{
            return {
                ...state,
                sellOrders: action.payload,
            }
        }

        case actionTypes.ELEMENTS_SELLORDER :{
            return {
                ...state,
                elementsSellOrder: action.payload
            }
        }

        case actionTypes.GET_SELLORDER :{
            return {
                ...state,
                sellOrder: action.payload
            }
        }

        case actionTypes.SET_SELLORDERID :{
            return {
                ...state,
                sellOrderId: action.payload
            }
        }

        case actionTypes.EMPTY_STATE_SELLORDER:{
            return{
                sellOrders : [],
                sellOrder : {
                    name: "",
                    categoryId:"",
                    unitId:"",
                    quantity: "",
                    sellPriceHT: "",
                    description : "",
                    productIds:[]
                },
                sellOrderId:"",
                dataPieces:{},
                allPayment : [],
                statistics : {}
            }
        }

        case actionTypes.GET_PIECES:{
            return{
                ...state,
                dataPieces : action.payload
            }
        }

        case actionTypes.GET_ALL_PAYMENT_SELLORDER:{
            return{
                ...state,
                allPayment : action.payload
            }
        }

        case actionTypes.HOME_STATISTIC : {
            return {
                ...state,
                statistics : action.payload
            }
        }

        case actionTypes.ACTIVITYE_STATISTIC : {
            return {
                ...state,
                statistics : action.payload
            }
        }

        case actionTypes.SET_PRODUCTION_BARCODES : {
            return {
                ...state,
                barCodes : action.payload
            }
        }

        case actionTypes.EMPTY_STATE : {
            return {
                ...state,
                delivery:{
                    id:"",
                    file: "",
                    destination: "",
                    sellOrder:"",
                    productions:{}
                }
            }
        }
       
    
        default:
            return state;
    }
}