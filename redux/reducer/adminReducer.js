import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'

export const initState = {
    product: { data: [], page: 0, total: 0 },
    room: { data: [], page: 0, total: 0 },
    layout: { data: [], page: 0, total: 0 },
    size: { data: [], page: 0, total: 0 },
    front: { data: [], page: 0, total: 0 },
    locations: [{ _id: 0, name: 'Phòng khách', outSide: false }, { _id: 1, name: 'Khác', outSide: true }],
    user: null
}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return { ...initState, ...state, ...action.payload.admin };
        }
        case types.ADMIN_LOGIN_SUCCESS: {
            return {
                ...state,
                user: action.payload
            };
        }
        case types.ADMIN_LOGIN_FAILED: {
            return {
                ...state,
                user: null, 
            };
        }
        case types.ADMIN_LOGOUT_SUCCESS: {
            return {
                ...state,
                user: null,
            };
        }

        case types.ADMIN_GET_PRODUCTS_SUCCESS: {
            return {
                ...state,
                product: action.payload
            };
        }

        case types.ADMIN_UPDATE_PRODUCT_SUCCESS: {
            const data = state.product.data.map(p => {
                if (p._id === action.payload._id) return action.payload;
                return (p);
            });
            return {
                ...state,
                product: {
                    ...state.product,
                    data
                }
            };
        }
        case types.ADMIN_GET_FRONTS_SUCCESS: {
            return {
                ...state,
                front: action.payload
            };
        }
        case types.ADMIN_GET_FRONTS_FAILED: {
            return state
        }
        case types.ADMIN_GET_SIZES_SUCCESS: {
            return {
                ...state,
                size: action.payload
            };
        }
        case types.ADMIN_UPDATE_SIZE_SUCCESS: {
            const data = state.size.data.map(p => {
                if (p._id === action.payload._id) return action.payload;
                return (p);
            });
            return {
                ...state,
                size: {
                    ...state.size,
                    data
                }
            };
        }
        case types.ADMIN_GET_ROOMS_SUCCESS: {
            return {
                ...state,
                room: action.payload
            };
        }
        case types.ADMIN_GET_LAYOUTS_SUCCESS: {
            return {
                ...state,
                layout: action.payload
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;