import { EVENT_TYPE } from '@constants';
import moment from 'moment';

let initialState = {
  eventList: null,
  eventDetail: null,
  eventListID: null,
  eventTaskDetail: null,
  monthlyEventList: null,
  sidenoteList: null,
  connectionList: null,
  monthlyTaskList: null,
  pinnedUser: null,
  // eventAdd: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case EVENT_TYPE.MONTHLY_SAVE_EVENT_LIST:
      return {
        ...state,
        monthlyEventList: action.data,
      };
    case EVENT_TYPE.MONTHLY_SAVE_EVENT_LIST_LOAD_MORE:
      return {
        ...state,
        monthlyEventList: {
          ...state.monthlyEventList,
          ...action.data,
          data: [...state.monthlyEventList?.data, ...action?.data?.data],
        },
      };
    case EVENT_TYPE.MONTHLY_SAVE_TASK_LIST:
      return {
        ...state,
        monthlyTaskList: action.data,
      };
    case EVENT_TYPE.MONTHLY_SAVE_TASK_LIST_LOAD_MORE:
      return {
        ...state,
        monthlyTaskList: {
          ...state.monthlyTaskList,
          ...action.data,
          data: [...state.monthlyTaskList?.data, ...action?.data?.data],
        },
      };
    case EVENT_TYPE.SAVE_SIDENOTE_LIST:
      return {
        ...state,
        sidenoteList: action.data,
      };
    case EVENT_TYPE.SAVE_SIDENOTE_LIST_LOAD_MORE:
      return {
        ...state,
        sidenoteList: {
          ...state.sidenoteList,
          ...action.data,
          data: [...state.sidenoteList?.data, ...action?.data?.data],
        },
      };
    case EVENT_TYPE.SAVE_CONNECTION_LIST:
      return {
        ...state,
        connectionList: action.data,
      };
    case EVENT_TYPE.SAVE_CONNECTION_LIST_LOAD_MORE:
      return {
        ...state,
        connectionList: {
          ...state.connectionList,
          ...action.data,
          data: [...state.connectionList?.data, ...action?.data?.data],
        },
      };
    case EVENT_TYPE.SAVE_EVENT_LIST:
      return {
        ...state,
        eventList: action.data,
      };

    case EVENT_TYPE.SAVE_EVENT_LIST_LOAD_MORE:
      return {
        ...state,
        eventList: {
          ...state.eventList,
          ...action.data,
          data: [...state.eventList?.data, ...action?.data?.data],
        },
      };
    case EVENT_TYPE.SAVE_EVENT_DETAIL:
      return {
        ...state,
        eventDetail: action.data,
      };
    case EVENT_TYPE.SAVE_EVENT_ADD:
      const createEventClone = [...state?.eventList?.data];
      if (action.data.date === moment(new Date()).format('MM/DD/yyyy')) {
        if (createEventClone[0]?.data) createEventClone[0].data = [action.data, ...createEventClone[0].data];
        else createEventClone[0] = { data: [action.data] };
      } else if (action.data.date === moment(new Date()).add(1, 'days').format('MM/DD/yyyy')) {
        if (createEventClone[1]?.data) createEventClone[1].data = [action.data, ...createEventClone[1].data];
        else createEventClone[1] = { data: [action.data] };
      } else {
        if (createEventClone[2]?.data) createEventClone[2].data = [action.data, ...createEventClone[2].data];
        else createEventClone[2] = { data: [action.data] };
      }
      if (state?.eventListID) {
        const createIdClone = [...state?.eventListID?.data];
        if (action.data.date === moment(new Date()).format('MM/DD/yyyy')) {
          if (createIdClone[0]?.data) createIdClone[0].data = [action.data, ...createIdClone[0].data];
          else createIdClone[0] = { data: [action.data] };
        } else if (action.data.date === moment(new Date()).add(1, 'days').format('MM/DD/yyyy')) {
          if (createIdClone[1]?.data) createIdClone[1].data = [action.data, ...createIdClone[1].data];
          else createIdClone[1] = { data: [action.data] };
        } else {
          if (createIdClone[2]?.data) createIdClone[2].data = [action.data, ...createIdClone[2].data];
          else createIdClone[2] = { data: [action.data] };
        }
        // if (action.data.date === moment(new Date()).format('MM/DD/yyyy')) {
        //   createIdClone[0].data = [action.data, ...createIdClone[0].data];
        // } else if (action.data.date === moment(new Date()).add(1, 'days').format('MM/DD/yyyy')) {
        //   createIdClone[1].data = [action.data, ...createIdClone[1].data];
        // } else {
        //   createIdClone[2].data = [action.data, ...createIdClone[2].data];
        // }
        return {
          ...state,
          eventList: {
            ...state.eventList,
            data: createEventClone,
          },
          eventListID: {
            ...state.eventListID,
            data: createIdClone,
          },
        };
      }
      return {
        ...state,
        eventList: {
          ...state.eventList,
          data: createEventClone,
        },
      };
    case EVENT_TYPE.SAVE_EVENT_DELETE:
      const eventDeleteClone = [...state?.eventList?.data];

      if (eventDeleteClone[0]?.data?.length)
        eventDeleteClone[0].data = eventDeleteClone[0]?.data?.filter(event => event.id !== action.eventId);
      if (eventDeleteClone[1]?.data?.length)
        eventDeleteClone[1].data = eventDeleteClone[1]?.data?.filter(event => event.id !== action.eventId);
      if (eventDeleteClone[2]?.data?.length)
        eventDeleteClone[2].data = eventDeleteClone[2]?.data?.filter(event => event.id !== action.eventId);
      if (eventDeleteClone[3]?.data?.length)
        eventDeleteClone[3].data = eventDeleteClone[3]?.data?.filter(event => event.id !== action.eventId);
      if (state.eventListID) {
        const eventDeleteCloneId = [...state?.eventList?.data];

        if (eventDeleteCloneId[0]?.data?.length)
          eventDeleteCloneId[0].data = eventDeleteCloneId[0]?.data?.filter(event => event.id !== action.eventId);
        if (eventDeleteCloneId[1]?.data?.length)
          eventDeleteCloneId[1].data = eventDeleteCloneId[1]?.data?.filter(event => event.id !== action.eventId);
        if (eventDeleteCloneId[2]?.data?.length)
          eventDeleteCloneId[2].data = eventDeleteCloneId[2]?.data?.filter(event => event.id !== action.eventId);
        if (eventDeleteCloneId[3]?.data?.length)
          eventDeleteCloneId[3].data = eventDeleteCloneId[3]?.data?.filter(event => event.id !== action.eventId);
        return {
          ...state,
          eventList: {
            ...state.eventList,
            data: eventDeleteClone,
          },

          eventListID: {
            ...state.eventListID,
            data: eventDeleteCloneId,
          },
        };
      }
      return {
        ...state,
        eventList: {
          ...state.eventList,
          data: eventDeleteClone,
        },
      };

    case EVENT_TYPE.SAVE_EVENT_UPDATE:
      const eventUpdateClone = [...state?.eventList?.data];
      if (eventUpdateClone[0]?.data)
        eventUpdateClone[0].data = eventUpdateClone[0]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));
      if (eventUpdateClone[1]?.data)
        eventUpdateClone[1].data = eventUpdateClone[1]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));
      if (eventUpdateClone[2]?.data)
        eventUpdateClone[2].data = eventUpdateClone[2]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));

      // eventUpdateClone[0].data = eventUpdateClone[0]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));
      // eventUpdateClone[1].data = eventUpdateClone[1]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));
      // eventUpdateClone[2].data = eventUpdateClone[2]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));
      if (state?.eventListID) {
        const eventUpdateIdClone = [...state?.eventListID?.data];
        if (eventUpdateIdClone[0]?.data)
          eventUpdateIdClone[0].data = eventUpdateIdClone[0]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));
        if (eventUpdateIdClone[1]?.data)
          eventUpdateIdClone[1].data = eventUpdateIdClone[1]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));
        if (eventUpdateIdClone[2]?.data)
          eventUpdateIdClone[2].data = eventUpdateIdClone[2]?.data?.map(item => (item.id === action.eventId ? { ...action.data } : item));

        return {
          ...state,
          eventList: {
            data: eventUpdateClone,
          },
          eventListID: {
            data: eventUpdateIdClone,
          },
        };
      }
      return {
        ...state,
        eventList: {
          data: eventUpdateClone,
        },
      };

    case EVENT_TYPE.SAVE_EVENT_PARTICIPATE:
      console.log('action data get ====>', action);
      const participateClone = [...state.eventList.data];

      const participateIndex = participateClone[action.index]?.data.findIndex(event => event.id === action.eventId);

      let newSubPostDetails = {};
      const is_participate = action.going;
      const index = action.index;

      if (participateIndex !== -1) {
        participateClone[index].data[participateIndex] = {
          ...participateClone[index].data[participateIndex],
          is_participate: is_participate,
        };
        newSubPostDetails = state.eventList
          ? {
              ...state.eventList,
              is_participate: is_participate,
            }
          : null;
      }
      if (action.state !== 'eventDetails') {
        return {
          ...state,
          eventList: {
            ...state.eventList,

            data: participateClone,
          },
        };
      } else {
        return {
          ...state,
          eventDetail: {
            ...state.eventDetail,
            is_participate: action.going,
          },
        };
      }
    case EVENT_TYPE.EVENT_DETAIL_PARTICIPATE: {
      return {
        ...state,
        eventDetail: {
          ...state.eventDetail,
          is_participate: action.going,
        },
      };
    }
    case EVENT_TYPE.EVENT_LIST_ID:
      return {
        ...state,
        eventListID: action.data,
      };

    case EVENT_TYPE.EVENT_TASK_DELETE:
      return {
        ...state,
        eventListID: {
          ...state.eventListID,
          data: {
            ...state?.eventListID?.data,
            ...action?.data,
            tasks: [...state?.eventListID?.data?.tasks?.filter(item => item?.id !== action.taskId)],
          },
        },
      };
    case EVENT_TYPE.EVENT_TASK_DETAIL:
      return {
        ...state,
        eventTaskDetail: action.data,
      };
    case EVENT_TYPE.EVENT_TASK_COMPLETE:
      const listClone = [...state.eventDetail.tasks];
      const listIndex = listClone.findIndex(task => task.id === action.taskId);
      if (listIndex !== -1) {
        listClone[listIndex] = {
          ...listClone[listIndex],
          is_complete: listClone[listIndex].is_complete === 1 ? 0 : 1,
        };
      }
      return {
        ...state,
        eventDetail: {
          ...state.eventDetail,
          tasks: listClone,
        },
        eventTaskDetail: {
          ...state.eventTaskDetail,
          is_complete: state.eventTaskDetail?.is_complete === 1 ? 0 : 1,
        },
      };
    case EVENT_TYPE.CLEAR_EVENT:
      return {
        ...state,
        eventListID: null,
      };
    case EVENT_TYPE.ADD_TO_CALENDER_EVENT:
      const eventClone = [...state?.monthlyEventList?.data];
      const eventStateIndex = eventClone?.findIndex(item => item?.id === action?.eventId);
      if (eventStateIndex !== -1) {
        eventClone[eventStateIndex] = {
          ...eventClone[eventStateIndex],
          is_calendar: eventClone[eventStateIndex].is_calendar === 1 ? 0 : 1,
        };
      }
      return {
        ...state,
        monthlyEventList: {
          ...state?.monthlyEventList,
          data: eventClone,
        },
      };
    case EVENT_TYPE.ADD_TO_CALENDER_TASK:
      const taskClone = [...state?.monthlyTaskList?.data];
      const taskStateIndex = taskClone?.findIndex(item => item?.id === action?.taskId);
      if (taskStateIndex !== -1) {
        taskClone[taskStateIndex] = {
          ...taskClone[taskStateIndex],
          is_calendar: taskClone[taskStateIndex].is_calendar === 1 ? 0 : 1,
        };
      }

      return {
        ...state,
        monthlyTaskList: {
          ...state?.monthlyTaskList,
          data: taskClone,
        },
      };

    case EVENT_TYPE.MONTHLY_EVENT_UPDATE:
      const updateEventClone = [...state?.monthlyEventList?.data];
      const updateEventState = updateEventClone?.findIndex(item => item?.id === action?.Id);
      if (updateEventState !== -1) {
        updateEventClone[updateEventState] = {
          ...updateEventClone[updateEventState],
          ...action.data,
        };
      }

      return {
        ...state,
        monthlyEventList: {
          ...state.monthlyEventList,
          data: updateEventClone,
        },
        eventDetail: action?.data,
      };

    case EVENT_TYPE.REMOVE_SIDENOTE:
      return {
        ...state,
        sidenoteList: {
          ...state.sidenoteList,
          data: [...state?.sidenoteList?.data?.filter(item => item?.id !== action.Id)],
        },
      };
    case EVENT_TYPE.REMOVE_CONNECTION:
      return {
        ...state,
        connectionList: {
          ...state.connectionList,
          data: [...state?.connectionList?.data?.filter(item => item?.id !== action.Id)],
        },
      };
    case EVENT_TYPE.PINNED_USER_LIST:
      return {
        ...state,
        pinnedUser: action.data,
      };
    case EVENT_TYPE.PINNED_USER_LIST_LOAD_MORE:
      return {
        ...state,
        pinnedUser: {
          ...state.pinnedUser,
          ...action.data,
          data: [...state.pinnedUser?.data, ...action?.data?.data],
        },
      };
    case EVENT_TYPE.DELETE_MONTHLY_LIST:
      return {
        ...state,
        monthlyTaskList: {
          ...state.monthlyTaskList,
          data: [...state?.monthlyTaskList?.data?.filter(item => item?.id !== action.id)],
        },
      };
    default:
      return state;
  }
}
