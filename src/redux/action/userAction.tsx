import { Dispatch } from "redux";
import { AppActions } from "../interfaces";
import { AppState } from "../store";
import { UserActions } from "./constants";

export const getById = (data: Number): AppActions => ({
    type: UserActions.GET_BY_ID,
    payload: data
  });

export const fetchUserById = (data: Number) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(getById(data));
    };   
}