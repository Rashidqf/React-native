import NetInfo from '@react-native-community/netinfo';

import { DASHBOARD_TYPE } from '@constants';

export function saveDashboard(data, total_task_count, total_chat_count) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_DASHBOARD,
      data,
      total_task_count,
      total_chat_count,
    });
  };
}

export function updateDashboard(data, total_chat_count) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.UPDATE_DASHBOARD,
      data,
      total_chat_count,
    });
  };
}

export function saveTaskComplete(data, taskId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_COMPLETE,
      data,
      taskId,
      state,
    });
  };
}
export function saveTaskListComplete(data, taskId, parentId) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_LIST_COMPLETE,
      data,
      taskId,
      parentId,
    });
  };
}

// export function saveTaskList(data) {
export function saveTaskList(data, total_pages, total_count) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_LIST,
      data,
      total_pages,
      total_count,
    });
  };
}

export function saveTaskDetail(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_DETAIL,
      data,
      // TASKID,
    });
  };
}

export function saveTaskDelete(taskId, data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_DELETE,
      taskId,
      data,
    });
  };
}
export function saveTaskUpdate(data, taskId) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_UPDATE,
      data,
      taskId,
    });
  };
}

export function saveTaskListLoadMore(data, total_pages, total_count) {
  // export function saveTaskListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_LIST_LOAD_MORE,
      data,
      total_pages,
      total_count,
    });
  };
}

export function saveTaskAdd(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_TASK_ADD,
      data,
    });
  };
}

export function saveGroupList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_GROUP_LIST,
      data,
    });
  };
}
export function saveGroupListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_GROUP_LIST_LOAD_MORE,
      data,
    });
  };
}

export function saveUserAll(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_USER_ALL,
      data,
    });
  };
}

export function saveUserAllLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_USER_ALL_LOAD_MORE,
      data,
    });
  };
}
export function showModalAction(data) {
  return dispatch => {
    dispatch({
      type: DASHBOARD_TYPE.SHOW_MODAL,
      data,
    });
  };
}
export function userToken(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.USER_TOKEN,
      data,
    });
  };
}

export function saveMyConnections(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_MY_CONNECTIONS,
      data,
    });
  };
}

export function saveMyConnectionsLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_MY_CONNECTIONS_LOAD_MORE,
      data,
    });
  };
}

export function sendInvitation(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SEND_INVITATION,
      data,
    });
  };
}

export function taskListGroupId(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.TASK_LIST_GROUP_ID,
      data,
    });
  };
}

export function clearTask() {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.CLEAR_TASK,
    });
  };
}

export function saveItineraryDetails(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_ITINERARY_DETAILS,
      data,
    });
  };
}

export function getContactNumber(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_CONTACT,
      data,
    });
  };
}

export function updateContactStatus(data) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.UPDATE_CONTACT,
      data,
    });
  };
}

export function getItineraryList(data) {
  return dispatch => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_ITINERARY_LIST,
      data,
    });
  };
}

export function getDraftItineraryList(data) {
  return dispatch => {
    dispatch({
      type: DASHBOARD_TYPE.SAVE_DRAFT_ITINERARY_LIST,
      data,
    });
  };
}

export function addToEvent(Id) {
  return dispatch => {
    dispatch({
      type: DASHBOARD_TYPE.ADD_TO_EVENT,
      Id,
    });
  };
}
export function getUserPin(userId) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_TYPE.USER_PIN,
      userId,
    });
  };
}
