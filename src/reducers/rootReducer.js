import { combineReducers } from 'redux';
import redState from './storeState';
import dashboardState from './dashboardState';
import eventState from './eventState';
import groupState from './groupState';
import pollState from './pollState';

export default combineReducers({
  redState: redState,
  dashboardState: dashboardState,
  eventState: eventState,
  groupState: groupState,
  pollState: pollState,
});
