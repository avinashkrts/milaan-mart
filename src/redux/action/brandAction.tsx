import { Dispatch } from "redux";
import { AppActions } from "../interfaces";
import { AppState } from "../store";
import { BrandActions } from "./constants";

export const getByShopId = (data: String): AppActions => ({
    type: BrandActions.GET_BY_SHOP_ID,
    payload: data
  });

export const fetchBrandByShopId = (data: String) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(getByShopId(data));
    };   
}