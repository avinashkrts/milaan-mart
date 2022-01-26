import { CartActions } from "../action/constants";

const INITIAL_STATE = {
    cartByUserId: []
}

const CartReducers = (states = INITIAL_STATE, action) => {
    switch (action.type) {
        case CartActions.GET_BY_SHOP_ID_USER_ID_ASYNC:
            return ({
                ...states,
                cartByUserId: action.payload
            });
        default:
            return states;
    }
}

export default CartReducers;