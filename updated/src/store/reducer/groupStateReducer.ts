import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Message {
  message_id: string;
  chat_id: string;
  [key: string]: any;
}

export interface GroupDetail {
  members?: any[];
  subgroups?: any[];
  [key: string]: any;
}

export interface ChatDetail {
  members?: any[];
  [key: string]: any;
}

export interface State {
  groupList: any | null;
  groupDetail: GroupDetail | null;
  message: {data: Message[] | null};
  chatList: any | null;
  chatDetail: ChatDetail | null;
  groupProfile: any | null;
  gpArchiveList: any | null;
  chatArchiveList: any | null;
  memberGroupList: any | null;
  blockUserList: any | null;
  groupDetailA: GroupDetail | null;
  cTabName: string | null;
  subGroupIdC: string | null;
}

const initialState: State = {
  groupList: null,
  groupDetail: null,
  message: {data: null},
  chatList: null,
  chatDetail: null,
  groupProfile: null,
  gpArchiveList: null,
  chatArchiveList: null,
  memberGroupList: null,
  blockUserList: null,
  groupDetailA: null,
  cTabName: null,
  subGroupIdC: null,
};

const groupSlice = createSlice({
  name: 'groupState',
  initialState,
reducers: {
    getChatDetail(state, action: PayloadAction<ChatDetail>) {
      state.chatDetail = action.payload;
    },
  },
});

export const {getChatDetail} = groupSlice.actions;
export default groupSlice.reducer;
