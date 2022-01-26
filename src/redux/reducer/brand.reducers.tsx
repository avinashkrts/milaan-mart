import { BrandActions } from "../action/constants";
import { Brand } from "../modules/brand.modules";

type allBrand = Brand;
const INITIAL_STATE =  {
    allBrand: []
}

const BrandReducers = (states = INITIAL_STATE, action) => {
    switch (action.type) {
        case BrandActions.GET_BY_SHOP_ID_ASYNC:
            return ({
                ...states,
                allBrand: action.payload
            });
        default:
            return states;
    }
}

export default BrandReducers;