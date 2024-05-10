import { tupleTypeAnnotation } from '@babel/types';
import { GROUP_TYPE } from '@constants';
import moment from 'moment';

let initialState = {
  groupList: null,
  groupDetail: null,
  message: { data: null },
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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GROUP_TYPE.STATE_CLEAR:
      return {
        ...state,
        message: {
          data: null,
        },
      };
    case GROUP_TYPE.SAVE_GROUP_ADD:
      return {
        ...state,
        groupList: action.data,
        chatList: [action.data, ...state.chatList],
      };
    case GROUP_TYPE.BLOCK_USER_LIST:
      return {
        ...state,
        blockUserList: action.data,
      };

    case GROUP_TYPE.SAVE_GROUP_UPDATE:
      return {
        ...state,
        // groupList: action.data,
        groupDetail: {
          ...state.groupDetail,
          members: [...state.groupDetail?.members, ...action?.data],
        },
      };

    case GROUP_TYPE.ADD_GROUP_MEMBER:
      return action?.state === 'sharedSideNote'
        ? {
            ...state,
            // groupList: action.data,
            memberGroupList: state.memberGroupList.filter(item => item?.id !== action?.groupId),
          }
        : {
            ...state,
            // groupList: action.data,

            groupDetail: {
              ...state.groupDetail,
              members: [...state.groupDetail?.members, ...action?.data],
            },
          };

    case GROUP_TYPE.SAVE_GROUP_SUB_UPDATE:
      return {
        ...state,
        // groupList: action.data,
        groupDetail: {
          ...state.groupDetail,
          members: [...state.groupDetail?.members, ...action?.data],
        },
      };
    case GROUP_TYPE.SUB_GROUP_PRIVATE:
      const subgroupClone = [...state?.groupDetail?.subgroups];
      const subgroupIndex = state?.groupDetail?.subgroups?.findIndex(item => item?.id === action?.groupId);
      const subGroup = [...state?.groupDetailA?.subgroups];
      const subGroupIndex = state?.groupDetailA?.subgroups?.findIndex(item => item?.id === action?.groupId);

      if (subGroupIndex !== -1) {
        subGroup[subGroupIndex] = {
          ...subGroup[subGroupIndex],
          is_private: 1,
        };
      }
      if (subgroupIndex !== -1) {
        subgroupClone[subgroupIndex] = {
          ...subgroupClone[subgroupIndex],
          is_private: 1,
        };
      }
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          subgroups: [...subgroupClone],
        },
        groupDetailA: {
          ...state?.groupDetailA,
          subgroups: [...subGroup],
        },
      };
    case GROUP_TYPE.SAVE_MEMBER_GROUP_LIST:
      return {
        memberGroupList: action.data,
        chatList: state.chatList,
        blockUserList: state.blockUserList,
      };
    case GROUP_TYPE.SAVE_SUB_GROUP_ADD:
      return {
        ...state,
        groupList: action.data,
      };

    case GROUP_TYPE.SAVE_GROUP_DETAIL:
      return {
        ...state,
        groupDetail: action.data,
      };

    case GROUP_TYPE.SAVE_SUB_GROUP_DETAIL:
      return {
        ...state,
        groupDetailA: action.data,
      };

    case GROUP_TYPE.UPDATE_GROUP_PROFILE:
      // const titleClone = [...state?.chatList];
      // const titleIndex = state?.chatList.findIndex(item => item.chat_id === action.data?.chat_id);

      // if (titleIndex !== -1) {
      //   titleClone[titleIndex] = {
      //     ...titleClone[titleIndex],
      //     title: action?.data?.title,
      //   };
      // }
      const groupnameUpdate = [...state?.groupDetailA?.subgroups];
      const groupnameIndex = state?.groupDetailA?.subgroups?.findIndex(item => item?.id === action?.data?.id);

      if (groupnameIndex !== -1) {
        groupnameUpdate[groupnameIndex] = {
          ...groupnameUpdate[groupnameIndex],
          title: action?.data?.title,
        };
      }
      // console.log(' state,details ------', action.data);
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          image: action?.data?.image,
          title: action?.data?.title,
        },
        groupDetailA: {
          ...state?.groupDetailA,
          subgroups: [...groupnameUpdate],
        },
        // chatList: [...titleClone],
      };

    case GROUP_TYPE.CREATE_GROUP_MESSAGE:
      return {
        ...state,
        message: {
          ...state.message,
          data: state?.message?.data ? [action.data, ...state?.message?.data] : [action?.data],
        },
      };
    case GROUP_TYPE.SAVE_EVENT_IN_CHAT:
      return {
        ...state,
        message: {
          ...state.message,
          data: state?.message?.data ? [action.data, ...state?.message?.data] : [action?.data],
        },
      };
    case GROUP_TYPE.SAVE_POLL_IN_CHAT:
      return {
        ...state,
        message: {
          ...state.message,
          data: [action.data, ...state?.message?.data],
        },
      };
    case GROUP_TYPE.REPLY_GROUP_MESSAGE:
      const messageReplyClone = state?.message?.data ? [...state.message.data] : [];

      const messageReplyIndex = state.message?.data.findIndex((message, index) => {
        return message.message_id === action.data.parent_id;
      });
      if (messageReplyIndex !== -1) {
        messageReplyClone[messageReplyIndex] = {
          ...messageReplyClone[messageReplyIndex],
          replies: messageReplyClone[messageReplyIndex].replies
            ? [...messageReplyClone[messageReplyIndex].replies, action?.data]
            : [action?.data],
        };
      }

      return {
        ...state,
        message: {
          ...state.message,
          data: [...messageReplyClone],
        },
      };

    case GROUP_TYPE.UPDATE_CREATE_GROUP_MESSAGE:
      const msgArr = [...state.message?.data];
      const newArr = msgArr.map(val => {
        if (val.tempId != action.data.tempId) {
          return val;
        } else {
          return {
            ...val,
            message_id: action.data.newId,
            chat_id: action.data.chatId,
            poll_id: action?.resp?.poll?.id,
            event_id: action?.resp?.event?.id,
            task_id: action?.resp?.task?.id,
            poll: action?.resp?.poll?.length !== 0 ? { ...action?.resp?.poll } : [],
            event: action?.resp?.event?.length !== 0 ? { ...action?.resp?.event } : [],
            task: action?.resp?.task?.length !== 0 ? { ...action?.resp?.task } : [],
            like_count: 0,
          };
        }
      });

      return {
        ...state,
        message: {
          ...state.message,
          data: newArr,
        },
      };

    case GROUP_TYPE.UPDATE_REPLY_GROUP_MESSAGE:
      const replyMsgArr = [...state.message?.data];
      const replyMsgIndex = state.message?.data?.findIndex(msg => msg.message_id === action.data.parentId);
      if (replyMsgIndex !== -1) {
        replyMsgArr[replyMsgIndex] = {
          ...replyMsgArr[replyMsgIndex],
          replies: [
            ...replyMsgArr[replyMsgIndex].replies.map(val => {
              if (val.parent_id === action.data.parentId) {
                return { ...val, message_id: action.data.newId, chat_id: action.data.chatId, parent_id: action.data.parentId };
              } else {
                return val;
              }
            }),
          ],
        };
      }

      return {
        ...state,
        message: {
          ...state.message,
          data: [...replyMsgArr],
        },
      };

    case GROUP_TYPE.CHAT_LIST:
      return {
        ...state,
        chatList: { ...action.data, ...action.count },
      };
    case GROUP_TYPE.GROUP_ARCHIVE_LIST:
      return {
        ...state,
        gpArchiveList: action.data,
      };
    case GROUP_TYPE.CHAT_ARCHIVE_LIST:
      return {
        ...state,
        chatArchiveList: action.data,
      };
    case GROUP_TYPE.CHAT_READ:
      return {
        ...state,
        // chatList: action.data,
      };
    case GROUP_TYPE.MESSAGE_LIST:
      return {
        ...state,
        message: {
          ...action.data,
          data: [...action.data.data],
        },
      };
    case GROUP_TYPE.MESSAGE_LIST_LOAD_MORE:
      return {
        ...state,
        message: {
          ...state.message,
          ...action.data,
          data: [...state.message.data, ...action.data.data],
        },
      };

    case GROUP_TYPE.TASK_COMPLETE_IN_CHAT:
      const taskClone = [...state.message.data];
      const taskIndex = state.message?.data?.findIndex(message => message.task_id === action.taskId);
      if (taskIndex !== -1) {
        taskClone[taskIndex].task = {
          ...taskClone[taskIndex].task,
          is_complete: taskClone[taskIndex].task.is_complete === 1 ? 0 : 1,
        };
      }

      return {
        ...state,
        message: {
          ...state.message,
          data: eventClone,
        },
      };
    case GROUP_TYPE.POLL_VOTE_IN_CHAT:
      const pollClone = [...state.message.data];
      const pollIndex = state.message?.data?.findIndex(message => message.poll_id === action.pollId);

      if (pollIndex !== -1) {
        const optionClone = [...pollClone[pollIndex].poll?.options];
        const optionIndex = optionClone.findIndex(option => option?.id === action.optionId);
        const totalPercentage = (optionClone[optionIndex].vote_count + 1 * 100) / (pollClone[pollIndex].poll.total_votes + 1);

        if (optionIndex !== -1) {
          optionClone[optionIndex] = {
            ...optionClone[optionIndex],
            vote_count: optionClone[optionIndex].vote_count + 1,
            vote_percentage: totalPercentage,
            isMyAnswer: 1,
          };

          pollClone[pollIndex].poll = {
            ...pollClone[pollIndex].poll,
            is_answered: 1,
            total_votes: pollClone[pollIndex].poll.total_votes + 1,
            options: [...optionClone],
          };
        }
      }
      return {
        ...state,
        message: {
          ...state.message,
          data: pollClone,
        },
      };

    case GROUP_TYPE.POLL_VOTE_FROM_SERVER:
      const pollVoteClone = [...state.message.data];
      const pollVoteIndex = state.message?.data?.findIndex(message => message.poll_id === action.data.id);

      if (pollVoteIndex !== -1) {
        pollVoteClone[pollVoteIndex] = {
          ...pollVoteClone[pollVoteIndex],
          poll: action.data,
        };
      }

      return {
        ...state,
        message: {
          ...state.message,
          data: pollVoteClone,
        },
      };

    case GROUP_TYPE.POLL_DELETE_IN_CHAT:
      return {
        ...state,
        message: {
          ...state.message,
          data: state.message.data.filter(val => val.poll_id !== action.pollId),
        },
      };

    case GROUP_TYPE.POLL_UPDATE_IN_CHAT:
      const pollUpdateClone = [...state.message.data];
      const pollUpdateIndex = state.message?.data?.findIndex(message => message.poll_id === action.pollId);

      if (pollUpdateIndex !== -1) {
        pollUpdateClone[pollUpdateIndex].poll = {
          ...pollUpdateClone[pollUpdateIndex].poll,
          question: action.question,
        };
      }

      return {
        ...state,
        message: {
          ...state.message,
          data: pollUpdateClone,
        },
      };

    case GROUP_TYPE.MESSAGE_LIKE:
      const messageClone = [...state.message.data];
      const messageIndex = state.message?.data.findIndex(message => message.message_id === action.data);

      const like = messageClone[messageIndex].is_liked;
      const likeCount = messageClone[messageIndex].like_count;
      if (messageIndex !== -1) {
        messageClone[messageIndex] = {
          ...messageClone[messageIndex],
          is_liked: like === 1 ? 0 : 1,
          like_count: like === 1 ? likeCount - 1 : likeCount ? likeCount + 1 : 1,
        };
      }
      return {
        ...state,
        message: {
          ...state.message,
          data: messageClone,
        },
      };
    case GROUP_TYPE.REAL_TIME_MESSAGE_LIKE:
      const likeClone = [...state.message.data];
      const likeIndex = state.message?.data.findIndex(message => message.message_id === action.data);
      const liked = likeClone[likeIndex].is_liked;
      const likedCount = likeClone[likeIndex].like_count;
      const value = action.value;
      if (likeIndex !== -1) {
        likeClone[likeIndex] = {
          ...likeClone[likeIndex],
          // is_liked: liked === 1 ? 0 : 1,
          like_count: value === false ? likedCount - 1 : likedCount ? likedCount + 1 : 1,
        };
      }
      return {
        ...state,
        message: {
          ...state.message,
          data: likeClone,
        },
      };

    case GROUP_TYPE.MESSAGE_DELETE:
      return {
        ...state,
        message: {
          ...state.message,
          data: state.message.data.filter(val => val.message_id !== action.msgId),
        },
      };
    case GROUP_TYPE.GROUP_MEMBER_REMOVE:
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          members: state.groupDetail.members.filter(item => item.member_id !== action.memberId),
        },
      };
    case GROUP_TYPE.SUB_GROUP_MEMBER_REMOVE:
      // const memberClone = [...state?.groupDetail?.subgroups];
      // const memberIndex = state?.groupDetail?.subgroups?.findIndex(val => val?.id === Number(action?.groupId));
      // if (memberIndex !== -1) {
      //   memberClone[memberIndex] = {
      //     ...memberClone[memberIndex],
      //     members: memberClone[memberIndex]?.members?.filter(member => member?.member_id !== action.memberId),
      //   };
      // }
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          members: state.groupDetail.members.filter(item => item.member_id !== action.memberId),
          // subgroups: memberClone,
        },
      };
    case GROUP_TYPE.GROUP_LEAVE:
      let chatCloneLeave = action.state === 'other' ? [...state?.chatList?.other] : [...state?.chatList?.pinned];

      const filterd = chatCloneLeave.filter(item => item?.chat_id !== action?.chatId);
      return {
        ...state,
        // groupDetail: {
        //   ...state.groupDetail,
        //   members: state.groupDetail.members.filter(item => item.user_id !== action.userId),
        // },
        chatList:
          action.state === 'other'
            ? {
                ...state?.chatList,
                other: [...filterd],
              }
            : {
                ...state?.chatList,
                pinned: [...filterd],
              },
      };

    case GROUP_TYPE.GROUP_ARCHIVE:
      const archiveClone = [...state?.groupDetail?.subgroups];
      const archiveIndex = state?.groupDetail?.subgroups?.findIndex(item => item?.id === action?.groupId);

      const archiveCLoneNew = [...state?.groupDetailA?.subgroups];
      const archiveIndexNew = state?.groupDetailA?.subgroups?.findIndex(item => item?.id === action?.groupId);

      if (archiveIndex !== -1) {
        archiveClone[archiveIndex] = {
          ...archiveClone[archiveIndex],
          isArchive: archiveClone[archiveIndex]?.isArchive === 0 ? 1 : 0,
        };
      }
      if (archiveIndexNew !== -1) {
        archiveCLoneNew[archiveIndexNew] = {
          ...archiveCLoneNew[archiveIndexNew],
          isArchive: archiveCLoneNew[archiveIndexNew]?.isArchive === 0 ? 1 : 0,
        };
      }
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          total_archive_subgroups: state?.groupDetail?.total_archive_subgroups + 1,
          subgroups: [...archiveClone],
        },
        groupDetailA: {
          ...state.groupDetailA,
          total_archive_subgroups: state?.groupDetailA?.total_archive_subgroups + 1,
          subgroups: [...archiveCLoneNew],
        },
      };

    case GROUP_TYPE.GROUP_UNARCHIVE:
      const unarchiveClone = [...state?.groupDetail?.subgroups];
      const unarchiveIndex = state?.groupDetail?.subgroups?.findIndex(item => item?.id === action?.groupId);

      const unarchiveCloneNew = [...state?.groupDetailA?.subgroups];
      const unarchiveIndexNew = state?.groupDetailA?.subgroups?.findIndex(item => item?.id === action?.groupId);

      if (unarchiveIndex !== -1) {
        unarchiveClone[unarchiveIndex] = {
          ...unarchiveClone[unarchiveIndex],
          isArchive: unarchiveClone[unarchiveIndex]?.isArchive === 0 ? 1 : 0,
        };
      }
      if (unarchiveIndexNew !== -1) {
        unarchiveCloneNew[unarchiveIndexNew] = {
          ...unarchiveCloneNew[unarchiveIndexNew],
          isArchive: unarchiveCloneNew[unarchiveIndexNew]?.isArchive === 0 ? 1 : 0,
        };
      }

      return {
        ...state,
        gpArchiveList: [...state.gpArchiveList.filter(item => item.id !== action?.groupId)],
        groupDetail: {
          ...state?.groupDetail,
          total_archive_subgroups: state?.groupDetail?.total_archive_subgroups - 1,
          subgroups: [...unarchiveClone],
        },
        groupDetailA: {
          ...state?.groupDetailA,
          total_archive_subgroups: state?.groupDetailA?.total_archive_subgroups - 1,
          subgroups: [...unarchiveCloneNew],
        },
      };

    case GROUP_TYPE.CHAT_DETAIL:
      return {
        ...state,
        chatDetail: action.data,
      };
    case GROUP_TYPE.CHAT_MUTE:
      const muteclone = action.state === 'other' ? [...state?.chatList?.other] : [...state?.chatList?.pinned];
      const muteIndex =
        action.state === 'other'
          ? state?.chatList?.other.findIndex(item => item.chat_id === action.chatId)
          : state?.chatList?.pinned?.findIndex(item => item.chat_id === action.chatId);
      const mute = muteclone[muteIndex].is_mute;

      if (muteIndex !== -1) {
        muteclone[muteIndex] = {
          ...muteclone[muteIndex],
          is_mute: mute === 0 ? 1 : 0,
        };
      }
      return {
        ...state,
        chatList:
          action.state === 'other'
            ? {
                ...state?.chatList,
                other: [...muteclone],
              }
            : {
                ...state?.chatList,
                pinned: [...muteclone],
              },
      };
    case GROUP_TYPE.CHAT_BLOCK:
      return action.state === 'block'
        ? {
            ...state,

            blockUserList: state.blockUserList.filter(item => item?.chat_id !== action.chatId),
          }
        : { ...state };

    case GROUP_TYPE.USER_BLOCK:
      return {
        ...state,
        blockUserList: state.blockUserList.filter(item => item?.connection_id !== action.connectionId),
      };

    case GROUP_TYPE.CHAT_PIN:
      // const chatPinclone = [...state?.chatList?.other];
      // const groupData = state?.chatList?.other.find(item => item.chat_id === action.chatId);
      // const pinnedData = chatPinclone.filter(item => item?.chat_id !== action?.chatId);
      return {
        ...state,
        // chatList: {
        //   ...state?.chatList,
        //   other: [...pinnedData],
        //   pinned: [groupData, ...state?.chatList?.pinned],
        // },
      };

    case GROUP_TYPE.CHAT_UNPIN:
      // const chatUnpinclone = [...state?.chatList?.pinned];
      // const groupPinData = state?.chatList?.pinned.find(item => item.chat_id === action.chatId);
      // const UnpinData = chatUnpinclone.filter(item => item?.chat_id !== action?.chatId);
      return {
        ...state,
        // chatList: {
        //   ...state?.chatList,
        //   other: [groupPinData, ...state?.chatList?.other],
        //   pinned: [...UnpinData],
        // },
      };

    case GROUP_TYPE.CHAT_ARCHIVE:
      let chatCloneArchive = action.state === 'other' ? [...state?.chatList?.other] : [...state?.chatList?.pinned];
      return {
        ...state,

        chatList:
          action.state === 'other'
            ? {
                ...state?.chatList,
                archive_count: state?.chatList?.archive_count + 1,
                // other: [...archived],
              }
            : {
                ...state?.chatList,
                archive_count: state?.chatList?.archive_count + 1,
                // pinned: [...archived],
              },
        chatDetail: {
          ...state?.chatDetail,
          is_archive: state?.chatDetail?.is_archive === 1 ? 0 : 1,
        },
      };

    case GROUP_TYPE.CHAT_UNARCHIVE:
      return {
        ...state,
        chatArchiveList: [...state.chatArchiveList?.filter(item => item.chat_id !== action?.chatId)],
        chatDetail: {
          ...state?.chatDetail,
          is_archive: state?.chatDetail?.is_archive === 1 ? 0 : 1,
        },
      };

    case GROUP_TYPE.CHAT_CLEAR:
      return {
        ...state,
        message: {
          ...state.message,
          data: state.message.data.filter(val => val.chat_id !== action.chatId),
        },
      };
    case GROUP_TYPE.CHAT_DELETE:
      return {
        ...state,

        chatList:
          action.state === 'other'
            ? {
                ...state.chatList,
                archive_count: action.state === 'archive' ? state?.chatList?.archive_count - 1 : state?.chatList?.archive_count,
                other: state.chatList?.other?.filter(msg => msg.chat_id !== action.chatId),
              }
            : {
                ...state.chatList,
                archive_count: action.state === 'archive' ? state?.chatList?.archive_count - 1 : state?.chatList?.archive_count,
                pinned: state.chatList?.pinned?.filter(msg => msg.chat_id !== action.chatId),
              },

        chatArchiveList: action.state === 'archive' && [...state.chatArchiveList?.filter(item => item.chat_id !== action?.chatId)],
      };

    case GROUP_TYPE.GROUP_DELETE:
      return {
        ...state,
        gpArchiveList: [...state.gpArchiveList.filter(item => item.id !== action?.groupId)],
        groupDetail: {
          ...state.groupDetail,
          total_archive_subgroups: state?.groupDetail?.total_archive_subgroups - 1,
          subgroups: state.groupDetail.subgroups.filter(item => item.id !== action?.groupId),
        },
      };

    case GROUP_TYPE.Current_Tab_Name:
      return {
        ...state,
        cTabName: action?.data,
      };
    case GROUP_TYPE.SUB_GROUP_ID_DATA:
      return {
        ...state,
        subGroupIdC: action?.data,
      };
    case GROUP_TYPE.ADD_MODERATOR:
      const memberClone = [...state?.groupDetail?.members];
      const memberIndex = state?.groupDetail?.members?.findIndex(val => val?.user_id === Number(action?.id));
      if (memberIndex !== -1) {
        memberClone[memberIndex] = {
          ...memberClone[memberIndex],
          is_moderator: memberClone[memberIndex].is_moderator === 1 ? 0 : 1,
        };
      }

      const memberChatClone = [...state?.chatDetail?.members];
      const memberChatIndex = state?.chatDetail?.members?.findIndex(val => val?.user_id === Number(action?.id));
      if (memberIndex !== -1) {
        memberChatClone[memberChatIndex] = {
          ...memberChatClone[memberChatIndex],
          is_moderator: memberChatClone[memberChatIndex].is_moderator === 1 ? 0 : 1,
        };
      }
      return {
        ...state,
        groupDetail: {
          ...state.groupDetail,
          members: memberClone,
        },
        chatDetail: {
          ...state?.chatDetail,
          members: memberChatClone,
        },
      };
    case GROUP_TYPE.ADD_TO_CALENDER:
      const eventClone = [...state.message.data];
      const eventIndex = state.message?.data?.findIndex(message => 
        message?.event_id === action?.eventId
        );
      if (eventIndex !== -1) {
        eventClone[eventIndex].event = {
          ...eventClone[eventIndex].event,
          is_calendar: eventClone[eventIndex].event.is_calendar === 1 ? 0 : 1,
        };
      }
      return {
        ...state,
        message: {
          ...state.message,
          data: eventClone,
        },
      }
    default:
      return state;
  }
}
