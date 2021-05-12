import { combineReducers } from 'redux';
import admin from './adminReducer';
import app from './appReducer';
import user from './userReducer';


export default combineReducers({
    admin,
    app,
    user
})