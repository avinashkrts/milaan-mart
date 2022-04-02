import { AppConstants } from "../constants";

export const PRODUCT_API = Object.freeze({
    GET_BY_SHOP_ID: AppConstants.API_BASE_URL + "/api/item/getall/productonline/byshopid/",
    GET_BY_CATEGORY_ID: AppConstants.API_BASE_URL + "/api/item/get/onlinecategory/",
    GET_BY_ID: AppConstants.API_BASE_URL + "/api/item/get/"
})