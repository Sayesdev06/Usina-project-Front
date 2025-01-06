import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    arrayAllCatgories: [],
    arrayAllWareHouse: [],
    arrayAllProduct: [],
    arrayAllUnits: [],
    arrayAllActivity:[],
    productDetails:{}
    
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {

        //  CATEGORY

        case actionTypes.GET_ALL_CATEGORY: {
            return {
                ...state,
                arrayAllCatgories: action.payload.arrayAllCatgories
            }
        }
        // warehouse
        case actionTypes.GET_ALL_WAREHOUSE: {
            return {
                ...state,
                arrayAllWareHouse: action.payload.arrayAllWareHouse
            }
        }
        // Product
        case actionTypes.GET_ALL_PRODUCT: {
            return {
                ...state,
                arrayAllProduct: action.payload.arrayAllProduct
            }
        }
        case actionTypes.GET_DETAILS_PRODUCT: {
            return {
                ...state,
                // arrayAllProduct: action.payload.arrayAllProduct
            }
        }

        case actionTypes.GET_ALL_UNITS: {
            return {
                ...state,
                arrayAllUnits: action.payload.arrayAllUnits
            }
        }

        case actionTypes.GET_ALL_ACTIVITY: {
            return {
                ...state,
                arrayAllActivity: action.payload.arrayAllActivity
            }
        }

        case actionTypes.GET_FULL_DETAILS_PRODUCT:{
            return{
                ...state,
                productDetails: action.payload
            }
        }
        default:
            return state;
    }
}


