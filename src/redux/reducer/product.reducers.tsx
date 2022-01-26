import { ProductActions } from "../action/constants";

const INITIAL_STATE = {
    productData: [],
    productVarient: []
}

const ProductReducers = (states = INITIAL_STATE, action) => {
            switch (action.type) {
        case ProductActions.GET_BY_SHOP_ID_ASYNC:
            return ({
                ...states,
                productData: action.payload
            });
        case ProductActions.SET_PRODUCT_VARIANT_ASYNC:
            return ({
                ...states,
                productVarient: action.payload
            })
        default:
            return states;
    }
}

export default ProductReducers;