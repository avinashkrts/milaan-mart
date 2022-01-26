import { VarientActions } from "../action/constants";

const INITIAL_STATE = {
    allVarient: []
}

const VarientReducers = (states = INITIAL_STATE, action) => {
    switch (action.type) {
        case VarientActions.GET_BY_SHOP_ID_ASYNC:
            return ({
                ...states,
                allVarient: action.payload
            });
        default:
            return states;
    }
}

export default VarientReducers;