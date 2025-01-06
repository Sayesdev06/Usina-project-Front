import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    message: null,


    allPermession: [],

    arrayAllClient: [],

    // provider
    arrayAllProvider: [],

    // tva
    arrayAllTva: [],
    // users
    arrayAllUsers: [],
    arrayAllPostes: []
};

export default (state = INIT_STATE, action) => {
    let newState = {};
    let data = null;
    switch (action.type) {
        // company
        case actionTypes.CREATE_COMPANY:

            return {
                ...state,
                company: action.payload
            }
        case actionTypes.GET_DETAILS_COMPANY:
            return {
                ...state,
                message: action.payload.message ? action.payload.message : null,
            }
        //  users

        // case actionTypes.GET_ALL_PERMISSION: {
        //     return {
        //         ...state,
        //         allPermession: action.payload
        //     }
        // }
        case actionTypes.GET_ALL_USER: {
            return {
                ...state,
                arrayAllUsers: action.payload.arrayAllUsers,
                arrayAllPostes: action.payload.arrayAllPostes
            }
        }

        // client
        case actionTypes.GET_ALL_CLIENT: {

            return {
                ...state,
                arrayAllClient: action.payload.arrayAllClient
            }
        }
        // fournisseur
        case actionTypes.GET_ALL_PROVIDER: {

            return {
                ...state,
                arrayAllProvider: action.payload.arrayAllProvider
            }
        }

        // tva
        case actionTypes.GET_ALL_TVA: {
            return {
                ...state,
                arrayAllTva: action.payload.arrayAllTva
            }
        }
        default:
            return state;
    }
}


