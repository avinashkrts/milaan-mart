import axios from 'axios';
import { VARIENT_API } from '../config/api.config';

const varientByShopId = (shopId: String) => axios.get(VARIENT_API.GET_BY_SHOP_ID + shopId)
    .then((data) => data,
        (error) => error)

export const VARIENT_SERVICE = {
    VARIENT_BY_SHOP_ID: varientByShopId
}