import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'
import { MODE } from '../../utils/helper';

export const initState = {
    product: { data: [], page: 0, total: 0 },
    room: { data: [], page: 0, total: 0 },
    layout: { data: [], page: 0, total: 0 },
    visitor: { data: [], page: 0, total: 0 },
    exhibitor: { data: [], page: 0, total: 0 },
    industries: [],
    categories: [],
    user: null,
    setting: {},
    exUser: null
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
                exUser: null
            };
        }
        case types.ADMIN_LOGOUT_SUCCESS: {
            return {
                ...state,
                exUser: null
            };
        }

        case types.ADMIN_GET_EXHIBITOR_SUCCESS: {
            return {
                ...state,
                exhibitor: action.payload
            };
        }
        case types.ADMIN_GET_VISITOR_SUCCESS: {
            return {
                ...state,
                visitor: action.payload
            };
        }
        case types.SET_TOOLTIP: {
            return {
                ...state,
                tooltip: action.payload
            };
        }

        case types.ADMIN_UPDATE_USER_SUCCESS: {
            const user = action.payload.data;
            if (state.exUser?._id === user._id) {
                state.exUser = user;
            }
            if (user.mode === MODE.exhibitor) {
                const data = state.exhibitor.data.map(e => {
                    if (e._id === user._id) {
                        return user;
                    }
                    return (e);
                });
                return {
                    ...state,
                    exhibitor: {
                        ...state.exhibitor,
                        data
                    }
                };
            }
            else {
                const data = state.visitor.data.map(e => {
                    if (e._id === user._id) {
                        return user;
                    }
                    return (e);
                });
                return {
                    ...state,
                    visitor: {
                        ...state.visitor,
                        data
                    }
                };
            }
        }
        case types.ADMIN_GET_INDUSTRIES_SUCCESS: {
            return {
                ...state,
                industries: action.payload.data
            };
        }
        case types.ADMIN_UPDATE_INDUSTRY_SUCCESS: {
            const industries = state.industries.map(i => {
                if (i._id === action.payload._id) return action.payload;
                return (i);
            });
            return {
                ...state,
                industries
            };
        }
        
        case types.ADMIN_GET_CATEGORIES_SUCCESS: {
            return {
                ...state,
                categories: action.payload.data
            };
        }
        case types.ADMIN_UPDATE_CATEGORY_SUCCESS: {
            const categories = state.categories.map(i => {
                if (i._id === action.payload._id) return action.payload;
                return (i);
            });
            return {
                ...state,
                categories
            };
        }

        case types.ADMIN_GET_USER_SUCCESS: {
            return {
                ...state,
                exUser: action.payload.data,
            };
        }
        case types.ADMIN_EXHIBITOR_LOGOUT: {
            return {
                ...state,
                exUser: null,
                user: state.user.mode === MODE.admin ? state.user : null
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
        case types.ADMIN_GET_EXHIBITOR_FAILED: {
            return state
        }
        default: {
            return state;
        }
    }
};

export default appReducer;