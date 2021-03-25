import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as requests from '../actions/adminActions';
import types from '../types';


function* admin_getProducts({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getProductsRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.ADMIN_GET_PRODUCTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_PRODUCTS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_getFronts({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getFrontsRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.ADMIN_GET_FRONTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_FRONTS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_getSizes({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getSizesRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.ADMIN_GET_SIZES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_SIZES_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_getRooms({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getRoomsRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.ADMIN_GET_ROOMS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_ROOMS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_getLayouts({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getLayoutsRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.ADMIN_GET_LAYOUTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_LAYOUTS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}


export default function* appSaga() {
    yield all([
        yield takeEvery(types.ADMIN_GET_PRODUCTS, admin_getProducts),
        yield takeEvery(types.ADMIN_GET_FRONTS, admin_getFronts),
        yield takeEvery(types.ADMIN_GET_SIZES, admin_getSizes),
        yield takeEvery(types.ADMIN_GET_ROOMS, admin_getRooms),
        yield takeEvery(types.ADMIN_GET_LAYOUTS, admin_getLayouts),
    ])
}