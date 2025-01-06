import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    sparePart : [],
    maintenance : {
        id: "",
        issue: "",
        machine: "",
        products: [],
        users: [],
        createdAt:"",
    },
    maintenances:[],
    maintenanceID:"",
    file:"",
    arrayAllTransfer:[]
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case actionTypes.SEARCH_TRANSFER_VOUCHER :{
            return {
                ...state,
                arrayAllTransfer: action.payload
            }
        }

        case actionTypes.GET_MAINTENANCE_FILE :{
            return {
                ...state,
                file: action.payload
            }
        }
        
        case actionTypes.SEARCH_MAINTENANCE :{
            return {
                ...state,
                maintenances: action.payload
            }
        }

        case actionTypes.GET_MAINTENANCE :{
            return {
                ...state,
                maintenance: action.payload
            }
        }

        case actionTypes.SET_MAINTENANCE_ID :{
            return {
                ...state,
                maintenanceID: action.payload
            }
        }

        case actionTypes.SEARCH_PRODUCT_FOR_MAINTENANCE :{
            return {
                ...state,
                sparePart: action.payload
            }
        }

        
        default:
            return state;
    }
}