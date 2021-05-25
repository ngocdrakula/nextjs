import types from '../types';
import { HYDRATE } from 'next-redux-wrapper';

export const initState = {
    designs: [],
    page: 0,
    total: 0,
    user: null,
    error: null,
    design: null,
}
const userReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            const { designs, user, page, total } = state;
            return { ...initState, ...action.payload.user, designs, user, page, total };
        }
        case types.USER_LOGIN_SUCCESS: {
            return {
                ...state,
                user: action.payload,
            };
        }
        case types.USER_LOGOUT_SUCCESS: {
            return {
                ...state,
                user: null,
            };
        }
        case types.USER_GET_DESIGN_SUCCESS: {
            return {
                ...state,
                design: action.payload,
            };
        }
        case types.USER_GET_DESIGN_FAILED: {
            return {
                ...state,
                error: action.payload || true,
            };
        }
        case types.USER_GET_MY_DESIGN_SUCCESS: {
            const { data, total, page } = action.payload;
            return {
                ...state,
                designs: page ? [...state.designs, ...data] : data,
                page,
                total
            };
        }
        case types.USER_ADD_DESIGN_SUCCESS: {
            return {
                ...state,
                designs: [action.payload, ...state.designs],
            };
        }
        case types.USER_UPDATE_DESIGN_SUCCESS: {
            return {
                ...state,
                designs: state.designs.map(d => {
                    if (d._id === action.payload._id) return (action.payload);
                    return (d)
                }),
            };
        }
        case types.USER_DELETE_DESIGN: {
            return {
                ...state,
                designs: state.designs.filter(d => d._id !== action.payload),
            };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;