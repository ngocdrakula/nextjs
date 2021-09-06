import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as requests from '../actions/appActions';
import { MODE } from '../../utils/helper'
import types from '../types';
import jwt from 'jsonwebtoken';


function* getIndustries({ payload, callback }) {
    try {
        const res = yield call(requests.getIndustriesRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_INDUSTRIES_SUCCESS, payload: res.data });
            const { data } = res.data;
            if (data[0]) {
                yield call(getVisitors, { payload: { page: 0, pageSize: 6, industry: data[0]._id } })
                yield call(getExhibitors, { payload: { page: 0, pageSize: 6, industry: data[0]._id } })
            }
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_INDUSTRIES_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getVisitors({ payload, callback }) {
    try {
        const res = yield call(requests.getUserRequest, { ...payload, mode: MODE.visitor });
        if (res?.data?.success) {
            yield put({ type: types.GET_VISITORS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_VISITORS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getExhibitors({ payload, callback }) {
    try {
        const res = yield call(requests.getUserRequest, { ...payload, mode: MODE.exhibitor });
        if (res?.data?.success) {
            yield put({ type: types.GET_EXHIBITORS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_EXHIBITORS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* loginLocal({ callback }) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const user = jwt.decode(token);
            const time = new Date().getTime();
            if (time < user.exp * 1000) {
                yield put({ type: types.USER_LOGIN_SUCCESS, payload: user });
            }
        }
        if (typeof callback === 'function') callback(token);
    } catch (e) {
        if (typeof callback === 'function') callback(e);
    }
}
function* postLogin({ payload, callback }) {
    try {
        const res = yield call(requests.postLoginRequest, payload);
        if (res?.data?.success) {
            localStorage.setItem('token', res.data.token);
            const user = jwt.decode(res.data.token);
            yield put({ type: types.USER_LOGIN_SUCCESS, payload: user });
            yield call(getUserById, { payload: user._id });
        }
        else {
            yield put({ type: types.USER_LOGIN_FAILED, payload: res?.data });
        }
        if (typeof callback === 'function') callback(res.data);
    } catch (e) {
        yield put({ type: types.USER_LOGIN_FAILED, payload: e?.response?.data });
        if (typeof callback === 'function') callback(e?.response?.data);
    }
}
function* postRegister({ payload, callback }) {
    try {
        const res = yield call(requests.postRegisterRequest, payload);
        if (res?.data?.success) {
            localStorage.setItem('token', res.data.token);
            const user = jwt.decode(res.data.token);
            yield put({ type: types.USER_REGISTER_SUCCESS, payload: user });
        }
        else {
            yield put({ type: types.USER_REGISTER_FAILED, payload: res?.data });
        }
        if (typeof callback === 'function') callback(res.data);
    } catch (e) {
        yield put({ type: types.USER_REGISTER_FAILED, payload: e?.response?.data });
        if (typeof callback === 'function') callback(e?.response?.data);
    }
}
function* postLogout({ callback }) {
    try {
        localStorage.removeItem('token');
        yield put({ type: types.USER_LOGOUT_SUCCESS });
        if (typeof callback === 'function') callback(true);
    } catch (e) {
        if (typeof callback === 'function') callback(e);
    }
}
function* getUserById({ payload, callback }) {
    try {
        const res = yield call(requests.getUserByIdRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_USER_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_USER_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getProducts({ payload, callback }) {
    try {
        const res = yield call(requests.getProductsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_PRODUCTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_PRODUCTS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}

function* getConversations({ payload, callback }) {
    try {
        const res = yield call(requests.getConversationsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_CONVERSATIONS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_CONVERSATIONS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getConversationById({ payload, callback }) {
    try {
        const res = yield call(requests.getConversationByIdRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_ONE_CONVERSATION_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_ONE_CONVERSATION_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getConversationByIdUser({ payload: { _id, name, open }, callback }) {
    try {
        const res = yield call(requests.getConversationByIdUserRequest, _id);
        if (res?.data?.success) {
            yield put({ type: types.GET_CONVERSATION_TO_SUCCESS, payload: { ...res.data, open } });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_CONVERSATION_TO_FAILED, payload: { _id, name } });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getConversationAndRead({ payload, callback }) {
    try {
        const res = yield call(requests.getConversationByIdRequest, { id: payload, read: true });
        if (res?.data?.success) {
            yield put({ type: types.READ_MESSAGE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.READ_MESSAGE_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* revicedMessage({ payload, callback }) {
    try {
        const res = yield call(requests.getConversationByIdUserRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.REVICED_MESSAGE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.REVICED_MESSAGE_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* postMessage({ payload, callback }) {
    try {
        const res = yield call(requests.postMessageRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.SEND_MESSAGE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.SEND_MESSAGE_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}

function* getCategories({ payload, callback }) {
    try {
        const res = yield call(requests.getCategoriesRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_CATEGORIES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_CATEGORIES_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* postContact({ payload, callback }) {
    try {
        const res = yield call(requests.postContactRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.SEND_CONTACT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.SEND_CONTACT_SUCCESS, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getSetting({ payload, callback }) {
    try {
        const res = yield call(requests.getSettingRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_SETTING_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_SETTING_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* getAdminInfo({ payload, callback }) {
    try {
        const res = yield call(requests.getUserRequest, { mode: MODE.admin });
        if (res?.data?.success && res.data.data.length) {
            yield put({ type: types.GET_ADMIN_INFO_SUCCESS, payload: res.data.data[0] });
            if (typeof callback === 'function') callback(res.data);
        }
        else {
            yield put({ type: types.GET_ADMIN_INFO_FAILED, payload: null });
            if (typeof callback === 'function') callback();
        }
    } catch (e) {
        yield put({ type: types.GET_ADMIN_INFO_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}

function* getTrades({ payload, callback }) {
    try {
        const res = yield call(requests.getTradesRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_TRADES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_TRADES_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* addTrade({ payload, callback }) {
    try {
        const res = yield call(requests.addTradeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_TRADE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_TRADE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* updateTrade({ payload, callback }) {
    try {
        const res = yield call(requests.updateTradeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_TRADE_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_TRADE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* deleteTrade({ payload, callback }) {
    try {
        const res = yield call(requests.deleteTradeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_TRADE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_TRADE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* deleteMultiTrade({ payload, callback }) {
    try {
        const res = yield call(requests.deleteMultiTradeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_TRADE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_TRADE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
export default function* appSaga() {
    yield all([
        yield takeEvery(types.GET_INDUSTRIES, getIndustries),
        yield takeEvery(types.GET_VISITORS, getVisitors),
        yield takeEvery(types.GET_EXHIBITORS, getExhibitors),
        yield takeEvery(types.USER_LOGIN_LOCAL, loginLocal),
        yield takeEvery(types.USER_LOGIN, postLogin),
        yield takeEvery(types.USER_REGISTER, postRegister),
        yield takeEvery(types.USER_LOGOUT, postLogout),
        yield takeEvery(types.GET_USER, getUserById),
        yield takeEvery(types.GET_PRODUCTS, getProducts),
        yield takeEvery(types.GET_CONVERSATIONS, getConversations),
        yield takeEvery(types.GET_ONE_CONVERSATION, getConversationById),
        yield takeEvery(types.GET_CONVERSATION_TO, getConversationByIdUser),
        yield takeEvery(types.READ_MESSAGE, getConversationAndRead),
        yield takeEvery(types.SEND_MESSAGE, postMessage),
        yield takeEvery(types.REVICED_MESSAGE, revicedMessage),
        yield takeEvery(types.GET_CATEGORIES, getCategories),
        yield takeEvery(types.SEND_CONTACT, postContact),
        yield takeEvery(types.GET_SETTING, getSetting),
        yield takeEvery(types.GET_ADMIN_INFO, getAdminInfo),

        yield takeEvery(types.GET_TRADES, getTrades),
        yield takeEvery(types.ADD_TRADE, addTrade),
        yield takeEvery(types.UPDATE_TRADE, updateTrade),
        yield takeEvery(types.DELETE_TRADE, deleteTrade),
        yield takeEvery(types.DELETE_MULTI_TRADE, deleteMultiTrade),
    ])
}