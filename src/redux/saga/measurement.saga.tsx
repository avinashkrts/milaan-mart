import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { prepareErrorMessage } from '../action/Common';
import { MeasurementActions } from '../action/constants';
import { MEASUREMENT_SERVICE } from '../service/measurement.services';

export function* fetchMeasurementByShopIdAsync(action) {
    let response = yield MEASUREMENT_SERVICE.MEASUREMENT_BY_SHOP_ID(action.payload);
    if (response.data && response.data != null) {
        yield put({
            type: MeasurementActions.GET_BY_SHOP_ID_ASYNC,
            payload: response.data
        });
    } else {
        yield put(prepareErrorMessage(MeasurementActions.MEASUREMENT_ERROR, response));
    }
}

export function* fetchMeasurementByShopId() {
    yield takeEvery(MeasurementActions.GET_BY_SHOP_ID, fetchMeasurementByShopIdAsync);
}

export default function* rootSaga() {
    yield all([
        fork(fetchMeasurementByShopId)
    ])
}