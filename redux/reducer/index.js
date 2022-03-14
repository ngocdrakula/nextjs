import { combineReducers } from 'redux';
import locale from './localeReducer';
import admin from './adminReducer';
import app from './appReducer';


export default combineReducers({
    locale,
    admin,
    app,
})