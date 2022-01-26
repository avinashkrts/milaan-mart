import { MeasurementActions } from "../action/constants";

const INITIAL_STATE = {
    measurementData: {}
}

const MeasurementReducers = (states = INITIAL_STATE, action) => {
    switch (action.type) {
        case MeasurementActions.GET_BY_SHOP_ID_ASYNC:
            return ({
                ...states,
                measurementData: action.payload
            });
        default:
            return states;
    }
}

export default MeasurementReducers;