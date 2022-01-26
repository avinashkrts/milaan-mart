import { MeasurementActions } from "../action/constants";

export interface FetchMeasurementByShopId {
  type: typeof MeasurementActions.GET_BY_SHOP_ID;
  payload: String;
}

export type MeasurementActionTypes =
  | FetchMeasurementByShopId;

export type IMeasurementActions = MeasurementActionTypes;