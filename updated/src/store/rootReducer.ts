import {combineReducers} from '@reduxjs/toolkit';
import reducer from './reducer/reducer';
import dashboardReducer from './reducer/dashboardReducer';
import groupStateReducer from './reducer/groupStateReducer';

const rootReducer = combineReducers({
  redState: reducer,
  dashboardState: dashboardReducer,
  groupState: groupStateReducer,
});

export default rootReducer;
