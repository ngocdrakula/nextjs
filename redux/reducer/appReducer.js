import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'

export const initState = {
    products: [],
    page: 0,
    total: 0,
    rooms: [],
    layouts: [],
    sizes: [],
    fronts: [],
    layout: null,
    areaIndex: -1,

}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return { ...initState, ...state, ...action.payload.app, products: state.products };
        }
        case types.GET_PRODUCTS_SUCCESS: {
            const { data, total, page } = action.payload;
            return {
                ...state,
                products: page ? [...state.products, ...data] : data,
                page,
                total
            };
        }
        case types.GET_FRONTS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                fronts: data,
            };
        }
        case types.GET_FRONTS_FAILED: {
            return {
                ...state,
                fronts: [],
            };
        }
        case types.FRONTS_SELECT_ALL: {
            return {
                ...state,
                fronts: state.fronts.map(front => ({ ...front, uncheck: false }))
            };
        }
        case types.FRONTS_CLEAR_ALL: {
            return {
                ...state,
                fronts: state.fronts.map(front => ({ ...front, uncheck: true })),
            };
        }
        case types.FRONTS_SELECT_ONE: {
            const current = state.fronts[action.payload];
            if (current) {
                state.fronts[action.payload] = { ...current, uncheck: !current.uncheck };
                return {
                    ...state,
                    fronts: [...state.fronts],
                };
            }
        }
        case types.FRONTS_REVERSE: {
            return {
                ...state,
                fronts: state.fronts.map(front => ({ ...front, uncheck: !front.uncheck })),
            };
        }
        case types.GET_SIZES_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                sizes: data,
            };
        }
        case types.SIZES_SELECT_ALL: {
            return {
                ...state,
                sizes: state.sizes.map(size => ({ ...size, uncheck: false }))
            };
        }
        case types.SIZES_CLEAR_ALL: {
            return {
                ...state,
                sizes: state.sizes.map(size => ({ ...size, uncheck: true }))
            };
        }
        case types.SIZES_SELECT_ONE: {
            const current = state.sizes[action.payload];
            if (current) {
                state.sizes[action.payload] = { ...current, uncheck: !current.uncheck };
                return {
                    ...state,
                    sizes: [...state.sizes],
                };
            }
        }
        case types.SIZES_REVERSE: {
            return {
                ...state,
                sizes: state.sizes.map(size => ({ ...size, uncheck: !size.uncheck })),
            };
        }
        case types.GET_ROOMS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                rooms: data,
            };
        }
        case types.GET_LAYOUTS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                layouts: data,
            };
        }
        case types.ROOMS_SELECT_ALL: {
            return {
                ...state,
                rooms: state.rooms.map(room => ({ ...room, uncheck: false }))
            };
        }
        case types.ROOMS_CLEAR_ALL: {
            return {
                ...state,
                rooms: state.rooms.map(room => ({ ...room, uncheck: true }))
            };
        }
        case types.ROOMS_SELECT_ONE: {
            const current = state.rooms[action.payload];
            if (current) {
                state.rooms[action.payload] = { ...current, uncheck: !current.uncheck };
                return {
                    ...state,
                    rooms: [...state.rooms],
                };
            }
        }
        case types.ROOMS_REVERSE: {
            return {
                ...state,
                rooms: state.rooms.map(room => ({ ...room, uncheck: !room.uncheck })),
            };
        }
        case types.CHANGE_SORT: {
            state.products.sort((p1, p2) => {
                if (action.payload === 0) {//a-z 
                    var nameA = p1.name.toUpperCase();
                    var nameB = p2.name.toUpperCase();
                    if (nameA > nameB) return 1;
                    else if (nameA < nameB) return -1;
                    return 0;
                }
                if (action.payload === 1) { //z-a
                    var nameA = p1.name.toUpperCase();
                    var nameB = p2.name.toUpperCase();
                    if (nameA < nameB) return 1;
                    else if (nameA > nameB) return -1;
                    return 0;
                }
                var date1 = Date.parse(p1.createdAt);
                var date2 = Date.parse(p2.createdAt);
                if (action.payload === 2) {
                    return (date1 - date2);//new
                }
                return (date2 - date1);//old
            })
            return {
                ...state,
                products: [...state.products],
                sortType: action.payload
            };
        }

        case types.CHANGE_SEARCH: {
            return {
                ...state,
                search: action.payload
            }
        }

        case types.HIDE_TOPPANEL: {
            return {
                ...state,
                visible: !state.visible,
            };
        }
        case types.SELECT_LAYOUT: {
            const layout = state.layouts.find(l => l._id === action.payload) || state.layouts[0] || null;
            return {
                ...state,
                layout,
            };
        }

        case types.SELECT_AREA: {
            return {
                ...state,
                areaIndex: action.payload,
                visible: true
            };
        }
        case types.SELECT_PRODUCT: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                if (layout.areas[areaIndex].custom || layout.areas[areaIndex].customRotate) {
                    layout.areas[areaIndex].product = action.payload;
                }
                else {
                    layout.areas[areaIndex].products = [action.payload];
                }
            }
            return {
                ...state,
                layout,
                visible: false
            };
        }
        case types.SELECT_FIRST_PRODUCT: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].products = [...layout.areas[areaIndex].products];
                layout.areas[areaIndex].products[0] = action.payload;
            }
            return {
                ...state,
                layout,
                visible: false
            };
        }
        case types.SELECT_SECOND_PRODUCT: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].products = [...layout.areas[areaIndex].products];
                if (layout.areas[areaIndex].products[1]) layout.areas[areaIndex].products[1] = action.payload;
                else layout.areas[areaIndex].products.push(action.payload)
            }
            return {
                ...state,
                layout,
                visible: false
            };
        }
        case types.CHANGE_GROUT: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].grout = action.payload;
            }
            return {
                ...state,
                layout
            };
        }
        case types.CHANGE_COLOR: {
            const { areaIndex, layout } = state;
            if (layout && areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].color = action.payload;
            }
            return {
                ...state,
                layout: layout ? { ...layout } : null
            };
        }
        case types.CHANGE_CUSTOM: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].custom = action.payload;
            }
            return {
                ...state,
                layout
            };
        }
        case types.CHANGE_CUSTOM_ROTATE: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].customRotate = action.payload;
            }
            return {
                ...state,
                layout
            };
        }
        case types.CHANGE_SKEW_TYPE: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].skewType = action.payload;
                layout.areas[areaIndex].skewValue = 1 / 2;
            }
            return {
                ...state,
                layout
            };
        }
        case types.CHANGE_SKEW_VALUE: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].skewValue = action.payload;
            }
            return {
                ...state,
                layout
            };
        }
        case types.CHANGE_ROTATE: {
            const { areaIndex, layout: { ...layout } } = state;
            if (areaIndex + 1) {
                layout.areas = [...layout.areas];
                layout.areas[areaIndex] = { ...layout.areas[areaIndex] };
                layout.areas[areaIndex].rotate = action.payload;
            }
            return {
                ...state,
                layout
            };
        }
        case types.PROGRESS_UPDATE: {
            return {
                ...state,
                progress: true
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;