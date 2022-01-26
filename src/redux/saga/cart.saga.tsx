import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { prepareErrorMessage } from '../action/Common';
import { CartActions } from '../action/constants';
import { CART_SERVICE } from '../service/cart.services';

export function* fetchCartByShopIdUserIdAsync(action) {
    let response = yield CART_SERVICE.CART_BY_SHOP_ID_USER_ID(action.payload);
    if (response.data && response.data != null) {
        yield put({
            type: CartActions.GET_BY_SHOP_ID_USER_ID_ASYNC,
            payload: response.data
        });
    } else {
        yield put(prepareErrorMessage(CartActions.CART_ERROR, response));
    }
}

export function* fetchCartByShopIdUserId() {
    yield takeEvery(CartActions.GET_BY_SHOP_ID_USER_ID, fetchCartByShopIdUserIdAsync);
}

export default function* rootSaga() {
    yield all([
        fork(fetchCartByShopIdUserId)
    ])
}