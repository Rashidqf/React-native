import { RED_TYPE } from '@constants';

import { localize } from '@languages';
import moment from 'moment';
import ActionButton from 'react-native-circular-action-menu';
import { Dark } from '../themes/colors';

let initialState = {
  resServer: '',
  isLoading: false,
  resError: '',
  isOnline: false,
  userData: {},
  alertData: {
    isShowAlert: false,
    alertTitle: localize('ERR_ALERT_TITLE'),
    alertMsg: localize('ERR_ALERT_MSG'),
    successBtnTitle: localize('OK'),
    cancelBtnTitle: localize('CANCEL'),
  },
  toastData: {
    isShowToast: false,
    toastTitle: localize('ERR_ALERT_TITLE'),
    toastMsg: localize('ERR_ALERT_MSG'),
  },
  searchData: { keyword: '', isForceSearch: false },
  notiList: null,
  settings: null,
  sound: null,
  selectTheme: Dark,
  isOnboardingFinished: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RED_TYPE.API_LOADING:
      return { ...state, isLoading: action.isLoading };
    case RED_TYPE.API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        resServer: action.resServer,
      };
    case RED_TYPE.API_ERROR:
      return {
        ...state,
        isLoading: false,
        resError: action.resError,
      };
    case RED_TYPE.NETWORK_STATUS:
      return {
        ...state,
        isOnline: action.isOnline,
      };

    case RED_TYPE.ALERT_DATA:
      return {
        ...state,
        alertData: action.alertData,
      };
    case RED_TYPE.TOAST_DATA:
      return {
        ...state,
        toastData: action.toastData,
      };
    //user's data
    case RED_TYPE.USER_DATA:
      return {
        ...state,
        userData: { ...state.userData, ...action },
      };
    case RED_TYPE.THEME_CHANGE:
      return {
        ...state,
        selectTheme: action?.theme,
      };
    case RED_TYPE.NOTIFICATION_LIST:
      return {
        ...state,
        notiList: action.data,
      };
    case RED_TYPE.NOTIFICATION_LIST_START:
      return {
        ...state,
        notiList: null,
      };

    case RED_TYPE.NOTIFICATION_LIST_LOAD_MORE:
      return {
        ...state,
        notiList: {
          ...state?.notiList,
          ...action?.data,
          data: [...state?.notiList?.data, ...action?.data?.data],
        },
      };
    case RED_TYPE.NOTIFICATION_READ:
      const notificationClone = [...state?.notiList?.data];
      const notificationIndex = state?.notiList?.data?.findIndex(item => item?.id === action?.id);

      if (notificationIndex !== -1) {
        notificationClone[notificationIndex] = {
          ...notificationClone[notificationIndex],
          read_at: notificationClone[notificationIndex].read_at === null ? moment().format('MM/DD/yyyy') : moment().format('MM/DD/yyyy'),
        };
      }
      return {
        ...state,
        userData: {
          ...state?.userData,
          userInfo: {
            ...state?.userData?.userInfo,
            notification_unread_count: state?.userData?.userInfo.notification_unread_count - 1,
          },
        },
        notiList: {
          ...state?.notiList,
          data: [...notificationClone],
        },
      };
    case RED_TYPE.NOTIFICATION_CLEAR_ALL:
      return {
        ...state,
        userData: {
          ...state?.userData,
          userInfo: {
            ...state?.userData?.userInfo,
            notification_unread_count: 0,
          },
        },
        notiList: {
          ...state?.notiList,
          data: [],
        },
      };
    case RED_TYPE.NOTIFICATION_COUNT:
      return {
        ...state,
        userData: {
          ...state?.userData,
          userInfo: {
            ...state?.userData?.userInfo,
            notification_unread_count: state?.userData?.userInfo.notification_unread_count + 1,
          },
        },
      };
    case RED_TYPE.UPDATE_SETTINGS:
      return {
        ...state,
        settings: action?.data,
      };
    case RED_TYPE.SOUND_NAME:
      return {
        ...state,
        sound: action?.data,
      };
    case RED_TYPE.SOUND_SIDENOTE_NAME:
      return {
        ...state,
        sidenoteSound: action?.data,
      };
    case RED_TYPE.SET_IS_ONBOARDING_FINISHED:
      return {
        ...state,
        isOnboardingFinished: action?.data,
      };
    default:
      return state;
  }
}
