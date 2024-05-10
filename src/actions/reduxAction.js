// COMOPONENT

import NetInfo from '@react-native-community/netinfo';

//import constants
import { RED_TYPE } from '@constants';

//Getting network reachability to check internet connection
export function networkListner() {
  return (dispatch, getState) => {
    NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);

      return dispatch({
        type: RED_TYPE.NETWORK_STATUS,
        isOnline: state.isConnected,
      });
    });
  };
}

// Save user information & access in whole app
export function saveUserData(params) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: RED_TYPE.USER_DATA,
        ...params,
      });
      resolve(true);
    });
  };
}

export function setTheme(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: RED_TYPE.THEME_CHANGE,
        theme: params,
      });
      resolve(true);
    });
  };
}
// Save alert data to toggle alert
export function alertHandlar(params) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: RED_TYPE.ALERT_DATA,
        ...params,
      });
      resolve(true);
    });
  };
}

// Save alert data to toggle alert
export function showErrorAlert(title = '', msg = '', onPress = () => {}) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch({
          type: RED_TYPE.ALERT_DATA,
          alertData: {
            isShowAlert: true,
            alertTitle: title,
            alertMsg: msg,
            onPressOk: onPress,
          },
        });
        resolve(true);
      }, 700);
    });
  };
}

// Save alert data to toggle alert
export function hideErrorAlert() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: RED_TYPE.ALERT_DATA,
        alertData: {
          alertTitle: '',
          alertMsg: '',
          isShowAlert: false,
          onPressOk: () => {},
        },
      });
      resolve(true);
    });
  };
}

// Save alert data to toggle alert
export function showToast(title = '', msg = '') {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch({
          type: RED_TYPE.TOAST_DATA,
          toastData: {
            isShowToast: true,
            toastTitle: title,
            toastMsg: msg,
          },
        });
        resolve(true);
      }, 700);
    });
  };
}

// Save alert data to toggle alert
export function hideToast() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: RED_TYPE.TOAST_DATA,
        toastData: {
          isShowToast: false,
          toastTitle: '',
          toastMsg: '',
        },
      });
      resolve(true);
    });
  };
}

// Toggle loading when api calling
export function showLoading(isLoading) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: RED_TYPE.API_LOADING,
        isLoading: isLoading,
      });
      resolve(true);
    });
  };
}

// handle reducer value
export function saveReduxData(key, params) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: RED_TYPE[key],
        ...params,
      });
      resolve(true);
    });
  };
}

export function notificationList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.NOTIFICATION_LIST,
      data,
    });
  };
}
export function notificationListStart() {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.NOTIFICATION_LIST_START,
    });
  };
}

export function notificationListLoadMore(data) {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.NOTIFICATION_LIST_LOAD_MORE,
      data,
    });
  };
}

export function notificationRead(data, id) {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.NOTIFICATION_READ,
      data,
      id,
    });
  };
}

export function notificationClearAll() {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.NOTIFICATION_CLEAR_ALL,
    });
  };
}

export function notificationCount() {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.NOTIFICATION_COUNT,
    });
  };
}

export function updateSettings(data) {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.UPDATE_SETTINGS,
      data,
    });
  };
}

export function soundName(data) {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.SOUND_NAME,
      data,
    });
  };
}
export function soundSidenoteName(data) {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.SOUND_SIDENOTE_NAME,
      data,
    });
  };
}

export function setIsOnBoardingFinished(data) {
  return (dispatch, getState) => {
    dispatch({
      type: RED_TYPE.SET_IS_ONBOARDING_FINISHED,
      data,
    });
  };
}
