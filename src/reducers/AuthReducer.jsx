import * as actionTypes from "../actions/actionsTypes";

const INIT_STATE = {
    authSuccess:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case actionTypes.LOGIN_SUCCESS:

            return {
                ...state,
                authSuccess:  action.payload.authSuccess
            }

        default:
            return state;
    }
}