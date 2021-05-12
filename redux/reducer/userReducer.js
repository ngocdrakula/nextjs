import types from '../types';
import { HYDRATE } from 'next-redux-wrapper';

export const initState = {
    designs: [],
    page: 0,
    total: 0,
    user: null
}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return { ...initState, ...state, ...action.payload.user };
        }
        case types.USER_LOGIN_SUCCESS: {
            return {
                ...state,
                user: action.payload,
            };
        }
        case types.ADMIN_LOGOUT_SUCCESS: {
            return {
                ...state,
                user: null,
            };
        }
        case types.USER_GET_DESIGN_SUCCESS: {
            const { data, total, page } = action.payload;
            return {
                ...state,
                designs: page ? [...state.designs, ...data] : data,
                page,
                total
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;