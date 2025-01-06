import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    arrayDevis : [],
    devis : {
        activityId: "",
        amountHt: 0,
        amountTtc: 0,
        clientId: "",
        discounts: 0,
        finalProductIds: [],
    },
    devisId:"",
    sellOrderId:"",
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        
        case actionTypes.SEARCH_DEVIS :{
            return {
                ...state,
                arrayDevis: action.payload
            }
        }

        case actionTypes.GET_DEVIS :{
            return {
                ...state,
                devis: action.payload
            }
        }

        case actionTypes.SET_DEVISID :{
            return {
                ...state,
                devisId: action.payload
            }
        }

        case actionTypes.EMPTY_STATE:{
            return{
                ...state,
                devisId : "",
                sellOrderId: ""
            }
        }
        
        
        default:
            return state;
    }
}