import NetInfo from '@react-native-community/netinfo';

import { GROUP_TYPE } from '@constants';

export function saveGroupAdd(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.SAVE_GROUP_ADD,
      data,
    });
  };
}

export function saveGroupUpdate(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.SAVE_GROUP_UPDATE,
      data,
    });
  };
}

export function addGroupMember(data, groupId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.ADD_GROUP_MEMBER,
      data,
      groupId,
      state,
    });
  };
}

export function saveEventInChat(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.SAVE_EVENT_IN_CHAT,
      data,
    });
  };
}
export function savePollInChat(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.SAVE_POLL_IN_CHAT,
      data,
    });
  };
}
export function saveTaskCompleteInChat(data, taskId) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.TASK_COMPLETE_IN_CHAT,
      data,
      taskId,
    });
  };
}
export function saveMembersGroupList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.SAVE_MEMBER_GROUP_LIST,
      data,
    });
  };
}
export function saveGroupSubUpdate(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.SAVE_GROUP_SUB_UPDATE,
      data,
    });
  };
}

export function saveSubGroupAdd(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.SAVE_SUB_GROUP_ADD,
      data,
    });
  };
}

export function subGroupPrivate(groupId) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.SUB_GROUP_PRIVATE,
      groupId,
    });
  };
}

export function saveGroupDetail(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.SAVE_GROUP_DETAIL,
      data,
    });
  };
}
export function saveSubGroupDetail(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.SAVE_SUB_GROUP_DETAIL,
      data,
    });
  };
}

export function getGroupProfileUpdate(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.UPDATE_GROUP_PROFILE,
      data,
    });
  };
}

export function createGroupMessage(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CREATE_GROUP_MESSAGE,
      data,
    });
  };
}

export function replyGroupMessage(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.REPLY_GROUP_MESSAGE,
      data,
    });
  };
}

export function appendReplyGroupMessage(messageObj) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.REPLY_GROUP_MESSAGE,
      data: { ...messageObj, message: messageObj.message },
    });
  };
}
export function appendGroupMessage(messageObj) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CREATE_GROUP_MESSAGE,
      data: { ...messageObj, message: messageObj.message },
    });
  };
}

export function updateCreateGroupMessage(tempId, newId, chatId, resp) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.UPDATE_CREATE_GROUP_MESSAGE,
      data: { tempId, newId, chatId },
      resp,
    });
  };
}

export function updateReplyGroupMessage(tempId, newId, chatId, parentId) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.UPDATE_REPLY_GROUP_MESSAGE,
      data: { tempId, newId, chatId, parentId },
    });
  };
}

export function newChatList(data, count) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CHAT_LIST,
      data,
      count,
    });
  };
}

export function getBlockUserList(data, count) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.BLOCK_USER_LIST,
      data,
    });
  };
}

export function chatListUpdate(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CHAT_LIST_UPDATE,
      data,
    });
  };
}

export function readChat(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CHAT_READ,
      data,
    });
  };
}
export function messageList(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.MESSAGE_LIST,
      data,
    });
  };
}
export function getGroupArchive(groupId) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.GROUP_ARCHIVE,
      groupId,
    });
  };
}

export function groupArchiveList(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.GROUP_ARCHIVE_LIST,
      data,
    });
  };
}

export function getGroupUnarchive(groupId) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.GROUP_UNARCHIVE,
      groupId,
    });
  };
}

export function getChatArchiveList(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CHAT_ARCHIVE_LIST,
      data,
    });
  };
}

export function messageListLoadMore(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.MESSAGE_LIST_LOAD_MORE,
      data,
    });
  };
}

export function savePollVoteInChat(pollId, optionId) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.POLL_VOTE_IN_CHAT,
      pollId,
      optionId,
    });
  };
}

export function savePollVoteInChatFromServer(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.POLL_VOTE_FROM_SERVER,
      data,
    });
  };
}

export function savePollUpdateInChat(pollId, question) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.POLL_UPDATE_IN_CHAT,
      pollId,
      question,
    });
  };
}

export function savePollDeleteInChat(pollId) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.POLL_DELETE_IN_CHAT,
      pollId,
    });
  };
}

export function appendMessage(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.APPEND_MESSAGE,
      data,
    });
  };
}

export function messageLike(data) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.MESSAGE_LIKE,
      data,
    });
  };
}

export function realTimeMessageLike(data, value) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.REAL_TIME_MESSAGE_LIKE,
      data,
      value,
    });
  };
}

export function messageDelete(msgId) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.MESSAGE_DELETE,
      msgId,
    });
  };
}
export function groupMemberRemove(memberId, groupId, isSub = false) {
  return dispatch => {
    dispatch({
      type: isSub === true ? GROUP_TYPE.SUB_GROUP_MEMBER_REMOVE : GROUP_TYPE.GROUP_MEMBER_REMOVE,
      memberId,
      groupId,
    });
  };
}
export function subGroupMemberRemove(memberId, groupId) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.SUB_GROUP_MEMBER_REMOVE,
      memberId,
      groupId,
    });
  };
}
export function groupLeave(userId, chatId, state) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.GROUP_LEAVE,
      userId,
      chatId,
      state,
    });
  };
}

export function getChatClear(chatId, state) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CHAT_CLEAR,
      chatId,
      state,
    });
  };
}

export function getGroupDelete(groupId) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.GROUP_DELETE,
      groupId,
    });
  };
}

export function getChatDelete(chatId, state) {
  return dispatch => {
    dispatch({
      type: GROUP_TYPE.CHAT_DELETE,
      chatId,
      state,
    });
  };
}

export function stateClear(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.STATE_CLEAR,
      data,
    });
  };
}
export function getChatDetail(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.CHAT_DETAIL,
      data,
    });
  };
}

export function getChatMute(chatId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.CHAT_MUTE,
      chatId,
      state,
    });
  };
}

export function getChatPin(chatId) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.CHAT_PIN,
      chatId,
    });
  };
}

export function getChatUnpin(chatId) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.CHAT_UNPIN,
      chatId,
    });
  };
}

export function getChatArchive(chatId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.CHAT_ARCHIVE,
      chatId,
      state,
    });
  };
}

export function getChatUnarchive(chatId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.CHAT_UNARCHIVE,
      chatId,
      state,
    });
  };
}

export function getChatBlock(chatId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.CHAT_BLOCK,
      chatId,
      state,
    });
  };
}

export function getUserBlock(connectionId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.USER_BLOCK,
      connectionId,
      state,
    });
  };
}

export function CurrentTabName(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.Current_Tab_Name,
      data,
    });
  };
}
export function subGroupIDData(data) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.SUB_GROUP_ID_DATA,
      data,
    });
  };
}

export function addGroupModerator(id) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_TYPE.ADD_MODERATOR,
      id,
    });
  };
}
export function addToCalender(eventId) {
  return (dispatch) => {
    dispatch({
      type: GROUP_TYPE.ADD_TO_CALENDER,
  eventId,
})
  }
}
