import { all } from "redux-saga/effects";
import ProductSagas from "./product.saga";
import BrandSagas from "./brand.saga";
import CategorySaga from "./category.saga";
import UserSagas from "./user.saga";
import VarientSagas from "./varient.saga";
import MeasurementSagas from "./measurement.saga"
import CartSagas from "./cart.saga"

export default function* rootSaga(getState) {
    yield all([
        ProductSagas(),
        BrandSagas(),
        UserSagas(),
        CategorySaga(),
        VarientSagas(),
        CartSagas(),
        MeasurementSagas()
    ]);
};