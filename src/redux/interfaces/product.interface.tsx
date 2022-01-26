import { ProductActions } from "../action/constants";
import { Product } from "../modules/product";

export interface ChangeProductData {
  type: typeof ProductActions.GET_BY_SHOP_ID;
  payload: Product[];
}

export interface SetProductVariant {
  type: typeof ProductActions.SET_PRODUCT_VARIANT;
  payload: Product[];
}

export type ProductActionTypes =
  | ChangeProductData
  | SetProductVariant;

export type IProductActions = ProductActionTypes;