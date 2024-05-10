import { DASHBOARD_TYPE } from '@constants';
import moment from 'moment';

let initialState = {
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
  contactList: null,
  itineraryList: null,
  itineraryDraftList: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DASHBOARD_TYPE.SHOW_MODAL:
      return {
        ...state,
        showModal: action.data,
      };
    case DASHBOARD_TYPE.SAVE_DASHBOARD:
      return {
        ...state,
        dashboardList: { ...action.data, total: action.total_task_count, totalChat: action.total_chat_count },
      };

    case DASHBOARD_TYPE.UPDATE_DASHBOARD:
      return {
        ...state,
        dashboardList: {
          ...state.dashboardList,
          totalChat: action.total_chat_count,
          chats: action.data,
        },
      };

    case DASHBOARD_TYPE.SAVE_TASK_COMPLETE:
      const listClone = [...state.dashboardList.tasks];
      const listIndex = listClone.findIndex(task => task.id === action.taskId);

      if (listIndex !== -1) {
        listClone[listIndex] = {
          ...listClone[listIndex],
          is_complete: listClone[listIndex].is_complete === 1 ? 0 : 1,
        };
      }
      if (state.taskDetail) {
        const taskComplete = [...state.taskDetail.subtasks];
        const taskCompletIndex = taskComplete.findIndex(task => task.id === action.taskId);
        if (taskCompletIndex !== -1) {
          taskComplete[taskCompletIndex] = {
            ...taskComplete[taskCompletIndex],
            is_complete: taskComplete[taskCompletIndex].is_complete === 1 ? 0 : 1,
          };
        }
        return {
          ...state,
          dashboardList: {
            ...state.dashboardList,
            tasks: listClone,
          },
          // taskList: taskListClone,
          taskComplete: action.data,
          taskDetail: {
            ...state.taskDetail,

            is_complete: action.state !== 'task' ? state.taskDetail?.is_complete : state.taskDetail.is_complete === 1 ? 0 : 1,
            subtasks: [...taskComplete],
          },
        };
      }
      return {
        ...state,
        dashboardList: {
          ...state.dashboardList,
          tasks: listClone,
        },
        // taskList: taskListClone,
        taskComplete: action.data,
      };
    case DASHBOARD_TYPE.SAVE_TASK_LIST_COMPLETE:
      if (!state?.taskList && state?.taskDetail) {
        console.log('2222223232323332323');
        const taskDetailClone = [...state?.taskDetail?.subtasks];
        const taskDetailIndex = taskDetailClone?.findIndex(val => val?.id === action?.taskId);

        if (taskDetailIndex !== -1) {
          taskDetailClone[taskDetailIndex] = {
            ...taskDetailClone[taskDetailIndex],
            is_complete: taskDetailClone[taskDetailIndex].is_complete === 1 ? 0 : 1,
          };
        }
        return {
          ...state,

          taskDetail: state.taskDetail
            ? {
                ...state.taskDetail,
                is_complete:
                  action?.parentId === undefined ? (state.taskDetail.is_complete === 1 ? 0 : 1) : state.taskDetail.is_complete === 1,
                subtasks: [...taskDetailClone],
              }
            : null,
        };
      }
      if (state?.taskList) {
        const taskListClone = [...state?.taskList?.data];

        taskListClone?.forEach((item, index) => {
          taskListClone[index].data = taskListClone[index]?.data?.map(item =>
            item.id === action?.parentId || item.id === action.taskId
              ? {
                  ...item,
                  is_complete: action?.parentId === undefined ? (item.is_complete === 1 ? 0 : 1) : item.is_complete,
                  subtasks: item?.subtasks?.map(subItem =>
                    subItem?.id === action?.taskId ? { ...subItem, is_complete: subItem?.is_complete === 1 ? 0 : 1 } : subItem,
                  ),
                }
              : item,
          );
        });
        if (state?.taskDetail) {
          console.log('state?.taskdetal.... 111', action?.parentId);
          const taskDetailClone = [...state?.taskDetail?.subtasks];
          const taskDetailIndex = taskDetailClone?.findIndex(val => val?.id === action?.taskId);

          if (taskDetailIndex !== -1) {
            taskDetailClone[taskDetailIndex] = {
              ...taskDetailClone[taskDetailIndex],
              is_complete: taskDetailClone[taskDetailIndex].is_complete === 1 ? 0 : 1,
            };
          }
          return {
            ...state,
            taskList: {
              data: taskListClone,
            },
            taskDetail: state.taskDetail
              ? {
                  ...state.taskDetail,
                  is_complete: action?.parentId === undefined ? (state.taskDetail.is_complete === 1 ? 0 : 1) : state.taskDetail.is_complete,
                  subtasks: [...taskDetailClone],
                }
              : null,
          };
        }
        if (state?.taskListId) {
          const taskListCloneId = [...state?.taskListId?.data];
          taskListCloneId?.forEach((item, index) => {
            taskListCloneId[index].data = taskListCloneId[index]?.data?.map(item =>
              item.id === action?.parentId || item.id === action.taskId
                ? {
                    ...item,
                    is_complete: action?.parentId === undefined ? (item.is_complete === 1 ? 0 : 1) : item.is_complete,
                    subtasks: item?.subtasks?.map(subItem =>
                      subItem?.id === action?.taskId ? { ...subItem, is_complete: subItem?.is_complete === 1 ? 0 : 1 } : subItem,
                    ),
                  }
                : item,
            );
          });
          return {
            ...state,
            taskList: {
              data: taskListClone,
            },
            taskListId: {
              data: taskListCloneId,
            },
            taskDetail: state.taskDetail
              ? {
                  ...state.taskDetail,
                  is_complete: state.taskDetail.is_complete === 1 ? 0 : 1,
                  // subtasks: [...taskDetailClone],
                }
              : null,
          };
        }
        return {
          ...state,
          taskList: {
            data: taskListClone,
          },
        };
      }
    case DASHBOARD_TYPE.SAVE_TASK_LIST:
      return {
        ...state,
        // taskList: { ...action.data, total_count: action.total_count, total_pages: action.total_pages },
        taskList: action.data,
        // total_count: action.total_count,
        // total_pages: action.total_page,
      };
    case DASHBOARD_TYPE.SAVE_TASK_DETAIL:
      return {
        ...state,
        taskDetail: action.data,
      };

    case DASHBOARD_TYPE.SAVE_TASK_DELETE:
      if (state?.taskListId && !state?.taskList) {
        const deleteCloneId = [...state?.taskListId?.data];
        if (deleteCloneId[0]?.data?.length) deleteCloneId[0].data = deleteCloneId[0]?.data?.filter(task => task.id !== action.taskId);
        if (deleteCloneId[1]?.data?.length) deleteCloneId[1].data = deleteCloneId[1]?.data?.filter(task => task.id !== action.taskId);
        if (deleteCloneId[2]?.data?.length) deleteCloneId[2].data = deleteCloneId[2]?.data?.filter(task => task.id !== action.taskId);
        if (deleteCloneId[3]?.data?.length) deleteCloneId[3].data = deleteCloneId[3]?.data?.filter(task => task.id !== action.taskId);
        return {
          ...state,
          taskListId: {
            ...state.taskListId,
            data: deleteCloneId,
          },
        };
      }
      if (state?.taskList) {
        const deleteClone = [...state?.taskList?.data];
        if (deleteClone[0]?.data?.length) deleteClone[0].data = deleteClone[0]?.data?.filter(task => task.id !== action.taskId);
        if (deleteClone[1]?.data?.length) deleteClone[1].data = deleteClone[1]?.data?.filter(task => task.id !== action.taskId);
        if (deleteClone[2]?.data?.length) deleteClone[2].data = deleteClone[2]?.data?.filter(task => task.id !== action.taskId);
        if (deleteClone[3]?.data?.length) deleteClone[3].data = deleteClone[3]?.data?.filter(task => task.id !== action.taskId);
        if (state?.taskListId) {
          const deleteCloneId = [...state?.taskListId?.data];
          if (deleteCloneId[0]?.data?.length) deleteCloneId[0].data = deleteCloneId[0]?.data?.filter(task => task.id !== action.taskId);
          if (deleteCloneId[1]?.data?.length) deleteCloneId[1].data = deleteCloneId[1]?.data?.filter(task => task.id !== action.taskId);
          if (deleteCloneId[2]?.data?.length) deleteCloneId[2].data = deleteCloneId[2]?.data?.filter(task => task.id !== action.taskId);
          if (deleteCloneId[3]?.data?.length) deleteCloneId[3].data = deleteCloneId[3]?.data?.filter(task => task.id !== action.taskId);
          return {
            ...state,
            taskList: {
              ...state.taskList,
              data: deleteClone,
            },
            taskListId: {
              ...state.taskListId,
              data: deleteCloneId,
            },
          };
        }
        return {
          ...state,
          taskList: {
            ...state.taskList,
            data: deleteClone,
          },
        };
      }
    case DASHBOARD_TYPE.SAVE_TASK_LIST_LOAD_MORE:
      return {
        ...state,
        taskList: {
          ...state.taskList,
          ...action.data,
        },
      };

    case DASHBOARD_TYPE.SAVE_TASK_ADD:
      if (state?.taskListId && !state?.taskList) {
        const createIdClone = [...state?.taskListId?.data];
        if (action.data.date === moment(new Date()).format('MM/DD/yyyy')) {
          createIdClone[0].data = [action.data, ...createIdClone[0].data];
        } else if (action.data.date === moment(new Date()).add(1, 'days').format('MM/DD/yyyy')) {
          createIdClone[1].data = [action.data, ...createIdClone[1].data];
        } else {
          createIdClone[2].data = [action.data, ...createIdClone[2].data];
        }
        return {
          ...state,
          taskListId: {
            ...state.taskListId,
            data: createIdClone,
          },
        };
      }
      if (state?.taskList) {
        const createClone = [...state?.taskList?.data];
        if (action.data.date === moment(new Date()).format('MM/DD/yyyy')) {
          createClone[0].data = [action.data, ...createClone[0].data];
        } else if (action.data.date === moment(new Date()).add(1, 'days').format('MM/DD/yyyy')) {
          createClone[1].data = [action.data, ...createClone[1].data];
        } else {
          createClone[2].data = [action.data, ...createClone[2].data];
        }
        if (state?.taskListId) {
          const createIdClone = [...state?.taskListId?.data];
          if (action.data.date === moment(new Date()).format('MM/DD/yyyy')) {
            createIdClone[0].data = [action.data, ...createIdClone[0].data];
          } else if (action.data.date === moment(new Date()).add(1, 'days').format('MM/DD/yyyy')) {
            createIdClone[1].data = [action.data, ...createIdClone[1].data];
          } else {
            createIdClone[2].data = [action.data, ...createIdClone[2].data];
          }
          return {
            ...state,
            taskList: {
              ...state.taskList,
              data: createClone,
            },
            taskListId: {
              ...state.taskListId,
              data: createIdClone,
            },
          };
        }
        return {
          ...state,
          taskList: {
            ...state.taskList,
            data: createClone,
          },
        };
      }

    case DASHBOARD_TYPE.SAVE_TASK_UPDATE:
      if (state?.taskListId && !state?.taskList) {
        const taskUpdateIdClone = [...state?.taskListId?.data];
        taskUpdateIdClone[0].data = taskUpdateIdClone[0]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));
        taskUpdateIdClone[1].data = taskUpdateIdClone[1]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));
        taskUpdateIdClone[2].data = taskUpdateIdClone[2]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));

        return {
          ...state,
          taskListId: {
            data: taskUpdateIdClone,
          },
        };
      }
      if (state?.taskList) {
        const taskUpdateClone = [...state?.taskList?.data];
        taskUpdateClone[0].data = taskUpdateClone[0]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));
        taskUpdateClone[1].data = taskUpdateClone[1]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));
        taskUpdateClone[2].data = taskUpdateClone[2]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));
        if (state?.taskListId) {
          const taskUpdateIdClone = [...state?.taskListId?.data];
          taskUpdateIdClone[0].data = taskUpdateIdClone[0]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));
          taskUpdateIdClone[1].data = taskUpdateIdClone[1]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));
          taskUpdateIdClone[2].data = taskUpdateIdClone[2]?.data?.map(item => (item.id === action.taskId ? { ...action.data } : item));

          return {
            ...state,
            taskList: {
              data: taskUpdateClone,
            },
            taskListId: {
              data: taskUpdateIdClone,
            },
          };
        }
        return {
          ...state,
          taskList: {
            data: taskUpdateClone,
          },
        };
      }

    case DASHBOARD_TYPE.SAVE_GROUP_LIST:
      return {
        ...state,
        groupList: action.data,
      };
    case DASHBOARD_TYPE.SAVE_GROUP_LIST_LOAD_MORE:
      return {
        ...state,
        groupList: {
          ...state.groupList,
          ...action.data,
          data: [...state.groupList.data, ...action.data.data],
        },
      };

    case DASHBOARD_TYPE.SAVE_GROUP_ADD:
      return {
        ...state,
        groupList: action.data,
      };

    case DASHBOARD_TYPE.SAVE_USER_ALL:
      return {
        ...state,
        userList: action.data,
      };

    case DASHBOARD_TYPE.SAVE_USER_ALL_LOAD_MORE:
      return {
        ...state,
        userList: {
          ...state.userList,
          ...action.data,
          data: [...state.userList.data, ...action.data.data],
        },
      };

    case DASHBOARD_TYPE.SAVE_MY_CONNECTIONS:
      return {
        ...state,
        myConnections: action.data,
      };
    case DASHBOARD_TYPE.SAVE_MY_CONNECTIONS_LOAD_MORE:
      return {
        ...state,
        myConnections: {
          ...state?.myConnections,
          ...action?.data,
          data: [...state?.myConnections?.data, ...action?.data?.data],
        },
      };
    case DASHBOARD_TYPE.SEND_INVITATION:
      return {
        ...state,
        // contectList:
      };
    case DASHBOARD_TYPE.TASK_LIST_GROUP_ID:
      return {
        ...state,
        taskListId: action.data,
        // contectList:
      };
    case DASHBOARD_TYPE.CLEAR_TASK:
      return {
        ...state,
        taskListId: null,
        // contectList:
      };
    case DASHBOARD_TYPE.SAVE_ITINERARY_DETAILS:
      return {
        ...state,
        itineraryDetails: action?.data,
      };
    case DASHBOARD_TYPE.SAVE_CONTACT:
      return {
        ...state,
        contactList: action?.data,
      };
    case DASHBOARD_TYPE.UPDATE_CONTACT:
      const contactListClone = [...state?.contactList];
      const contactListIndex = contactListClone?.findIndex(val => val?.mobile_no === action?.data?.mobile_no);

      if (contactListIndex !== -1) {
        contactListClone[contactListIndex] = {
          ...contactListClone[contactListIndex],
          status:
            contactListClone[contactListIndex].status === 'invite'
              ? 'send'
              : contactListClone[contactListIndex].status === 'add'
              ? 'pending'
              : contactListClone[contactListIndex].status,
        };
      }
      return {
        ...state,
        contactList: contactListClone,
      };
    case DASHBOARD_TYPE.SAVE_ITINERARY_LIST:
      return {
        ...state,
        itineraryList: action.data,
      };
    case DASHBOARD_TYPE.SAVE_DRAFT_ITINERARY_LIST:
      return {
        ...state,
        itineraryDraftList: action.data,
      };
    case DASHBOARD_TYPE.ADD_TO_EVENT:
      const clonevent = [...state?.itineraryDetails?.events];
      const eventStateIndex = clonevent?.findIndex(item => item?.id === action?.Id);
      if (eventStateIndex !== -1) {
        clonevent[eventStateIndex] = {
          ...clonevent[eventStateIndex],
          is_calendar: clonevent[eventStateIndex].is_calendar === 1 ? 0 : 1,
        };
      }

      return {
        ...state,

        itineraryDetails: {
          ...state.itineraryDetails,
          events: clonevent,
        },
      };

    case DASHBOARD_TYPE.USER_PIN:
      const cloneContact = [...state?.myConnections?.data];
      const contactStateIndex = cloneContact?.findIndex(item => item?.user_id === action?.userId);
      if (contactStateIndex !== -1) {
        cloneContact[contactStateIndex] = {
          ...cloneContact[contactStateIndex],
          is_pin: cloneContact[contactStateIndex].is_pin === 1 ? 0 : 1,
        };
      }

      return {
        ...state,
        myConnections: {
          ...state.myConnections,
          data: cloneContact,
        },
      };
    default:
      return state;
  }
}
