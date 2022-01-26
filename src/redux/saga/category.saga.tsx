import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { prepareErrorMessage } from '../action/Common';
import { CategoryActions } from '../action/constants';
import { CATEGORY_SERVICE } from '../service/category.services';

export function* fetchCategoryByShopIdAsync(action: any) {
    let response = yield CATEGORY_SERVICE.CATEGORY_BY_SHOP_ID(action.payload);
        if (response.data && response.data != null) {
        yield put({
            type: CategoryActions.GET_BY_SHOP_ID_ASYNC,
            payload: response.data
        });
    } else {
        yield put(prepareErrorMessage(CategoryActions.CATEGORY_ERROR, response));
    }
}

export function* fetchCategoryByShopId() {
    yield takeEvery(CategoryActions.GET_BY_SHOP_ID, fetchCategoryByShopIdAsync);
}

export default function* rootSaga() {
    yield all([
        fork(fetchCategoryByShopId)
    ])
}