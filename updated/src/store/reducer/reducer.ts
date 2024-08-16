import {localize} from './../../languages/localize';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import moment from 'moment';
import {Dark} from '../../theme';

export interface RedState {
  resServer: string;
  isLoading: boolean;
  resError: string;
  isOnline: boolean;
  userData: Record<string, any>;
  alertData: {
    isShowAlert: boolean;
    alertTitle: string;
    alertMsg: string;
    successBtnTitle: string;
    cancelBtnTitle: string;
  };
  toastData: {
    isShowToast: boolean;
    toastTitle: string;
    toastMsg: string;
  };
  searchData: {keyword: string; isForceSearch: boolean};
  notiList: any;
  settings: any;
  sound: any;
  sidenoteSound: any;
  selectTheme: typeof Dark;
  isOnboardingFinished: boolean;
}

const initialState: RedState = {
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
  searchData: {keyword: '', isForceSearch: false},
  notiList: null,
  settings: null,
  sound: null,
  sidenoteSound: null,
  selectTheme: Dark,
  isOnboardingFinished: false,
};

const redStateSlice = createSlice({
  name: 'redState',
  initialState,
  reducers: {
    apiLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    apiSuccess(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.resServer = action.payload;
    },
    apiError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.resError = action.payload;
    },
    networkStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    alertData(state, action: PayloadAction<Partial<RedState['alertData']>>) {
      state.alertData = {...state.alertData, ...action.payload};
    },
    toastData(state, action: PayloadAction<Partial<RedState['toastData']>>) {
      state.toastData = {...state.toastData, ...action.payload};
    },
    userData(state, action: PayloadAction<Record<string, any>>) {
      state.userData = {...state.userData, ...action.payload};
    },
    themeChange(state, action: PayloadAction<typeof Dark>) {
      state.selectTheme = action.payload;
    },
    notificationList(state, action: PayloadAction<any>) {
      state.notiList = action.payload;
    },
    notificationListStart(state) {
      state.notiList = null;
    },
    notificationListLoadMore(state, action: PayloadAction<any>) {
      state.notiList = {
        ...state.notiList,
        ...action.payload,
        data: [...state.notiList.data, ...action.payload.data],
      };
    },
    notificationRead(state, action: PayloadAction<{id: number}>) {
      const notificationClone = [...state.notiList.data];
      const notificationIndex = state.notiList.data.findIndex(
        (item: any) => item.id === action.payload.id,
      );

      if (notificationIndex !== -1) {
        notificationClone[notificationIndex] = {
          ...notificationClone[notificationIndex],
          read_at:
            notificationClone[notificationIndex].read_at === null
              ? moment().format('MM/DD/yyyy')
              : moment().format('MM/DD/yyyy'),
        };
      }
      state.userData.userInfo.notification_unread_count -= 1;
      state.notiList.data = notificationClone;
    },
    notificationClearAll(state) {
      state.userData.userInfo.notification_unread_count = 0;
      state.notiList.data = [];
    },
    notificationCount(state) {
      state.userData.userInfo.notification_unread_count += 1;
    },
    updateSettings(state, action: PayloadAction<any>) {
      state.settings = action.payload;
    },
    soundName(state, action: PayloadAction<any>) {
      state.sound = action.payload;
    },
    soundSidenoteName(state, action: PayloadAction<any>) {
      state.sidenoteSound = action.payload;
    },
    setIsOnboardingFinished(state, action: PayloadAction<boolean>) {
      state.isOnboardingFinished = action.payload;
    },
  },
});

export const {
  apiLoading,
  apiSuccess,
  apiError,
  networkStatus,
  alertData,
  toastData,
  userData,
  themeChange,
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
} = redStateSlice.actions;

export default redStateSlice.reducer;
