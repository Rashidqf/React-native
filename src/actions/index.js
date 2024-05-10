import * as reduxAction from './reduxAction';
import * as dashboardAction from './dashboardAction';
import * as eventAction from './eventAction';
import * as groupAction from './groupAction';
import * as pollAction from './pollAction';
export const ActionCreators = Object.assign({}, { ...reduxAction, ...dashboardAction, ...eventAction, ...groupAction, ...pollAction });
