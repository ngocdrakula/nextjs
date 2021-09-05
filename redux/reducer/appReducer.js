import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'

export const initState = {
    industries: [],
    exhibitors: [],
    visitors: [],
    user: null,
    openMessage: true,
    openList: true,
    newMessage: 0,
    conversations: [],
    conversationsAll: [],
    total: 0,
    page: 0,
    hydrate: false,
    categories: [],
    setting: {}
}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...initState,
                ...state,
                ...action.payload.app,
                conversations: state.conversations.length ? state.conversations : action.payload.app.conversations,
                conversationsAll: state.conversationsAll.length ? state.conversationsAll : action.payload.app.conversationsAll,
                user: state.user || action.payload.app.user,
                total: state.total || action.payload.app.total,
                page: state.page || action.payload.app.page,
                openMessage: state.openMessage || action.payload.app.openMessage,
                openList: state.user ? state.openList : action.payload.app.openList,
                newMessage: state.user ? state.newMessage : action.payload.app.newMessage,
            };
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
                ...initState,
                industries: state.industries,
                exhibitors: state.exhibitors,
                visitors: state.visitors,
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
                openList: true
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
            data.map(c => {
                if (page > 0 && !state.conversations.find(con => con._id === c._id)) state.conversations.push(c)
                if (!state.conversationsAll.find(con => con._id === c._id)) state.conversationsAll.push(c)
            })
            return {
                ...state,
                conversations: page === 0 ? data : [...state.conversations],
                conversationsAll: [...state.conversationsAll],
                page,
                total,
                newMessage: totalNew
            };
        }
        case types.SELECT_CONVERSATION: {
            return {
                ...state,
                conId: action.payload,
                openList: false
            };
        }
        case types.GET_ONE_CONVERSATION_SUCCESS: {
            const { data, currentPage } = action.payload;
            const loadAll = !data.messages.length;
            const index = state.conversations.findIndex(c => c._id === data._id)
            const indexAll = state.conversationsAll.findIndex(c => c._id === data._id);
            const conNew = { ...data, currentPage, loadAll }
            if (index + 1) {
                if (!currentPage) {
                    state.conversations[index] = conNew;
                }
            }
            else {
                state.conversations = [conNew, ...state.conversations]
            }
            if (indexAll + 1) {
                if (state.conversationsAll[indexAll].currentPage >= 0) {
                    const messagesNew = conNew.messages.filter(c => !state.conversationsAll[index].messages.find(con => con._id === c._id));
                    if (currentPage > 0) {
                        state.conversationsAll[index].messages = [...state.conversationsAll[index].messages, ...messagesNew];
                    }
                    else {
                        state.conversationsAll[index].messages = [...messagesNew, ...state.conversationsAll[index].messages];
                    }
                }
                else {
                    state.conversationsAll[indexAll] = { ...data, currentPage }
                }
                state.conversationsAll[indexAll].leader = data.leader;
                state.conversationsAll[indexAll].member = data.member;
                state.conversationsAll[indexAll].loadAll = loadAll;
            }
            else {
                state.conversationsAll.push(conNew)
            }
            return {
                ...state,
                conversations: [...state.conversations],
                conversationsAll: [...state.conversationsAll],
            };
        }
        case types.GET_CONVERSATION_TO_SUCCESS: {
            const { data, open } = action.payload;
            const indexAll = state.conversationsAll.findIndex(c => c._id === data._id);
            const conNew = { ...data, currentPage: 0, loadAll: data.messages.length < 10 }
            if (indexAll + 1) {
                state.conversationsAll[indexAll] = conNew;
            }
            else {
                state.conversationsAll.push(conNew);
            }
            return {
                ...state,
                conversationsAll: [...state.conversationsAll],
                conId: conNew._id,
                openList: false,
                openMessage: open || state.openMessage
            };
        }
        case types.GET_CONVERSATION_TO_FAILED: {
            const conNew = {
                _id: 'temp',
                leader: {
                    user: state.user,
                    seen: true
                },
                member: {
                    user: action.payload,
                    seen: true
                },
                messages: []
            }
            state.conversationsAll = state.conversationsAll.filter(c => c._id !== conNew._id);
            state.conversationsAll.push(conNew);
            return {
                ...state,
                conversationsAll: [...state.conversationsAll],
                conId: conNew._id,
                openMessage: true,
                openList: false
            };
        }
        case types.READ_MESSAGE_SUCCESS: {
            const con = action.payload.data;
            const index = state.conversations.findIndex(c => c._id === con._id)
            const indexAll = state.conversationsAll.findIndex(c => c._id === con._id)
            if (index + 1) {
                state.conversations[index].leader = con.leader;
                state.conversations[index].member = con.member;
            }
            if (indexAll + 1) {
                state.conversationsAll[indexAll].leader = con.leader;
                state.conversationsAll[indexAll].member = con.member;
            }
            state.newMessage--;
            return {
                ...state,
                conversations: [...state.conversations],
                conversationsAll: [...state.conversationsAll],
                conId: con._id,
                openList: false,
                newMessage: Math.max(0, state.newMessage)
            };
        }
        case types.SEND_MESSAGE_SUCCESS: {
            return {
                ...state,
                conversations: [...state.conversations],
                conversationsAll: [...state.conversationsAll],
                conId: action.payload.conversationId
            };
        }
        case types.REVICED_MESSAGE_SUCCESS: {
            const { data } = action.payload;
            state.conversations = [data, ...state.conversations.filter(c => c._id !== data._id)];
            const indexAll = state.conversationsAll.findIndex(c => c._id === data._id);
            const { leader, member } = data;
            const from = leader.user._id === state.user._id ? leader : member;
            if (indexAll + 1) {
                const conCopy = state.conversationsAll[indexAll];
                const messagesNew = data.messages.filter(c => !conCopy.messages.find(con => con._id === c._id));
                conCopy.messages = [...messagesNew, ...conCopy.messages];
                const fromOld = conCopy.leader.user._id === state.user._id ? conCopy.leader : conCopy.member;
                if (fromOld.seen && !from.seen) state.newMessage++;
                conCopy.leader = leader;
                conCopy.member = member;
                state.conversationsAll = [conCopy, ...state.conversationsAll.filter(c => c._id !== data._id)];
            }
            else {
                state.conversationsAll = [data, ...state.conversationsAll.filter(c => c._id !== data._id)];
                if (!from.seen) state.newMessage++;
            }
            return {
                ...state,
                conversations: [...state.conversations],
                conversationsAll: [...state.conversationsAll],
            }
        }
        case types.GET_CATEGORIES_SUCCESS: {
            return {
                ...state,
                categories: action.payload.data
            };
        }
        case types.GET_SETTING_SUCCESS: {
            return {
                ...state,
                setting: action.payload.data
            };
        }
        case types.GET_ADMIN_INFO_SUCCESS: {
            console.log(action.payload)
            return {
                ...state,
                admin: action.payload
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;