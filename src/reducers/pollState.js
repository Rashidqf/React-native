import { POLL_TYPE } from '@constants';
import moment from 'moment';

import { savePollAdd } from '../actions/pollAction';

let initialState = {
  pollList: null,
  pollDetail: null,
  votersList: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case POLL_TYPE.SAVE_POLL_LIST:
      return {
        ...state,
        pollList: {
          ...action.data,
          data: [...action.data.data],
        },
      };
    case POLL_TYPE.POLL_LIST_LOAD_MORE:
      return {
        ...state,
        pollList: {
          ...state.pollList,
          ...action.data,
          data: [...state.pollList.data, ...action.data.data],
        },
      };
    case POLL_TYPE.SAVE_POLL_ADD:
      return {
        ...state,
        pollList: {
          ...state.pollList,
          // data: [...state.pollList?.data, action.data],
        },
      };
    case POLL_TYPE.POLL_VOTE:
      const pollVote = [...state?.pollList?.data];
      const pollVoteIndex = state?.pollList?.data.findIndex(poll => poll.id === action.pollId);

      if (pollVoteIndex !== -1) {
        const optionClone = [...pollVote[pollVoteIndex].options];
        const optionIndex = optionClone.findIndex(option => option?.id === action.optionId);
        const totalPercentage = (optionClone[optionIndex].vote_count + 1 * 100) / (pollVote[pollVoteIndex].total_votes + 1);

        if (optionIndex !== -1) {
          optionClone[optionIndex] = {
            ...optionClone[optionIndex],
            vote_count: optionClone[optionIndex].vote_count + 1,
            vote_percentage: totalPercentage,
            isMyAnswer: 1,
          };
          pollVote[pollVoteIndex] = {
            ...pollVote[pollVoteIndex],
            is_answered: 1,
            total_votes: pollVote[pollVoteIndex].total_votes + 1,
            options: [...optionClone],
          };
        }
      }

      if (action.state === 'pollDetails') {
        const pollDetailClone = [...state?.pollDetail?.options];
        const pollDetailsIndex = pollDetailClone.findIndex(option => option?.id === action.optionId);
        const totalPercentagePoll = (pollDetailClone[pollDetailsIndex].vote_count + 1 * 100) / (state?.pollDetail?.total_votes + 1);
        if (pollDetailsIndex !== -1) {
          pollDetailClone[pollDetailsIndex] = {
            ...pollDetailClone[pollDetailsIndex],
            vote_count: pollDetailClone[pollDetailsIndex].vote_count + 1,
            vote_percentage: totalPercentagePoll,
            isMyAnswer: 1,
          };
        }
        return {
          ...state,
          pollList: {
            ...state.pollList,
            data: [...pollVote],
          },
          pollDetail: {
            ...state.pollDetail,
            options: [...pollDetailClone],
          },
        };
      }

      return {
        ...state,
        pollList: {
          ...state.pollList,
          data: [...pollVote],
        },
      };

    case POLL_TYPE.POLL_VOTE_SERVER:
      const pollVoteClone = state?.pollList?.data ? [...state?.pollList?.data] : null;
      const pollIndex = state?.pollList?.data?.findIndex(poll => poll.id === action.data.id);

      if (pollIndex !== -1 && pollIndex !== undefined) {
        pollVoteClone[pollIndex] = action.data;
      }
      if (action.state === 'pollDetails') {
        return {
          ...state,

          pollList: state.pollList?.data
            ? {
                ...state.pollList,
                data: [...pollVoteClone],
              }
            : null,
          pollDetail: action.data,
        };
      } else {
        return {
          ...state,
          // pollDetail: action.data,

          pollList: {
            ...state.pollList,
            data: [...pollVoteClone],
          },
        };
      }

    case POLL_TYPE.SAVE_POLL_DETAIL:
      return {
        ...state,
        pollDetail: action.data,
      };

    case POLL_TYPE.SAVE_VOTER_LIST:
      return {
        ...state,
        votersList: action.data,
      };
    case POLL_TYPE.SAVE_POLL_DELETE:
      return {
        ...state,
        pollList: {
          ...state.pollList,
          data: state?.pollList?.data.filter(val => val.id !== action.pollId),
        },
      };
    case POLL_TYPE.SAVE_POLL_UPDATE:
      const pollUpdateClone = state?.pollList?.data ? [...state?.pollList?.data] : null;
      const pollUpdateIndex = pollUpdateClone?.findIndex(poll => poll?.id === action.pollId);
      if (pollUpdateIndex !== -1 && pollUpdateIndex !== undefined) {
        pollUpdateClone[pollUpdateIndex] = {
          ...pollUpdateClone[pollUpdateIndex],
          question: action.question,
        };
      }
      return {
        ...state,
        pollDetail: {
          ...state.pollDetail,
          question: action.question,
        },
        pollList: state.pollList?.data
          ? {
              ...state.pollList,
              data: [...pollUpdateClone],
            }
          : null,
      };
    default:
      return state;
  }
}
