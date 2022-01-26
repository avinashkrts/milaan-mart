import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { prepareErrorMessage } from '../action/Common';
import { BrandActions } from '../action/constants';
import { BRAND_SERVICE} from '../service/brand.services';

export function* fetchBrandByShopIdAsync(action: any) {
    let response = yield BRAND_SERVICE.BRAND_BY_SHOP_ID(action.payload);
    if (response.data && response.data != null) {
        yield put({
            type: BrandActions.GET_BY_SHOP_ID_ASYNC,
            payload: response.data
        });
    } else {
        yield put(prepareErrorMessage(BrandActions.BRAND_ERROR, response));
    }
}

export function* fetchBrandByShopId() {
    yield takeEvery(BrandActions.GET_BY_SHOP_ID, fetchBrandByShopIdAsync);
}

export default function* rootSaga() {
    yield all([
        fork(fetchBrandByShopId)
    ])
}