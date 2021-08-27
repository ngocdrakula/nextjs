import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'

export const initState = {
    industries: [],
    exhibitors: [],
    visitors: [],
    user: null,
    openMessage: false,
    openList: true,
    newMessage: 0,
    conversations: [],
    conversationsAll: [],
    total: 0,
    page: 0,
}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return { ...initState, ...state, ...action.payload.app, categories: state.categories };
        }
        case types.GET_INDUSTRIES_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                industries: data,
            };
        }
        case types.GET_EXHIBITORS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                exhibitors: data,
            };
        }
        case types.GET_VISITORS_SUCCESS: {
            const { data } = action.payload;
            return {
                ...state,
                visitors: data
            };
        }
        case types.OPENFORM: {
            return {
                ...state,
                openForm: action.payload
            };
        }
        case types.USER_LOGIN_SUCCESS: {
            return {
                ...state,
                user: action.payload,
                openForm: null
            };
        }
        case types.USER_LOGOUT_SUCCESS: {
            return {
                ...state,
                user: null,
            };
        }
        case types.USER_REGISTER_SUCCESS: {
            return {
                ...state,
                user: action.payload,
                openForm: null
            };
        }
        case types.GET_USER_SUCCESS: {
            return {
                ...state,
                user: action.payload.data?._id === state.user._id ? action.payload.data : state.user,
            };
        }
        case types.OPEN_MESSAGE: {
            return {
                ...state,
                openMessage: !state.openMessage,
            };
        }
        case types.OPEN_LIST: {
            return {
                ...state,
                openList: state.conId ? !state.openList : true,
            };
        }
        case types.GET_CONVERSATIONS_SUCCESS: {
            const { data, total, page, totalNew } = action.payload;
            data.map(c => { if (!state.conversationsAll.find(con => con._id === c._id)) state.conversationsAll.push(c) })
            return {
                ...state,
                conversations: page === 0 ? data : [...state.conversations, ...data],
                page,
                total,
                newMessage: totalNew
            };
        }
        case types.GET_ONE_CONVERSATION_SUCCESS: {
            const con = action.payload.data;
            const index = state.conversations.findIndex(c => c._id === con._id)
            const indexAll = state.conversationsAll.findIndex(c => c._id === con._id)
            if (index + 1 && indexAll + 1) {
                state.conversations[index] = con
                state.conversationsAll[indexAll] = con
            }
            else {
                state.conversations.push(con)
                state.conversationsAll.push(con)
            }
            return {
                ...state,
                conversations: [...state.conversations],
                conId: con._id,
                openList: false
            };
        }
        case types.GET_CONVERSATION_TO_SUCCESS: {
            const con = action.payload.data;
            const index = state.conversations.findIndex(c => c._id === con._id)
            const indexAll = state.conversationsAll.findIndex(c => c._id === con._id)
            if (index + 1 && indexAll + 1) {
                state.conversations[index] = con
                state.conversationsAll[indexAll] = con
            }
            else {
                state.conversations.push(con)
                state.conversationsAll.push(con)
            }
            return {
                ...state,
                conversations: [...state.conversations],
                conId: con._id,
                openList: false
            };
        }
        case types.SEND_MESSAGE_SUCCESS: {
            const { data, conversationCreated, conversationId } = action.payload;
            const index = state.conversations.findIndex(c => c._id === conversationId);
            const indexAll = state.conversationsAll.findIndex(c => c._id === conversationId)
            if (index + 1 && indexAll + 1) {
                state.conversations[index].messages.push(data)
                state.conversationsAll[indexAll].messages.push(data)
            }
            else if (conversationCreated) {
                state.conversations.push(conversationCreated)
                state.conversationsAll.push(conversationCreated)
            }
            return {
                ...state,
                conversations: [...state.conversations],
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;