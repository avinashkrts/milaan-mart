import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { prepareErrorMessage } from '../action/Common';
import { VarientActions } from '../action/constants';
import { VARIENT_SERVICE } from '../service/varient.services';

export function* fetchVarientByShopIdAsync(action) {
    let response = yield VARIENT_SERVICE.VARIENT_BY_SHOP_ID(action.payload);
    if (response.data && response.data != null) {
        yield put({
            type: VarientActions.GET_BY_SHOP_ID_ASYNC,
            payload: response.data
        });
    } else {
        yield put(prepareErrorMessage(VarientActions.VARIENT_ERROR, response));
    }
}

export function* fetchVarientByShopId() {
    yield takeEvery(VarientActions.GET_BY_SHOP_ID, fetchVarientByShopIdAsync);
}

export default function* rootSaga() {
    yield all([
        fork(fetchVarientByShopId)
    ])
}