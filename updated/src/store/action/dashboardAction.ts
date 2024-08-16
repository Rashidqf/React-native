import {AppDispatch} from '../store';
import NetInfo from '@react-native-community/netinfo';
import {
  saveDashboard,
  updateDashboard,
  saveTaskComplete,
  saveTaskListComplete,
  saveTaskList,
  saveTaskDetail,
  saveTaskDelete,
  saveTaskUpdate,
  saveTaskListLoadMore,
  saveTaskAdd,
  saveGroupList,
  saveGroupListLoadMore,
  saveUserAll,
  saveUserAllLoadMore,
  showModal,
  userToken,
  saveMyConnections,
  saveMyConnectionsLoadMore,
  sendInvitation,
  taskListGroupId,
  clearTask,
  saveItineraryDetails,
  saveContactList,
  saveItineraryList,
  saveDraftItineraryList,
  addToEvent,
  userPin,
  updateContactStatus,
} from '../reducer/dashboardReducer';

export function saveDashboardAction(
  data: any,
  total_task_count: number,
  total_chat_count: number,
) {
  return (dispatch: AppDispatch) => {
    dispatch(saveDashboard({data, total_task_count, total_chat_count}));
  };
}

export function updateDashboardAction(data: any, total_chat_count: number) {
  return (dispatch: AppDispatch) => {
    dispatch(updateDashboard({data, total_chat_count}));
  };
}

export function saveTaskCompleteAction(
  data: any,
  taskId: string,
  state: string,
) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskComplete({data, taskId, state}));
  };
}

export function saveTaskListCompleteAction(
  data: any,
  taskId: string,
  parentId: string,
) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskListComplete({data, taskId, parentId}));
  };
}

export function saveTaskListAction(
  data: any,
  total_pages: number,
  total_count: number,
) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskList({data, total_pages, total_count}));
  };
}

export function saveTaskDetailAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskDetail({data}));
  };
}

export function saveTaskDeleteAction(taskId: string, data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskDelete({taskId, data}));
  };
}

export function saveTaskUpdateAction(data: any, taskId: string) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskUpdate({data, taskId}));
  };
}

export function saveTaskListLoadMoreAction(
  data: any,
  total_pages: number,
  total_count: number,
) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskListLoadMore({data, total_pages, total_count}));
  };
}

export function saveTaskAddAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveTaskAdd({data}));
  };
}

export function saveGroupListAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveGroupList({data}));
  };
}

export function saveGroupListLoadMoreAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveGroupListLoadMore({data}));
  };
}

export function saveUserAllAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveUserAll({data}));
  };
}

export function saveUserAllLoadMoreAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveUserAllLoadMore({data}));
  };
}

export function showModalAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(showModal({data}));
  };
}

export function userTokenAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(userToken({data}));
  };
}

export function saveMyConnectionsAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveMyConnections({data}));
  };
}

export function saveMyConnectionsLoadMoreAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveMyConnectionsLoadMore({data}));
  };
}

export function sendInvitationAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(sendInvitation({data}));
  };
}

export function taskListGroupIdAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(taskListGroupId({data}));
  };
}

export function clearTaskAction() {
  return (dispatch: AppDispatch) => {
    dispatch(clearTask());
  };
}

export function saveItineraryDetailsAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveItineraryDetails({data}));
  };
}

export function getContactNumberAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveContactList({data}));
  };
}

export function updateContactStatusAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(updateContactStatus({data}));
  };
}

export function getItineraryListAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveItineraryList({data}));
  };
}

export function getDraftItineraryListAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(saveDraftItineraryList({data}));
  };
}

export function addToEventAction(Id: string) {
  return (dispatch: AppDispatch) => {
    dispatch(addToEvent({Id}));
  };
}

export function getUserPinAction(userId: string) {
  return (dispatch: AppDispatch) => {
    dispatch(userPin({userId}));
  };
}
