import { Dispatch } from "redux";
import { AppActions } from "../interfaces";
import { AppState } from "../store";
import {ProductActions} from "./constants";

export const changeProductData = (data) => {
    return dispatch => {
        dispatch({
            type: ProductActions.GET_BY_SHOP_ID,
            payload: data
        })
    }
}

export const setVariant = (data: any): AppActions => ({
    type: ProductActions.SET_PRODUCT_VARIANT,
    payload: data
  });

export const setProductVariant = (data: any) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(setVariant(data));
    };  
}