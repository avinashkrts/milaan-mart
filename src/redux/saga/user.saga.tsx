import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { prepareErrorMessage } from '../action/Common';
import { UserActions } from '../action/constants';
import { USER_SERVICE } from '../service/user.services';

export function* fetchUserByIdAsync(action) {
    let response = yield USER_SERVICE.USER_BY_ID(action.payload);
    if (response.data && response.data != null) {
        yield put({
            type: UserActions.GET_BY_ID_ASYNC,
            payload: response.data
        });
    } else {
        yield put(prepareErrorMessage(UserActions.USER_ERROR, response));
    }
}

export function* fetchUserById() {
    yield takeEvery(UserActions.GET_BY_ID, fetchUserByIdAsync);
}

export default function* rootSaga() {
    yield all([
        fork(fetchUserById)
    ])
}