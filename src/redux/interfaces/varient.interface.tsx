import { VarientActions } from "../action/constants";

export interface FetchVarientByShopId {
  type: typeof VarientActions.GET_BY_SHOP_ID;
  payload: String;
}

export type VarientActionTypes =
  | FetchVarientByShopId;

export type IVarientActions = VarientActionTypes;