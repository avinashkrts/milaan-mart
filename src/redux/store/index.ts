import allReducers from '../reducer';
import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import createSagaMiddleware, {SagaMiddleware} from "redux-saga";
import rootSaga from "../saga";
import { AppActions } from '../interfaces';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

export type AppState = ReturnType<typeof allReducers>;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk as ThunkMiddleware<AppState, AppActions>, sagaMiddleware as SagaMiddleware<AppState>];
const persistedReducer = persistReducer(persistConfig, allReducers);
const store = createStore(
    persistedReducer,
    applyMiddleware(...middlewares)
)
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store)

export default store;