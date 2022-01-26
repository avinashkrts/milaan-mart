import { UserActions } from "../action/constants";

const INITIAL_STATE = {
    userData: []
}

const UserReducers = (states = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActions.GET_BY_ID_ASYNC:
            return ({
                ...states,
                userData: action.payload
            });
        default:
            return states;
    }
}

export default UserReducers;