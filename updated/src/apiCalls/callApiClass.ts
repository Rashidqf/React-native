import axios, {AxiosResponse} from 'axios';
import {getResponseData} from './apiCallGetData';
import {StorageOperation} from '../storage/asyncStorage';
import {ASYNC_KEYS} from '../components';
interface ApiInput {
  url: string;
  method?: string;
  baseURL?: string;
  contentType?: string;
}

interface Navigation {
  navigate: (screen: string) => void;
  reset: (params: {index: number; routes: {name: string}[]}) => void;
}

export function callApi(
  api_inputs: ApiInput[],
  accessToken: string,
  navigation?: Navigation,
): Promise<{[key: string]: any}> {
  return new Promise((resolve, reject) => {
    const api_container: Promise<any>[] = [];
    console.log('api_inputs', api_inputs);
    api_inputs.forEach((item, index) => {
      api_container.push(getResponseData(item, accessToken));

      if (index === api_inputs.length - 1) {
        axios
          .all(api_container)
          .then(
            axios.spread((...responses: AxiosResponse<any>[]) => {
              const result: {[key: string]: any} = {};
              responses.forEach((response, idx) => {
                result[api_inputs[idx].url] = response.data;
              });
              resolve(result);

              checkTokenExpire(responses, navigation);
            }),
          )
          .catch(e => {
            reject(e);
            console.log('api call error >>> ', e);
          });
      }
    });
  });
}

function checkTokenExpire(
  responses: AxiosResponse<any>[],
  navigation: Navigation,
) {
  const isExpired = responses.filter(item => item.status === 401);
  if (isExpired.length) {
    console.log('token expired >>>>', navigation);
    logout(navigation);
  }
}

function logout(navigation: Navigation) {
  navigation?.navigate('LOGIN_SCREEN');

  StorageOperation.removeData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA]).then(
    () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'INTRO_SCREEN'}],
      });
    },
  );
}
