import { BrandActions } from "../action/constants";
import { Brand } from "../modules/brand.modules";

export interface FetchBrandByShopId {
  type: typeof BrandActions.GET_BY_SHOP_ID;
  payload: String;
}

export type BrandActionTypes =
  | FetchBrandByShopId;

export type IBrandActions = BrandActionTypes;