import { call, put, takeEvery, all } from 'redux-saga/effects';
import jwt from 'jsonwebtoken';
import * as requests from '../actions/adminActions';
import types from '../types';
import { MODE } from '../../utils/helper';


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
function* admin_getExhibitor({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getUsersRequest, { ...payload, mode: MODE.exhibitor });
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_EXHIBITOR_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_EXHIBITOR_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_getVisitor({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getUsersRequest, { ...payload, mode: MODE.visitor });
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_VISITOR_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_VISITOR_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_addUser({ payload, callback }) {
    try {
        const res = yield call(requests.admin_addUserRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_USER_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_USER_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_updateUser({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateUserRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_USER_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        console.log(e)
        yield put({ type: types.ADMIN_UPDATE_USER_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteUser({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteUserRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_USER_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_USER_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteMultiUser({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteMultiUserRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_USER_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_USER_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}



function* admin_getIndustries({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getIndustriesRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_INDUSTRIES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_INDUSTRIES_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_addIndustry({ payload, callback }) {
    try {
        const res = yield call(requests.admin_addIndustryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_INDUSTRY_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_INDUSTRY_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_updateIndustry({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateIndustryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_INDUSTRY_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_INDUSTRY_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteIndustry({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteIndustryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_INDUSTRY_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_INDUSTRY_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteMultiIndustry({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteMultiIndustryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_INDUSTRY_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_INDUSTRY_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
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
            if (typeof callback === 'function') callback(res.data);
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
            if (typeof callback === 'function') callback(res.data);
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
function* admin_cloneLayout({ payload, callback }) {
    try {
        const res = yield call(requests.admin_cloneLayoutRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_CLONE_LAYOUT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
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
            if (typeof callback === 'function') callback(res.data);
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

        yield takeEvery(types.ADMIN_GET_EXHIBITOR, admin_getExhibitor),
        yield takeEvery(types.ADMIN_GET_VISITOR, admin_getVisitor),

        yield takeEvery(types.ADMIN_ADD_USER, admin_addUser),
        yield takeEvery(types.ADMIN_UPDATE_USER, admin_updateUser),
        yield takeEvery(types.ADMIN_DELETE_USER, admin_deleteUser),
        yield takeEvery(types.ADMIN_DELETE_MULTI_USER, admin_deleteMultiUser),


        yield takeEvery(types.ADMIN_GET_PRODUCTS, admin_getProducts),
        yield takeEvery(types.ADMIN_ADD_PRODUCT, admin_addProduct),
        yield takeEvery(types.ADMIN_UPDATE_PRODUCT, admin_updateProduct),
        yield takeEvery(types.ADMIN_DELETE_PRODUCT, admin_deleteProduct),
        yield takeEvery(types.ADMIN_DELETE_MULTI_PRODUCT, admin_deleteMultiProduct),


        yield takeEvery(types.ADMIN_GET_INDUSTRIES, admin_getIndustries),
        yield takeEvery(types.ADMIN_ADD_INDUSTRY, admin_addIndustry),
        yield takeEvery(types.ADMIN_UPDATE_INDUSTRY, admin_updateIndustry),
        yield takeEvery(types.ADMIN_DELETE_INDUSTRY, admin_deleteIndustry),
        yield takeEvery(types.ADMIN_DELETE_MULTI_INDUSTRY, admin_deleteMultiIndustry),

        yield takeEvery(types.ADMIN_GET_ROOMS, admin_getRooms),

        yield takeEvery(types.ADMIN_GET_LAYOUTS, admin_getLayouts),
        yield takeEvery(types.ADMIN_CLONE_LAYOUT, admin_cloneLayout),
        yield takeEvery(types.ADMIN_UPDATE_LAYOUT, admin_updateLayout),
        yield takeEvery(types.ADMIN_DELETE_LAYOUT, admin_deleteLayout),
        yield takeEvery(types.ADMIN_DELETE_MULTI_LAYOUT, admin_deleteMultiLayout),

        yield takeEvery(types.ADMIN_GET_SETTING, admin_getSetting),
        yield takeEvery(types.ADMIN_UPDATE_SETTING, admin_updateSetting),
    ])
}