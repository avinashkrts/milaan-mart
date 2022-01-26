import { IBrandActions } from "./brand.interface";
import { ICartActions } from "./cart.interface";
import { ICategoryActions } from "./category.interface";
import { IMeasurementActions } from "./measurement.interface";
import { IProductActions } from "./product.interface";
import { IUserActions } from "./user.interface";
import { IVarientActions } from "./varient.interface";

export type AllActions =
  | IProductActions
  | IUserActions
  | IVarientActions
  | IMeasurementActions
  | ICartActions
  | ICategoryActions
  | IBrandActions;

export type AppActions = AllActions;