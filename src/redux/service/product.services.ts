import axios from 'axios';
import { PRODUCT_API } from '../config/api.config';

const productByShopId = (shopId: String) => axios.get(PRODUCT_API.GET_BY_SHOP_ID + shopId + '/true')
    .then((data) => data,
        (error) => error)

const productByCategoryId = (categoryId: any) => axios.get(PRODUCT_API.GET_BY_CATEGORY_ID + categoryId + '/true')
    .then((data) => data,
        (error) => error)

export const PRODUCT_SERVICE = {
    PRODUCT_BY_SHOP_ID: productByShopId,
    PRODUCT_BY_CATEGORY_ID: productByCategoryId
}