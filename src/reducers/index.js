import { combineReducers } from 'redux';
import { ajaxReducer } from './ajax';
import { updatedReducer } from './playerState';

export default combineReducers({
    ajax: ajaxReducer,
    player: updatedReducer
});
