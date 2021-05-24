import { call, put, takeEvery, all } from 'redux-saga/effects';
import jwt from 'jsonwebtoken';
import * as requests from '../actions/adminActions';
import types from '../types';


function* admin_LoginLocal({ callback }) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const user = jwt.decode(token);
            const time = new Date().getTime();
            if (user.mode && time < user.exp * 1000) {
                yield put({ type: types.ADMIN_LOGIN_SUCCESS, payload: user });
            }
        }
        if (typeof callback === 'function') callback(token);
    } catch (e) {
        if (typeof callback === 'function') callback(e);
    }
}
function* admin_Login({ payload, callback }) {
    try {
        const res = yield call(requests.admin_LoginRequest, payload);
        if (res?.data?.success) {
            localStorage.setItem('token', res.data.token);
            const user = jwt.decode(res.data.token);
            yield put({ type: types.ADMIN_LOGIN_SUCCESS, payload: user });
        }
        else {
            yield put({ type: types.ADMIN_LOGIN_FAILED, payload: res?.data });
        }
        if (typeof callback === 'function') callback(res.data);
    } catch (e) {
        yield put({ type: types.ADMIN_LOGIN_FAILED, payload: e?.response?.data });
        if (typeof callback === 'function') callback(e?.response?.data);
    }
}
function* admin_Logout({ callback }) {
    try {
        localStorage.removeItem('token');
        yield put({ type: types.ADMIN_LOGOUT_SUCCESS });
        if (typeof callback === 'function') callback(true);
    } catch (e) {
        if (typeof callback === 'function') callback(e);
    }
}


function* admin_getProducts({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getProductsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_PRODUCTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_PRODUCTS_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_addProduct({ payload, callback }) {
    try {
        const res = yield call(requests.admin_addProductRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_PRODUCT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_PRODUCT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_updateProduct({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateProductRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_PRODUCT_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_PRODUCT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteProduct({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteProductRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_PRODUCT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_PRODUCT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteMultiProduct({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteMultiProductRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_PRODUCT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_PRODUCT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}

function* admin_getFronts({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getFrontsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_FRONTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_FRONTS_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}

function* admin_getSizes({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getSizesRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_SIZES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_SIZES_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_addSize({ payload, callback }) {
    try {
        const res = yield call(requests.admin_addSizeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_SIZE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_SIZE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_updateSize({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateSizeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_SIZE_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_SIZE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteSize({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteSizeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_SIZE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_SIZE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteMultiSize({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteMultiSizeRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_SIZE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_SIZE_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}

function* admin_getRooms({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getRoomsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_ROOMS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_ROOMS_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}

function* admin_getLayouts({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getLayoutsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_LAYOUTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_LAYOUTS_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_addLayout({ payload, callback }) {
    try {
        const res = yield call(requests.admin_addLayoutRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_LAYOUT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_LAYOUT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_cloneLayout({ payload, callback }) {
    try {
        const res = yield call(requests.admin_cloneLayoutRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_CLONE_LAYOUT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_CLONE_LAYOUT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_updateLayout({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateLayoutRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_LAYOUT_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_LAYOUT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteLayout({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteLayoutRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_LAYOUT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_LAYOUT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteMultiLayout({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteMultiLayoutRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_LAYOUT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_LAYOUT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_getSetting({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getSettingRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_SETTING_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_SETTING_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}

function* admin_updateSetting({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateSettingRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_SETTING_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_SETTING_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}



export default function* appSaga() {
    yield all([
        yield takeEvery(types.ADMIN_LOGIN_LOCAL, admin_LoginLocal),
        yield takeEvery(types.ADMIN_LOGIN, admin_Login),
        yield takeEvery(types.ADMIN_LOGOUT, admin_Logout),

        yield takeEvery(types.ADMIN_GET_PRODUCTS, admin_getProducts),
        yield takeEvery(types.ADMIN_ADD_PRODUCT, admin_addProduct),
        yield takeEvery(types.ADMIN_UPDATE_PRODUCT, admin_updateProduct),
        yield takeEvery(types.ADMIN_DELETE_PRODUCT, admin_deleteProduct),
        yield takeEvery(types.ADMIN_DELETE_MULTI_PRODUCT, admin_deleteMultiProduct),

        yield takeEvery(types.ADMIN_GET_FRONTS, admin_getFronts),

        yield takeEvery(types.ADMIN_GET_SIZES, admin_getSizes),
        yield takeEvery(types.ADMIN_ADD_SIZE, admin_addSize),
        yield takeEvery(types.ADMIN_UPDATE_SIZE, admin_updateSize),
        yield takeEvery(types.ADMIN_DELETE_SIZE, admin_deleteSize),
        yield takeEvery(types.ADMIN_DELETE_MULTI_SIZE, admin_deleteMultiSize),

        yield takeEvery(types.ADMIN_GET_ROOMS, admin_getRooms),

        yield takeEvery(types.ADMIN_GET_LAYOUTS, admin_getLayouts),
        yield takeEvery(types.ADMIN_ADD_LAYOUT, admin_addLayout),
        yield takeEvery(types.ADMIN_CLONE_LAYOUT, admin_cloneLayout),
        yield takeEvery(types.ADMIN_UPDATE_LAYOUT, admin_updateLayout),
        yield takeEvery(types.ADMIN_DELETE_LAYOUT, admin_deleteLayout),
        yield takeEvery(types.ADMIN_DELETE_MULTI_LAYOUT, admin_deleteMultiLayout),

        yield takeEvery(types.ADMIN_GET_SETTING, admin_getSetting),
        yield takeEvery(types.ADMIN_UPDATE_SETTING, admin_updateSetting),
    ])
}