import {getChatDetail} from '../reducer/groupStateReducer';
import {AppDispatch} from '../store';

export function getChatDetailAction(data: any) {
  return (dispatch: AppDispatch) => {
    dispatch(getChatDetail({data}));
  };
}
