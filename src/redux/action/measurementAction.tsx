import { Dispatch } from "redux";
import { AppActions } from "../interfaces";
import { AppState } from "../store";
import { MeasurementActions } from "./constants";

export const getByShopId = (data: String): AppActions => ({
    type: MeasurementActions.GET_BY_SHOP_ID,
    payload: data
  });

export const fetchMeasurementByShopId = (data: String) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(getByShopId(data));
    };   
}