import { all, fork } from "redux-saga/effects";
import appSagas from "./appSaga";
import adminSagas from "./adminSaga";

export default function* rootSagas () {
    yield all([
        fork(appSagas),
        fork(adminSagas),
    ]);
}