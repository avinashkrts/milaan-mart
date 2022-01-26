import { Dispatch } from "redux";
import { AppActions } from "../interfaces";
import { AppState } from "../store";
import { CartActions } from "./constants";

export const getByShopIdUserId = (data: any): AppActions => ({
    type: CartActions.GET_BY_SHOP_ID_USER_ID,
    payload: data
});

export const fetchCartByShopIdUserId = (data: any) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(getByShopIdUserId(data));
    };
}