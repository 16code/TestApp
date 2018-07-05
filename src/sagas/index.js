// import { takeLatest } from 'redux-saga';
import { all } from 'redux-saga/effects';
import { loadMediaSourceSaga } from './loadMediaSource';

export default function* rootSaga() {
    /*The saga is waiting for a action called LOAD_DASHBOARD to be activated */
    yield all([loadMediaSourceSaga()]);
}
