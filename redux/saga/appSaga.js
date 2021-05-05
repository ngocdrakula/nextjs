import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as requests from '../actions/appActions';
import types from '../types';


function* getProducts({ payload, callback }) {
    try {
        const res = yield call(requests.getProductsRequest, payload);
        if (res && res.data && res.data.success) {
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
function* getFronts({ payload, callback }) {
    try {
        const res = yield call(requests.getFrontsRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.GET_FRONTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_FRONTS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getSizes({ payload, callback }) {
    try {
        const res = yield call(requests.getSizesRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.GET_SIZES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_SIZES_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getRooms({ payload, callback }) {
    try {
        const res = yield call(requests.getRoomsRequest, payload);
        if (res && res.data && res.data.success) {
            yield put({ type: types.GET_ROOMS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_ROOMS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* getLayouts({ payload: { _id, ...request }, callback }) {
    try {
        const res = yield call(requests.getLayoutsRequest, request);
        if (res && res.data && res.data.success) {
            yield put({ type: types.GET_LAYOUTS_SUCCESS, payload: res.data });
            yield put({ type: types.SELECT_LAYOUT, payload: _id });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.GET_LAYOUTS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}


export default function* appSaga() {
    yield all([
        yield takeEvery(types.GET_PRODUCTS, getProducts),
        yield takeEvery(types.GET_FRONTS, getFronts),
        yield takeEvery(types.GET_SIZES, getSizes),
        yield takeEvery(types.GET_ROOMS, getRooms),
        yield takeEvery(types.GET_LAYOUTS, getLayouts),
    ])
}