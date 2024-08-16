import axios, {AxiosRequestConfig} from 'axios';
import {API_DATA} from '../constants';
// import { API_DATA } from '@constants';

interface Data {
  method?: string;
  baseURL?: string;
  contentType?: string;
}

export function getResponseData(
  data: Data,
  accessToken: string = '',
): Promise<any> {
  console.log('from data', data);
  const api_config: AxiosRequestConfig = {
    method: data.method || 'post',
    baseURL: data.baseURL || API_DATA.BASE_URL,
    transformRequest: [
      function (params) {
        if (data['isString'] || !params || !Object.keys(params).length) {
          return JSON.stringify(params);
        }
        const formData = new FormData();
        for (const i in params) {
          if (Object.prototype.hasOwnProperty.call(params, i)) {
            formData.append(i, params[i]);
          }
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
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
    ...data,
  };

  console.log('APi config', api_config);

  return axios(api_config)
    .then(response => {
      console.log(response);
      return JSON.parse(response.data);
    })
    .catch(error => {
      console.log('api error >>> ', error);
      throw error; // Throwing error for proper error handling in Promise chain
    });
}
