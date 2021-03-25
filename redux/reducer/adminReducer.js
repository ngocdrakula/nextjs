import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'

export const initState = {
    products: [],
    rooms: [],
    layouts: [],
    sizes: [],
    fronts: [],
    page: 0,
    total: 0
}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return { ...initState, ...state, ...action.payload.admin };
        }
        case types.ADMIN_GET_PRODUCTS_SUCCESS: {
            const { data, total, page } = action.payload;
            return {
                ...state,
                products: page ? [...state.products, ...data] : data,
                page,
                total
            };
        }
        case types.ADMIN_GET_FRONTS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                fronts: data,
            };
        }
        case types.ADMIN_GET_FRONTS_FAILED: {
            return state
        }
        case types.ADMIN_GET_SIZES_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                sizes: data,
            };
        }
        case types.ADMIN_GET_ROOMS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                rooms: data,
            };
        }
        case types.ADMIN_GET_LAYOUTS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                layouts: data,
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;