import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    finalProducts : [],
    finalProduct : {
        name: "",
        categoryId:"",
        unitId:"",
        quantity: "",
        sellPriceHT: "",
        description : "",
        productIds:[],
        productions:[],
        unit:""
    },
    productions:[]
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {

        case actionTypes.GET_NOTDELIVERED_PRODUCTION :{
            return {
                ...state,
                productions: action.payload
            }
        }
        
        case actionTypes.SEARCH_FINALPRODUCT :{
            return {
                ...state,
                finalProducts: action.payload
            }
        }

        case actionTypes.GET_FINALPRODUCT :{
            return {
                ...state,
                finalProduct: action.payload
            }
        }

        case actionTypes.EMPTY_STATE_SELLORDER :{
            return {
            finalProducts : []
            }
        }

        
        
        default:
            return state;
    }
}