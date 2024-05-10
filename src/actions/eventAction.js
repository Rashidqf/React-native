import NetInfo from '@react-native-community/netinfo';

import { EVENT_TYPE } from '@constants';

// export function saveTaskList(data) {
export function saveEventList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_EVENT_LIST,
      data,
    });
  };
}

export function saveEventListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_EVENT_LIST_LOAD_MORE,
      data,
    });
  };
}

export function saveMonthlyEventList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.MONTHLY_SAVE_EVENT_LIST,
      data,
    });
  };
}
export function saveMonthlyEventListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.MONTHLY_SAVE_EVENT_LIST_LOAD_MORE,
      data,
    });
  };
}
export function saveMonthlyTaskList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.MONTHLY_SAVE_TASK_LIST,
      data,
    });
  };
}
export function saveMonthlyTaskListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.MONTHLY_SAVE_TASK_LIST_LOAD_MORE,
      data,
    });
  };
}

export function deleteMonthlyTaskList(id, data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.DELETE_MONTHLY_LIST,
      id,
    });
  };
}

export function saveSidenoteList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_SIDENOTE_LIST,
      data,
    });
  };
}
export function saveSidenoteListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_SIDENOTE_LIST_LOAD_MORE,
      data,
    });
  };
}
export function removeCard(Id) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.REMOVE_SIDENOTE,
      Id,
    });
  };
}

export function saveConnectionList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_CONNECTION_LIST,
      data,
    });
  };
}
export function saveConnectionListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_CONNECTION_LIST_LOAD_MORE,
      data,
    });
  };
}
export function removeConnection(Id) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.REMOVE_CONNECTION,
      Id,
    });
  };
}
export function saveEventDetail(data, params) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_EVENT_DETAIL,
      data,
      params,
      // TASKID,
    });
  };
}

export function saveEventAdd(data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_EVENT_ADD,
      data,
    });
  };
}

export function saveEventDelete(eventId, data) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_EVENT_DELETE,
      eventId,
      data,
    });
  };
}

export function saveEventUpdate(data, eventId) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_EVENT_UPDATE,
      data,
      eventId,
    });
  };
}

export function saveEventParticipate(data, eventId, going, index, state) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.SAVE_EVENT_PARTICIPATE,
      data,
      eventId,
      going,
      index,
      state,
    });
  };
}

export function saveParticipate(data, going) {
  return (dispatch, getState) => {
    dispatch({
      type: EVENT_TYPE.EVENT_DETAIL_PARTICIPATE,
      data,

      going,
    });
  };
}
export function eventListId(data) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.EVENT_LIST_ID,
      data,
    });
  };
}

export function eventTaskDelete(taskId, data) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.EVENT_TASK_DELETE,
      taskId,
      data,
    });
  };
}
export function saveeventTaskDetail(data) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.EVENT_TASK_DETAIL,
      data,
    });
  };
}
export function saveEventTaskComplete(data, taskId) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.EVENT_TASK_COMPLETE,
      data,
      taskId,
    });
  };
}
export function clearEvent() {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.CLEAR_EVENT,
    });
  };
}

export function addToCalenderEvent(eventId) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.ADD_TO_CALENDER_EVENT,
      eventId,
    });
  };
}

export function addToCalenderTask(taskId) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.ADD_TO_CALENDER_TASK,
      taskId,
    });
  };
}
export function updateMonthlyEvent(Id, data) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.MONTHLY_EVENT_UPDATE,
      Id,
      data,
    });
  };
}
export function savePinnedUser(data) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.PINNED_USER_LIST,
      data,
    });
  };
}
export function savePinnedUserLoadMore(data) {
  return dispatch => {
    dispatch({
      type: EVENT_TYPE.PINNED_USER_LIST_LOAD_MORE,
      data,
    });
  };
}
