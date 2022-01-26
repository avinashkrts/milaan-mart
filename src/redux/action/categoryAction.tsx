import { Dispatch } from "redux";
import { AppActions } from "../interfaces";
import { AppState } from "../store";
import { CategoryActions } from "./constants";

export const getByShopId = (data: String): AppActions => ({
    type: CategoryActions.GET_BY_SHOP_ID,
    payload: data
  });

export const fetchCategoryByShopId = (data: String) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(getByShopId(data));
    };   
}