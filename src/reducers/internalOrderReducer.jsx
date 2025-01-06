import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    internalOrders : [],
    internalOrder : {
        id:"",
        activityId: "",
        finalProducts:[],
        pieces:[],
        production:[]
    }
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {


        case actionTypes.EMPTY_STATE_INTERNALORDER :{
            return {
                ...state,
                internalOrder : {
                    id:"",
                    activityId: "",
                    finalProducts:[],
                    pieces:[],
                    production:[]
                }
            }
        }
        
        case actionTypes.SEARCH_INTERNALORDER :{
            return {
                ...state,
                internalOrders: action.payload,
            }
        }

        case actionTypes.GET_INTERNALORDER :{
            return {
                ...state,
                internalOrder: action.payload,
            }
        }


    
        default:
            return state;
    }
}