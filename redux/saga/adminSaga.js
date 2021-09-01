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
                if (user.mode === MODE.exhibitor) yield call(admin_getUser, { payload: user._id });
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
            if (user.mode === MODE.exhibitor) yield call(admin_getUser, { payload: user._id });
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
function* admin_getUser({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getUserRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_USER_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_USER_FAILED, payload: e.response });
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

function* admin_getCategories({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getCategoriesRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_CATEGORIES_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_CATEGORIES_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_addCategory({ payload, callback }) {
    try {
        const res = yield call(requests.admin_addCategoryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_CATEGORY_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_CATEGORY_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_updateCategory({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateCategoryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_CATEGORY_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_CATEGORY_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteCategory({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteCategoryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_CATEGORY_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_CATEGORY_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteMultiCategory({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteMultiCategoryRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_CATEGORY_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_CATEGORY_FAILED, payload: e.response });
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


function* admin_getConversations({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getConversationsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_CONVERSATIONS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_CONVERSATIONS_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_getConversationById({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getConversationByIdRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_ONE_CONVERSATION_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_ONE_CONVERSATION_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_getConversationByIdUser({ payload: { _id, name, open }, callback }) {
    try {
        const res = yield call(requests.admin_getConversationByIdUserRequest, _id);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_CONVERSATION_TO_SUCCESS, payload: { ...res.data, open } });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_CONVERSATION_TO_FAILED, payload: { _id, name } });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_getConversationAndRead({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getConversationByIdRequest, { ...payload, read: true });
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_READ_MESSAGE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_READ_MESSAGE_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_revicedMessage({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getConversationByIdUserRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_REVICED_MESSAGE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_REVICED_MESSAGE_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}
function* admin_postMessage({ payload, callback }) {
    try {
        const res = yield call(requests.admin_postMessageRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_SEND_MESSAGE_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_SEND_MESSAGE_FAILED, payload: e.response });
        if (typeof callback === 'function') {
            callback(e.response);
        }
    }
}


function* admin_getContacts({ payload, callback }) {
    try {
        const res = yield call(requests.admin_getContactsRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_GET_CONTACTS_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_GET_CONTACTS_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_addContact({ payload, callback }) {
    try {
        const res = yield call(requests.admin_addContactRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_ADD_CONTACT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_ADD_CONTACT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_updateContact({ payload, callback }) {
    try {
        const res = yield call(requests.admin_updateContactRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_UPDATE_CONTACT_SUCCESS, payload: res.data.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_UPDATE_CONTACT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteContact({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteContactRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_CONTACT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_CONTACT_FAILED, payload: e.response });
        if (typeof callback === 'function') callback(e.response);
    }
}
function* admin_deleteMultiContact({ payload, callback }) {
    try {
        const res = yield call(requests.admin_deleteMultiContactRequest, payload);
        if (res?.data?.success) {
            yield put({ type: types.ADMIN_DELETE_MULTI_CONTACT_SUCCESS, payload: res.data });
            if (typeof callback === 'function') callback(res.data);
        }
    } catch (e) {
        yield put({ type: types.ADMIN_DELETE_MULTI_CONTACT_FAILED, payload: e.response });
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

        yield takeEvery(types.ADMIN_GET_USER, admin_getUser),
        yield takeEvery(types.ADMIN_ADD_USER, admin_addUser),
        yield takeEvery(types.ADMIN_UPDATE_USER, admin_updateUser),
        yield takeEvery(types.ADMIN_DELETE_USER, admin_deleteUser),
        yield takeEvery(types.ADMIN_DELETE_MULTI_USER, admin_deleteMultiUser),

        yield takeEvery(types.ADMIN_GET_INDUSTRIES, admin_getIndustries),
        yield takeEvery(types.ADMIN_ADD_INDUSTRY, admin_addIndustry),
        yield takeEvery(types.ADMIN_UPDATE_INDUSTRY, admin_updateIndustry),
        yield takeEvery(types.ADMIN_DELETE_INDUSTRY, admin_deleteIndustry),
        yield takeEvery(types.ADMIN_DELETE_MULTI_INDUSTRY, admin_deleteMultiIndustry),

        yield takeEvery(types.ADMIN_GET_PRODUCTS, admin_getProducts),
        yield takeEvery(types.ADMIN_ADD_PRODUCT, admin_addProduct),
        yield takeEvery(types.ADMIN_UPDATE_PRODUCT, admin_updateProduct),
        yield takeEvery(types.ADMIN_DELETE_PRODUCT, admin_deleteProduct),
        yield takeEvery(types.ADMIN_DELETE_MULTI_PRODUCT, admin_deleteMultiProduct),


        yield takeEvery(types.ADMIN_GET_CATEGORIES, admin_getCategories),
        yield takeEvery(types.ADMIN_ADD_CATEGORY, admin_addCategory),
        yield takeEvery(types.ADMIN_UPDATE_CATEGORY, admin_updateCategory),
        yield takeEvery(types.ADMIN_DELETE_CATEGORY, admin_deleteCategory),
        yield takeEvery(types.ADMIN_DELETE_MULTI_CATEGORY, admin_deleteMultiCategory),

        yield takeEvery(types.ADMIN_GET_CONVERSATIONS, admin_getConversations),
        yield takeEvery(types.ADMIN_GET_ONE_CONVERSATION, admin_getConversationById),
        yield takeEvery(types.ADMIN_GET_CONVERSATION_TO, admin_getConversationByIdUser),
        yield takeEvery(types.ADMIN_READ_MESSAGE, admin_getConversationAndRead),
        yield takeEvery(types.ADMIN_SEND_MESSAGE, admin_postMessage),
        yield takeEvery(types.ADMIN_REVICED_MESSAGE, admin_revicedMessage),


        yield takeEvery(types.ADMIN_GET_CONTACTS, admin_getContacts),
        yield takeEvery(types.ADMIN_ADD_CONTACT, admin_addContact),
        yield takeEvery(types.ADMIN_UPDATE_CONTACT, admin_updateContact),
        yield takeEvery(types.ADMIN_DELETE_CONTACT, admin_deleteContact),
        yield takeEvery(types.ADMIN_DELETE_MULTI_CONTACT, admin_deleteMultiContact),

    ])
}