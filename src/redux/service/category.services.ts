import axios from 'axios';
import { CATEGORY_API } from '../config/api.config';

const categoryByShopId = (shopId: String) => axios.get(CATEGORY_API.GET_BY_SHOP_ID + shopId)
    .then((data) => data,
        (error) => error)

export const CATEGORY_SERVICE = {
    CATEGORY_BY_SHOP_ID: categoryByShopId
}