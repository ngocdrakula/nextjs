import { combineReducers } from 'redux';
import admin from './adminReducer';
import app from './appReducer';


export default combineReducers({
    admin,
    app
})