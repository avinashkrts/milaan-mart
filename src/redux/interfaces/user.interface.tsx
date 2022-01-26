import { UserActions } from "../action/constants";

export interface FetchUserById {
  type: typeof UserActions.GET_BY_ID;
  payload: Number;
}

export type UserActionTypes =
  | FetchUserById;

export type IUserActions = UserActionTypes;