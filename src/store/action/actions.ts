import {AppDispatch} from '../store';
import NetInfo from '@react-native-community/netinfo';
import {
  apiLoading,
  userData,
  themeChange,
  alertData,
  toastData,
  notificationList,
  notificationListStart,
  notificationListLoadMore,
  notificationRead,
  notificationClearAll,
  notificationCount,
  updateSettings,
  soundName,
  soundSidenoteName,
  setIsOnboardingFinished,
  networkStatus,
} from '../reducer/reducer';
import {Dark} from '../../theme';

export function networkListener() {
  return (dispatch: AppDispatch) => {
    NetInfo.addEventListener(state => {
      dispatch(networkStatus(state.isConnected));
    });
  };
}

export function saveUserData(params: any) {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      dispatch(userData(params));
      resolve(true);
    });
  };
}

export function setTheme(theme: typeof Dark) {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      dispatch(themeChange(theme));
      resolve(true);
    });
  };
}

export function alertHandler(params: any) {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      dispatch(alertData(params));
      resolve(true);
    });
  };
}

export function showErrorAlert(
  title: string = '',
  msg: string = '',
  onPress: () => void = () => {},
) {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      setTimeout(() => {
        dispatch(
          alertData({
            isShowAlert: true,
            alertTitle: title,
            alertMsg: msg,
            successBtnTitle: '',
            cancelBtnTitle: '',
          }),
        );
        resolve(true);
      }, 700);
    });
  };
}

export function hideErrorAlert() {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      dispatch(
        alertData({
          isShowAlert: false,
          alertTitle: '',
          alertMsg: '',
          successBtnTitle: '',
          cancelBtnTitle: '',
        }),
      );
      resolve(true);
    });
  };
}

export function showToast(title: string = '', msg: string = '') {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      setTimeout(() => {
        dispatch(
          toastData({
            isShowToast: true,
            toastTitle: title,
            toastMsg: msg,
          }),
        );
        resolve(true);
      }, 700);
    });
  };
}

export function hideToast() {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      dispatch(
        toastData({
          isShowToast: false,
          toastTitle: '',
          toastMsg: '',
        }),
      );
      resolve(true);
    });
  };
}

export function showLoading(isLoading: boolean) {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      dispatch(apiLoading(isLoading));
      resolve(true);
    });
  };
}

export function saveReduxData(key: string, params: any) {
  return (dispatch: AppDispatch) => {
    return new Promise(resolve => {
      dispatch({type: key, ...params});
      resolve(true);
    });
  };
}

export function notificationListAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(notificationList(data));
  };
}

export function notificationListStartAction() {
  return (dispatch: AppDispatch) => {
    dispatch(notificationListStart());
  };
}

export function notificationListLoadMoreAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(notificationListLoadMore(data));
  };
}

export function notificationReadAction(data: any, id: number) {
  return (dispatch: AppDispatch) => {
    dispatch(notificationRead({id}));
  };
}

export function notificationClearAllAction() {
  return (dispatch: AppDispatch) => {
    dispatch(notificationClearAll());
  };
}

export function notificationCountAction() {
  return (dispatch: AppDispatch) => {
    dispatch(notificationCount());
  };
}

export function updateSettingsAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(updateSettings(data));
  };
}

export function soundNameAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(soundName(data));
  };
}

export function soundSidenoteNameAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(soundSidenoteName(data));
  };
}

export function setIsOnBoardingFinishedAction(data: boolean) {
  return (dispatch: AppDispatch) => {
    dispatch(setIsOnboardingFinished(data));
  };
}
