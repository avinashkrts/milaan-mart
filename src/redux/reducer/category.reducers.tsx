import { CategoryActions } from "../action/constants";
import { Category } from "../modules/category.modules";

type allCategory = Category;
const INITIAL_STATE =  {
    allCategory: []
}

const CategoryReducers = (states = INITIAL_STATE, action: any) => {
        switch (action.type) {
        case CategoryActions.GET_BY_SHOP_ID_ASYNC:
            return ({
                ...states,
                allCategory: action.payload
            });
        default:
            return states;
    }
}

export default CategoryReducers;