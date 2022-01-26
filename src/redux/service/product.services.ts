import axios from 'axios';
import { PRODUCT_API } from '../config/api.config';

const productByShopId = (shopId) => axios.get(PRODUCT_API.GET_BY_SHOP_ID + shopId)
    .then((data) => data,
        (error) => error)

export const PRODUCT_SERVICE = {
    PRODUCT_BY_SHOP_ID: productByShopId
}