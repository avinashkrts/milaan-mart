import axios from "axios";
import { PRODUCT_API } from "./api.config";

const productById = (id: any) => axios.get(PRODUCT_API.GET_BY_ID + id)
    .then((data) => data,
        (error) => error)

export const PRODUCT_SERVICE = {
    PRODUCT_BY_ID: productById
}