import { AppConstants } from "../../constants";

export const PRODUCT_API = Object.freeze({
    GET_BY_SHOP_ID: AppConstants.API_BASE_URL + "/api/item/getbyshopid/"
})

export const BRAND_API = Object.freeze({
    GET_BY_SHOP_ID: AppConstants.API_BASE_URL + "/api/brand/getbrandbyshopid/"
})

export const USER_API = Object.freeze({
    GET_BY_ID: AppConstants.API_BASE_URL + "/api/user/get/"
})

export const VARIENT_API = Object.freeze({
    GET_BY_SHOP_ID: AppConstants.API_BASE_URL + "/api/itemlist/getbyshopid/"
})

export const MEASUREMENT_API = Object.freeze({
    GET_BY_SHOP_ID: AppConstants.API_BASE_URL + "/api/measurement/getbyshopid/"
})

export const CART_API = Object.freeze({
    GET_BY_SHOP_ID_USER_ID: AppConstants.API_BASE_URL + "/api/cart/get/cartby/shopid/userid/"
})

export const CATEGORY_API = Object.freeze({
    GET_BY_SHOP_ID: AppConstants.API_BASE_URL + "/api/category/getcategoryforuserbyshopid/"
})