import { Dispatch } from "redux";
import { AppActions } from "../interfaces";
import { AppState } from "../store";
import { VarientActions } from "./constants";

export const getByShopId = (data: String): AppActions => ({
    type: VarientActions.GET_BY_SHOP_ID,
    payload: data
  });

export const fetchVarientByShopId = (data: String) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(getByShopId(data));
    };   
}