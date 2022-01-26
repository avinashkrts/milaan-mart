import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { prepareErrorMessage } from '../action/Common';
import { ProductActions } from '../action/constants';
import { PRODUCT_SERVICE } from '../service/product.services';
import { VARIENT_SERVICE } from '../service/varient.services';

export function* fetchProductByShopIdAsync(action) {
    let response = yield PRODUCT_SERVICE.PRODUCT_BY_SHOP_ID(action.payload);
    if (response.data && response.data != null) {
        yield put({
            type: ProductActions.GET_BY_SHOP_ID_ASYNC,
            payload: response.data
        });
    } else {
        yield put(prepareErrorMessage(ProductActions.PRODUCT_ERROR, response));
    }
}

export function* setProductVariantAsync(action) {
    let response = yield PRODUCT_SERVICE.PRODUCT_BY_SHOP_ID(action.payload.shopId);
    let response1 = yield VARIENT_SERVICE.VARIENT_BY_SHOP_ID(action.payload.shopId);
    if (response.data && response.data != null && response1.data && response1.data != null) {
        var data = []
        for (var i = 0; i < action.payload.to; i++) {
            var data1 = []
            var data2 = []
            data1.push(response.data[i])
            for (var j = 0; j < response1.data.length; j++) {
                if (response.data[i].id == response1.data[j].productId) {
                    data2.push(response1.data[j])
                }
            }
            data1[0].itemList = data2
            data.push(data1[0])
        }
        yield put({
            type: ProductActions.SET_PRODUCT_VARIANT_ASYNC,
            payload: data
        });
    }
}

export function* fetchProductByShopId() {
    yield takeEvery(ProductActions.GET_BY_SHOP_ID, fetchProductByShopIdAsync);
}

export function* setProductVariant() {
    yield takeEvery(ProductActions.SET_PRODUCT_VARIANT, setProductVariantAsync);
}

export default function* rootSaga() {
    yield all([
        fork(fetchProductByShopId),
        fork(setProductVariant)
    ])
}