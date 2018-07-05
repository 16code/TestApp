import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import playerMiddleware from 'utils/player.middleware';
import rootReducers from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [playerMiddleware(), sagaMiddleware];
if (__MOCK__) {
    const { createLogger } = require('redux-logger');
    const loggerMiddleware = createLogger({
        collapsed: true,
        timestamp: false,
        level: 'info'
    });
    middlewares.unshift(loggerMiddleware);
}

const store = (initialState => {
    const s = createStore(
        rootReducers,
        initialState,
        compose(
            applyMiddleware(...middlewares),
            __MOCK__ && window.devToolsExtension ? window.devToolsExtension() : fn => fn
        )
    );
    sagaMiddleware.run(rootSaga);
    return s;
})();
export { store };
