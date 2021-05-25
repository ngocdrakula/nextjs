import { call, put, takeEvery, all } from 'redux-saga/effects';
import jwt from 'jsonwebtoken';
import * as requests from '../actions/userActions';
import types from '../types';


function* user_LoginLocal({ callback }) {
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
function* user_Login({ payload, callback }) {
    try {
        const res = yield call(requests.user_LoginRequest, payload);
        if (res?.data?.success) {
            localStorage.setItem('token', res.data.token);
            const user = jwt.decode(res.data.token);
            yield put({ type: types.USER_LOGIN_SUCCESS, payload: user });
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
function* user_Register({ payload, callback }) {
    try {
        const res = yield call(requests.user_RegisterRequest, payload);
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
function* user_Logout({ callback }) {
    try {
        localStorage.removeItem('token');
        yield put({ type: types.USER_LOGOUT_SUCCESS });
        if (typeof callback === 'function') callback(true);
    } catch (e) {
        if (typeof callback === 'function') callback(e);
    }
}
function* user_getDesign({ payload, callback }) {
    try {
        const res = yield call(requests.user_getDesignRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.USER_GET_DESIGN_SUCCESS, payload: res.data.data });
            yield put({ type: types.APP_INITAL_LAYOUT, payload: res.data.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.USER_GET_DESIGN_FAILED, payload: true });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* user_getMyDesigns({ payload, callback }) {
    try {
        const res = yield call(requests.user_getMyDesignsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.USER_GET_MY_DESIGN_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.USER_GET_MY_DESIGN_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* user_addDesign({ payload, callback }) {
    try {
        const res = yield call(requests.user_addDesignRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.USER_ADD_DESIGN_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.USER_ADD_DESIGN_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* user_updateDesign({ payload, callback }) {
    try {
        const res = yield call(requests.user_updateDesignRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.USER_UPDATE_DESIGN_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.USER_UPDATE_DESIGN_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* user_deleteDesign({ payload, callback }) {
    try {
        const res = yield call(requests.user_deleteDesignRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.USER_DELETE_DESIGN_SUCCESS, payload: payload });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.USER_DELETE_DESIGN_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* user_deleteMultiDesign({ payload, callback }) {
    try {
        const res = yield call(requests.user_deleteMultiDesignRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.USER_DELETE_MUTIL_DESIGN_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.USER_DELETE_MUTIL_DESIGN_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}



export default function* appSaga() {
    yield all([
        yield takeEvery(types.USER_LOGIN_LOCAL, user_LoginLocal),
        yield takeEvery(types.USER_LOGIN, user_Login),
        yield takeEvery(types.USER_REGISTER, user_Register),
        yield takeEvery(types.USER_LOGOUT, user_Logout),

        yield takeEvery(types.USER_GET_DESIGN, user_getDesign),
        yield takeEvery(types.USER_GET_MY_DESIGN, user_getMyDesigns),
        yield takeEvery(types.USER_ADD_DESIGN, user_addDesign),
        yield takeEvery(types.USER_UPDATE_DESIGN, user_updateDesign),
        yield takeEvery(types.USER_DELETE_DESIGN, user_deleteDesign),
        yield takeEvery(types.USER_DELETE_MUTIL_DESIGN, user_deleteMultiDesign),
    ])
}