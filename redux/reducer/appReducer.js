import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'

export const initState = {
    products: [],
    page: 0,
    total: 0,
    rooms: [],
    layouts: [],
    layoutSelected: null,
    sizes: [],
    fronts: [],
    locations: [{ _id: 0, name: 'Phòng khách', outSide: false }, { _id: 1, name: 'Khác', outSide: true }],
    areas: [],
    areaIndex: 0,
    grout: 2,
    groutColor: '#FFF',
    skewType: 0,
    skewValue: 0,
    rotate: 0,
    sortType: 2,

}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return { ...initState, ...state, ...action.payload.app };
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
            const current = state.fronts[index];
            current = { ...current, uncheck: !current.uncheck };
            return {
                ...state,
                fronts: [...state.fronts],
            };
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
            const current = state.sizes[index];
            current = { ...current, uncheck: !current.uncheck };
            return {
                ...state,
                sizes: [...state.sizes],
            };
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
                layoutSelected: data[0],
                areas: data[0] && data[0].areas || []
            };
        }
        case types.GET_LOCATIONS_SUCCESS: {
            return {
                ...state,
                locations: [{ _id: 0, name: 'Phòng khách', outSide: false }, { _id: 1, name: 'Khác', outSide: true }],
            };
        }
        case types.LOCATIONS_SELECT_ALL: {
            return {
                ...state,
                locations: state.locations.map(location => ({ ...location, uncheck: false }))
            };
        }
        case types.LOCATIONS_CLEAR_ALL: {
            return {
                ...state,
                locations: state.locations.map(location => ({ ...location, uncheck: true }))
            };
        }
        case types.LOCATIONS_SELECT_ONE: {
            const current = state.locations[index];
            current = { ...current, uncheck: !current.uncheck };
            return {
                ...state,
                locations: [...state.locations],
            };
        }
        case types.LOCATIONS_REVERSE: {
            return {
                ...state,
                locations: state.locations.map(location => ({ ...location, uncheck: !location.uncheck })),
            };
        }
        case types.CHANGE_GROUT: {
            return {
                ...state,
                grout: action.payload,
            };
        }
        case types.CHANGE_COLOR: {
            return {
                ...state,
                groutColor: action.payload,
            };
        }
        case types.CHANGE_SKEW_TYPE: {
            return {
                ...state,
                skewType: action.payload,
            };
        }
        case types.CHANGE_SKEW_VALUE: {
            return {
                ...state,
                skewValue: action.payload,
            };
        }
        case types.CHANGE_ROTATE: {
            return {
                ...state,
                rotate: action.payload,
            };
        }
        case types.CHANGE_SORT: {
            return {
                ...state,
                products: state.products.sort((p1, p2) => {
                    if (action.payload === 0) return (p1.name - p2.name);//a-z 
                    if (action.payload === 1) return (p2.name - p1.name);//z-a
                    if (action.payload === 2) return (p1.createdAt - p2.createdAt);//new
                    return (p2.createdAt - p1.createdAt);//old
                }),
                sortType: action.payload
            };
        }

        case types.SELECT_LAYOUT: {
            return {
                ...state,
                layoutSelected: action.payload,
                areas: action.payload.areas || []
            };
        }
        case types.SELECT_AREA: {
            return {
                ...state,
                areaIndex: action.payload
            };
        }
        case types.SELECT_PRODUCT: {
            state.areas[state.areaIndex] = {
                ...state.areas[state.areaIndex],
                products: [action.payload, ...state.areas[state.areaIndex].products].splice(2)
            };

            return {
                ...state,
                areas: [...state.areas]
            };
        }
        case types.SELECT_FIRST_PRODUCT: {
            state.areas[state.areaIndex].products[0] = { ...action.payload };
            state.areas[state.areaIndex] = {
                ...state.areas[state.areaIndex],
                products: [...state.areas[state.areaIndex].products]
            };
            return {
                ...state,
                areas: [...state.areas]
            };
        }
        case types.SELECT_SECOND_PRODUCT: {
            if (state.areas.length < 2) {
                state.areas[state.areaIndex] = {
                    ...state.areas[state.areaIndex],
                    products: [...state.areas[state.areaIndex].products, { ...action.payload }]
                };
            } else {
                state.areas[state.areaIndex].products[1] = { ...action.payload };
                state.areas[state.areaIndex] = {
                    ...state.areas[state.areaIndex],
                    products: [...state.areas[state.areaIndex].products]
                };
            }
            return {
                ...state,
                areas: [...state.areas]
            };
        }

        default: {
            return state;
        }
    }
};

export default appReducer;