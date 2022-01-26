import axios from 'axios';
import { MEASUREMENT_API } from '../config/api.config';

const measurementByShopId = (shopId) => axios.get(MEASUREMENT_API.GET_BY_SHOP_ID + shopId)
    .then((data) => data,
        (error) => error)

export const MEASUREMENT_SERVICE = {
    MEASUREMENT_BY_SHOP_ID: measurementByShopId
}