import NetInfo from '@react-native-community/netinfo';

import { POLL_TYPE } from '@constants';

export function savePollList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.SAVE_POLL_LIST,
      data,
    });
  };
}

export function pollListLoadMore(data) {
  return dispatch => {
    dispatch({
      type: POLL_TYPE.POLL_LIST_LOAD_MORE,
      data,
    });
  };
}

export function savePollAdd(data) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.SAVE_POLL_ADD,
      data,
    });
  };
}

export function savePollVote(pollId, optionId, state) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.POLL_VOTE,
      pollId,
      optionId,
      state,
    });
  };
}

export function savePollVoteServer(data, state) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.POLL_VOTE_SERVER,
      data,
      state,
    });
  };
}

export function savePollDetail(data) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.SAVE_POLL_DETAIL,
      data,
    });
  };
}

export function saveVoterList(data) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.SAVE_VOTER_LIST,
      data,
    });
  };
}

export function savePollDelete(pollId) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.SAVE_POLL_DELETE,
      pollId,
    });
  };
}

export function savePollUpdate(pollId, question) {
  return (dispatch, getState) => {
    dispatch({
      type: POLL_TYPE.SAVE_POLL_UPDATE,
      pollId,
      question,
    });
  };
}
