import { combineReducers } from 'redux';
import ProductReducers from './product.reducers';
import BrandReducers from './brand.reducers';
import UserReducers from './user.reducers';
import VarientReducers from './varient.reducers';
import MeasurementReducers from './measurement.reducers';
import CartReducers from './cart.reducers';
import CategoryReducers from './category.reducers';

const rootReducer = combineReducers({
    productReducers: ProductReducers,
    brandReducers: BrandReducers,
    varientReducers: VarientReducers,
    userReducers: UserReducers,
    measurementReducers: MeasurementReducers,
    categoryReducers: CategoryReducers,
    cartReducers: CartReducers
})

export default rootReducer;