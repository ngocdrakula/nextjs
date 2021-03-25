import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';

import reducer from './reducer';
import saga from './saga';

export const makeStore = () => {
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducer, applyMiddleware(sagaMiddleware))
    store.sagaTask = sagaMiddleware.run(saga)

    return store
}

export const wrapper = createWrapper(makeStore, { debug: false })

