import { getResponseData } from '@apiCalls';

import axios from 'axios';

//import StorageOperation
import { StorageOperation } from '@storage';

import { ASYNC_KEYS } from '@constants';

export function callApi(api_inputs, accessToken, navigation) {
  return new Promise((resolve, reject) => {
    var api_container = [];
    api_inputs.map((item, index) => {
      api_container.push(getResponseData(item, accessToken));

      if (index == api_inputs.length - 1) {
        axios
          .all(api_container)
          .then(
            axios.spread((...responses) => {
              const result = {};
              responses.map((item, index) => {
                result[api_inputs[index].url] = item;
              });
              resolve(result);

              checkTokenExpire(responses, navigation);
            }),
          )
          .catch(e => {
            reject(e);
            console.log('api call errorr >>> ', e);
          });
      }
    });
  });
}

function checkTokenExpire(responses, navigation) {
  const isExpired = responses.filter(item => item.status == 401);
  if (isExpired.length) {
    console.log('token expired >>>>', navigation);
    logout(navigation);
  }
}

function logout(navigation) {
  navigation?.navigate('LOGIN_SCREEN');

  StorageOperation.removeData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA]).then(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'INTRO_SCREEN' }],
    });
  });
}
