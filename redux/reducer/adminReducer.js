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
    user: null,
    setting: {}
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
            if (user.mode === MODE.exhibitor) {
                const data = state.exhibitor.data.map(e => {
                    if (e._id === user._id) {
                        console.log(e);
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
                        console.log(e);
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
        case types.ADMIN_UPDATE_LAYOUT_SUCCESS: {
            const data = state.layout.data.map(p => {
                if (p._id === action.payload._id) return action.payload;
                return (p);
            });
            return {
                ...state,
                layout: {
                    ...state.layout,
                    data
                }
            };
        }

        case types.ADMIN_GET_SETTING_SUCCESS: {
            const { data } = action.payload
            return {
                ...state,
                setting: data || {}
            };
        }
        case types.ADMIN_UPDATE_SETTING_SUCCESS: {
            const { data } = action.payload
            return {
                ...state,
                setting: data || {}
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;