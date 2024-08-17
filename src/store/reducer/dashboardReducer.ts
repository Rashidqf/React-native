import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Task {
  id: string;
  is_complete: number;
  subtasks?: Task[];
  date?: string;
  [key: string]: any;
}

interface Contact {
  mobile_no: string;
  displayName?: string;
  thumbnailPath?: string;
  status?: string;
  givenName?: string;
}

interface State {
  dashboardList: {
    tasks?: Task[];
    [key: string]: any;
  } | null;
  taskComplete: any | null;
  taskList: {
    data: Task[];
    [key: string]: any;
  } | null;
  taskDetail: {
    subtasks: Task[];
    is_complete: any;
    [key: string]: any;
  } | null;
  taskAdd: any | null;
  groupList: any | null;
  total_count: any | null;
  userList: any | null;
  myConnections: {
    data: any[];
    [key: string]: any;
  } | null;
  taskListId: {
    data: Task[];
    [key: string]: any;
  } | null;
  showModal: boolean;
  itineraryDetails: {
    events: any[];
    [key: string]: any;
  } | null;
  contactList: Contact[] | null;
  itineraryList: any | null;
  itineraryDraftList: any | null;
}

const initialState: State = {
  dashboardList: null,
  taskComplete: null,
  taskList: null,
  taskDetail: null,
  taskAdd: null,
  groupList: null,
  total_count: null,
  userList: null,
  myConnections: null,
  taskListId: null,
  showModal: false,
  itineraryDetails: null,
  contactList: [],
  itineraryList: null,
  itineraryDraftList: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    showModal(state, action: PayloadAction<boolean>) {
      state.showModal = action.payload;
    },
    saveDashboard(
      state,
      action: PayloadAction<{
        data: any;
        total_task_count: number;
        total_chat_count: number;
      }>,
    ) {
      state.dashboardList = {
        ...action.payload.data,
        total: action.payload.total_task_count,
        totalChat: action.payload.total_chat_count,
      };
    },
    updateDashboard(
      state,
      action: PayloadAction<{data: any; total_chat_count: number}>,
    ) {
      if (state.dashboardList) {
        state.dashboardList = {
          ...state.dashboardList,
          totalChat: action.payload.total_chat_count,
          chats: action.payload.data,
        };
      }
    },
    saveTaskComplete(
      state,
      action: PayloadAction<{data: any; taskId: string; state: string}>,
    ) {
      const listClone = state.dashboardList?.tasks
        ? [...state.dashboardList.tasks]
        : [];
      const listIndex = listClone.findIndex(
        task => task.id === action.payload.taskId,
      );

      if (listIndex !== -1) {
        listClone[listIndex] = {
          ...listClone[listIndex],
          is_complete: listClone[listIndex].is_complete === 1 ? 0 : 1,
        };
      }

      if (state.taskDetail) {
        const taskComplete = [...state.taskDetail.subtasks];
        const taskCompletIndex = taskComplete.findIndex(
          task => task.id === action.payload.taskId,
        );
        if (taskCompletIndex !== -1) {
          taskComplete[taskCompletIndex] = {
            ...taskComplete[taskCompletIndex],
            is_complete:
              taskComplete[taskCompletIndex].is_complete === 1 ? 0 : 1,
          };
        }
        state.dashboardList = state.dashboardList
          ? {
              ...state.dashboardList,
              tasks: listClone,
            }
          : null;
        state.taskComplete = action.payload.data;
        state.taskDetail = {
          ...state.taskDetail,
          is_complete:
            action.payload.state !== 'task'
              ? state.taskDetail?.is_complete
              : state.taskDetail.is_complete === 1
              ? 0
              : 1,
          subtasks: [...taskComplete],
        };
      } else {
        state.dashboardList = state.dashboardList
          ? {
              ...state.dashboardList,
              tasks: listClone,
            }
          : null;
        state.taskComplete = action.payload.data;
      }
    },
    saveTaskListComplete(
      state,
      action: PayloadAction<{taskId: string; parentId?: string}>,
    ) {
      if (!state.taskList && state.taskDetail) {
        const taskDetailClone = [...state.taskDetail.subtasks];
        const taskDetailIndex = taskDetailClone.findIndex(
          val => val.id === action.payload.taskId,
        );

        if (taskDetailIndex !== -1) {
          taskDetailClone[taskDetailIndex] = {
            ...taskDetailClone[taskDetailIndex],
            is_complete:
              taskDetailClone[taskDetailIndex].is_complete === 1 ? 0 : 1,
          };
        }
        state.taskDetail = state.taskDetail
          ? {
              ...state.taskDetail,
              is_complete:
                action.payload.parentId === undefined
                  ? state.taskDetail.is_complete === 1
                    ? 0
                    : 1
                  : state.taskDetail.is_complete === 1,
              subtasks: [...taskDetailClone],
            }
          : null;
      } else if (state.taskList) {
        const taskListClone = [...state.taskList.data];

        taskListClone.forEach((item, index) => {
          taskListClone[index].data = taskListClone[index].data.map(
            (item: any) =>
              item.id === action.payload.parentId ||
              item.id === action.payload.taskId
                ? {
                    ...item,
                    is_complete:
                      action.payload.parentId === undefined
                        ? item.is_complete === 1
                          ? 0
                          : 1
                        : item.is_complete,
                    subtasks: item.subtasks?.map((subItem: any) =>
                      subItem.id === action.payload.taskId
                        ? {
                            ...subItem,
                            is_complete: subItem.is_complete === 1 ? 0 : 1,
                          }
                        : subItem,
                    ),
                  }
                : item,
          );
        });

        if (state.taskDetail) {
          const taskDetailClone = [...state.taskDetail.subtasks];
          const taskDetailIndex = taskDetailClone.findIndex(
            val => val.id === action.payload.taskId,
          );

          if (taskDetailIndex !== -1) {
            taskDetailClone[taskDetailIndex] = {
              ...taskDetailClone[taskDetailIndex],
              is_complete:
                taskDetailClone[taskDetailIndex].is_complete === 1 ? 0 : 1,
            };
          }
          state.taskList = {data: taskListClone};
          state.taskDetail = state.taskDetail
            ? {
                ...state.taskDetail,
                is_complete:
                  action.payload.parentId === undefined
                    ? state.taskDetail.is_complete === 1
                      ? 0
                      : 1
                    : state.taskDetail.is_complete,
                subtasks: [...taskDetailClone],
              }
            : null;
        } else if (state.taskListId) {
          const taskListCloneId = [...state.taskListId.data];
          taskListCloneId.forEach((item, index) => {
            taskListCloneId[index].data = taskListCloneId[index].data.map(
              (item: any) =>
                item.id === action.payload.parentId ||
                item.id === action.payload.taskId
                  ? {
                      ...item,
                      is_complete:
                        action.payload.parentId === undefined
                          ? item.is_complete === 1
                            ? 0
                            : 1
                          : item.is_complete,
                      subtasks: item.subtasks?.map((subItem: any) =>
                        subItem.id === action.payload.taskId
                          ? {
                              ...subItem,
                              is_complete: subItem.is_complete === 1 ? 0 : 1,
                            }
                          : subItem,
                      ),
                    }
                  : item,
            );
          });
          state.taskList = {data: taskListClone};
          state.taskListId = {data: taskListCloneId};
          state.taskDetail = state.taskDetail
            ? {
                ...state.taskDetail,
                is_complete: state.taskDetail.is_complete === 1 ? 0 : 1,
              }
            : null;
        } else {
          state.taskList = {data: taskListClone};
        }
      }
    },
    saveTaskList(state, action: PayloadAction<any>) {
      state.taskList = action.payload;
    },
    saveTaskDetail(state, action: PayloadAction<any>) {
      state.taskDetail = action.payload;
    },
    saveTaskDelete(state, action: PayloadAction<{taskId: string}>) {
      const deleteClone = state.taskList ? [...state.taskList.data] : [];
      deleteClone.forEach((taskGroup, index) => {
        if (taskGroup.data) {
          taskGroup.data = taskGroup.data.filter(
            (task: any) => task.id !== action.payload.taskId,
          );
        }
      });
      state.taskList = {data: deleteClone};

      if (state.taskListId) {
        const deleteCloneId = [...state.taskListId.data];
        deleteCloneId.forEach((taskGroup, index) => {
          if (taskGroup.data) {
            taskGroup.data = taskGroup.data.filter(
              (task: any) => task.id !== action.payload.taskId,
            );
          }
        });
        state.taskListId = {data: deleteCloneId};
      }
    },
    saveTaskListLoadMore(state, action: PayloadAction<any>) {
      if (state.taskList) {
        state.taskList = {
          ...state.taskList,
          ...action.payload,
          data: [...state.taskList.data, ...action.payload.data],
        };
      }
    },
    saveTaskAdd(state, action: PayloadAction<any>) {
      state.taskAdd = action.payload;
    },
    saveGroupList(state, action: PayloadAction<any>) {
      state.groupList = action.payload;
    },
    saveTotalCount(state, action: PayloadAction<any>) {
      state.total_count = action.payload;
    },
    saveUserList(state, action: PayloadAction<any>) {
      state.userList = action.payload;
    },
    saveMyConnections(state, action: PayloadAction<any>) {
      state.myConnections = action.payload;
    },
    saveTaskListId(state, action: PayloadAction<any>) {
      state.taskListId = action.payload;
    },
    saveItineraryDetails(state, action: PayloadAction<any>) {
      state.itineraryDetails = action.payload;
    },
    updateContactStatus: (
      state,
      action: PayloadAction<{data: {mobile_no: string}}>,
    ) => {
      const contactListClone = Array.isArray(state.contactList)
        ? [...state.contactList]
        : [];
      const contactIndex = contactListClone.findIndex(
        contact => contact.mobile_no === action.payload.data.mobile_no,
      );
      if (contactIndex !== -1) {
        const currentStatus = contactListClone[contactIndex].status;

        contactListClone[contactIndex] = {
          ...contactListClone[contactIndex],
          status:
            currentStatus === 'invite'
              ? 'send'
              : currentStatus === 'add'
              ? 'pending'
              : currentStatus,
        };
        console.log('contactListClone', contactListClone);
        state.contactList = contactListClone;
      }
    },

    saveItineraryList(state, action: PayloadAction<any>) {
      state.itineraryList = action.payload;
    },
    saveItineraryDraftList(state, action: PayloadAction<any>) {
      state.itineraryDraftList = action.payload;
    },
    saveContactList(state, action: PayloadAction<any>) {
      state.contactList = action.payload.data;
    },
    resetItineraryDetails(state) {
      state.itineraryDetails = null;
    },
    resetTaskDetail(state) {
      state.taskDetail = null;
    },
  },
});

export const {
  showModal,
  saveDashboard,
  updateDashboard,
  saveTaskComplete,
  saveTaskListComplete,
  saveTaskList,
  saveTaskDetail,
  saveTaskDelete,
  saveTaskListLoadMore,
  saveTaskAdd,
  saveGroupList,
  saveTotalCount,
  saveUserList,
  saveMyConnections,
  saveTaskListId,
  saveItineraryDetails,
  saveItineraryList,
  updateContactStatus,
  saveItineraryDraftList,
  saveContactList,
  resetItineraryDetails,
  resetTaskDetail,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
