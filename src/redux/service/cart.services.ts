import axios from 'axios';
import { CART_API } from '../config/api.config';

const cartByShopIdUserId = (payload) => axios.get(CART_API.GET_BY_SHOP_ID_USER_ID + payload.shopId + '/' + payload.userId)
    .then((data) => data,
        (error) => error)

export const CART_SERVICE = {
    CART_BY_SHOP_ID_USER_ID: cartByShopIdUserId
}