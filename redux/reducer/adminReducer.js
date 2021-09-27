import types from '../types';
import { HYDRATE } from 'next-redux-wrapper'
import { MODE } from '../../utils/helper';

export const initState = {
    product: { data: [], page: 0, total: 0 },
    visitor: { data: [], page: 0, total: 0, totalNew: 0 },
    exhibitor: { data: [], page: 0, total: 0, totalNew: 0 },
    contact: { data: [], page: 0, total: 0 },
    trade: { data: [], page: 0, total: 0 },
    livestream: { data: [], page: 0, total: 0 },
    visit: { data: [], page: 0, total: 0 },
    noti: { data: [], page: 0, total: 0 },
    countList: [],
    industries: [],
    categories: [],
    user: null,
    exUser: null,
    conversations: [],
    conversationsAll: [],
    newMessage: 0,
    newNoti: 0,
    total: 0,
    page: 0,
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
                exUser: null,
                conversations: [],
                conversationsAll: [],
                newMessage: 0,
                total: 0,
                page: 0,
                conId: null
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
            else if (state.user?._id === user._id) {
                state.user = user;
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
            if (state.user?.mode === MODE.admin && action.payload.data._id === state.user._id) {
                return {
                    ...state,
                    user: action.payload.data
                }
            } else {
                return {
                    ...state,
                    exUser: action.payload.data,
                    conversations: [],
                    conversationsAll: [],
                    newMessage: 0,
                    total: 0,
                    page: 0,
                    conId: null
                };
            }
        }
        case types.ADMIN_EXHIBITOR_LOGOUT: {
            return {
                ...state,
                exUser: null,
                user: state.user.mode === MODE.admin ? state.user : null,
                conversations: [],
                conversationsAll: [],
                newMessage: 0,
                total: 0,
                page: 0,
                conId: null
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


        case types.ADMIN_GET_CONVERSATIONS_SUCCESS: {
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
        case types.ADMIN_SELECT_CONVERSATION: {
            return {
                ...state,
                conId: action.payload,
                openList: false
            };
        }
        case types.ADMIN_GET_ONE_CONVERSATION_SUCCESS: {
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
        case types.ADMIN_GET_CONVERSATION_TO_SUCCESS: {
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
        case types.ADMIN_GET_CONVERSATION_TO_FAILED: {
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
        case types.ADMIN_READ_MESSAGE_SUCCESS: {
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
        case types.ADMIN_SEND_MESSAGE_SUCCESS: {
            return {
                ...state,
                conversations: [...state.conversations],
                conversationsAll: [...state.conversationsAll],
                conId: action.payload.conversationId
            };
        }
        case types.ADMIN_REVICED_MESSAGE_SUCCESS: {
            const { data } = action.payload;
            const currentUser = state.exUser || state.user;
            state.conversations = [data, ...state.conversations.filter(c => c._id !== data._id)];
            const indexAll = state.conversationsAll.findIndex(c => c._id === data._id);
            const { leader, member } = data;
            const from = leader.user._id === currentUser._id ? leader : member;
            if (indexAll + 1) {
                const conCopy = state.conversationsAll[indexAll];
                const messagesNew = data.messages.filter(c => !conCopy.messages.find(con => con._id === c._id));
                conCopy.messages = [...messagesNew, ...conCopy.messages];
                const fromOld = conCopy.leader.user._id === currentUser._id ? conCopy.leader : conCopy.member;
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
        case types.ADMIN_GET_CATEGORIES_SUCCESS: {
            return {
                ...state,
                categories: action.payload.data
            };
        }

        case types.ADMIN_GET_CONTACTS_SUCCESS: {
            return {
                ...state,
                contact: action.payload
            };
        }
        case types.ADMIN_UPDATE_CONTACT_SUCCESS: {
            const data = state.contact.data.map(c => {
                if (c._id === action.payload._id) return action.payload;
                return (c);
            });
            return {
                ...state,
                contact: {
                    ...state.contact,
                    data
                }
            };
        }
        case types.ADMIN_GET_SETTING_SUCCESS: {
            return {
                ...state,
                setting: action.payload.data
            };
        }
        case types.ADMIN_UPDATE_SETTING_SUCCESS: {
            return {
                ...state,
                admin: action.payload.data
            };
        }

        case types.ADMIN_GET_TRADES_SUCCESS: {
            return {
                ...state,
                trade: action.payload
            };
        }
        case types.ADMIN_UPDATE_TRADE_SUCCESS: {
            const data = state.trade.data.map(c => {
                if (c._id === action.payload._id) return action.payload;
                return (c);
            });
            return {
                ...state,
                trade: {
                    ...state.trade,
                    data
                }
            };
        }
        case types.ADMIN_GET_LIVESTREAMS_SUCCESS: {
            return {
                ...state,
                livestream: action.payload
            };
        }
        case types.ADMIN_UPDATE_LIVESTREAM_SUCCESS: {
            const data = state.livestream.data.map(c => {
                if (c._id === action.payload._id) return action.payload;
                return (c);
            });
            return {
                ...state,
                livestream: {
                    ...state.livestream,
                    data
                }
            };
        }
        case types.ADMIN_GET_VISITS_SUCCESS: {
            const { countList, ...visit } = action.payload;
            return {
                ...state,
                visit: visit,
                countList: countList.length ? countList : state.countList
            };
        }
        case types.ADMIN_GET_NOTI_SUCCESS: {
            const { totalNew, ...noti } = action.payload;
            return {
                ...state,
                noti: noti,
                newNoti: totalNew
            };
        }
        case types.ADMIN_READ_NOTI_SUCCESS: {
            return {
                ...state,
                newNoti: 0
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;