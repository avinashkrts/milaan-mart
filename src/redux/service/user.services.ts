import axios from 'axios';
import { USER_API } from '../config/api.config';

const userById = (id) => axios.get(USER_API.GET_BY_ID + id)
    .then((data) => data,
        (error) => error)

export const USER_SERVICE = {
    USER_BY_ID: userById
}