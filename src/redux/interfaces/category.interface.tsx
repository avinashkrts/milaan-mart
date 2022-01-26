import { CategoryActions } from "../action/constants";

export interface FetchCategoryByShopId {
  type: typeof CategoryActions.GET_BY_SHOP_ID;
  payload: String;
}

export type CategoryActionTypes =
  | FetchCategoryByShopId;

export type ICategoryActions = CategoryActionTypes;