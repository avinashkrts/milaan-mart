import axios from 'axios';
import { BRAND_API } from '../config/api.config';

const brandByShopId = (shopId: String) => axios.get(BRAND_API.GET_BY_SHOP_ID + shopId)
    .then((data) => data,
        (error) => error)

export const BRAND_SERVICE = {
    BRAND_BY_SHOP_ID: brandByShopId
}