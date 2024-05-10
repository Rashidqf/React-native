import axios from 'axios';

import { API_DATA } from '@constants';

export function getResponseData(data, accessToken = {}) {
  // console.log('api Callin Params >>>> ', data);

  const api_config = {
    method: data.method || 'post',
    baseURL: data.baseURL || API_DATA.BASE_URL,
    transformRequest: [
      function (params) {
        if (data['isString'] || !params || !Object.keys(params).length) {
          return JSON.stringify(params);
        }
        var formData = new FormData();
        for (var i in params) {
          formData.append(i, params[i]);
        }

        return formData;
      },
    ],
    transformResponse: [
      function (data) {
        return data;
      },
    ],
    headers: {
      Accept: 'application/json',
      'Content-Type': data.contentType || 'multipart/form-data',
      app_version: '1.5.1',
      app_build: '1.9.5',
      Authorization: accessToken ? 'Bearer ' + accessToken : '',
    },
    ...data,
  };

  // console.log('api config >>>', api_config);

  return axios(api_config)
    .then(response => {
      // console.log('apiResponce >>>>> ', JSON.parse(response.data));
      return JSON.parse(response.data);
    })
    .catch(error => {
      console.log('api error >>>ooo>> ', error);
      return error;
    });
}
