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
function* getMessages({ payload, callback }) {
    try {
        const res = yield call(requests.getMessagesRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.GET_MESSAGES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_MESSAGES_FAILED, payload: e.response });
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
        console.log(e)
        yield put({ type: types.SEND_MESSAGE_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
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
        yield takeEvery(types.GET_MESSAGES, getMessages),
        yield takeEvery(types.SEND_MESSAGE, postMessage),
    ])
}