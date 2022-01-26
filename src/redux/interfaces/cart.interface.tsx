import { CartActions } from "../action/constants";

export interface FetchCartByShopIdUserId {
  type: typeof CartActions.GET_BY_SHOP_ID_USER_ID;
  payload: any;
}

export type CartActionTypes =
  | FetchCartByShopIdUserId;

export type ICartActions = CartActionTypes;