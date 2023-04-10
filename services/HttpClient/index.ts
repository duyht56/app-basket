import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  ApiRequestParams,
  BaseApiResponse,
  BaseServerDataResponse,
  GetRequestParams,
  PostRequestParams,
} from './model';

class HttpClient {
  instance: AxiosInstance;

  isCheckAuth = true;

  isKeepRequest = false;

  accessToken = '';

  requestInstance: {
    [key: string]: AbortController;
  } = {};

  constructor(config: AxiosRequestConfig) {
    this.instance = createAxios(config);
  }

  setAuthorization = (token: string) => {
    this.accessToken = `Bearer ${token}`;
  };

  initTokenCancel = (
    requestId: string,
    abortInstance: AbortController
  ): void => {
    this.requestInstance[requestId] = abortInstance;
  };

  //Cancel request

  cancelRequest = (requestId: string, isTimeoutCancel?: boolean) => {
    console.log(`cancelRequest from ${requestId}`);
    console.log('requestId', this.requestInstance[requestId]);
    if (this.requestInstance[requestId]) {
      this.requestInstance[requestId]?.abort();

      delete this.requestInstance[requestId];

      if (isTimeoutCancel) {
        showErrorMessage('Request Timeout!');
      }
    }
  };

  fetchApi = <T>({ method, config }: ApiRequestParams): BaseApiResponse<T> => {
    const {
      url = '',

      isKeepRequest = this.isKeepRequest,

      isCheckAuth = this.isCheckAuth,

      headers: customHeaders = {},

      isHandleError = true,

      requestId = `${url}-${new Date().getTime()}`,

      ...otherConfig
    } = config;

    const controller = new AbortController();

    this.initTokenCancel(requestId, controller);

    const cancelTimeout = isKeepRequest
      ? null
      : setTimeout(() => {
          this.cancelRequest(requestId, true);
        }, Number(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT));

    return new Promise((resolve, reject) => {
      this.instance

        .request<BaseServerDataResponse<T>>({
          method,

          url,

          headers: {
            ...(isCheckAuth && !!this.accessToken
              ? { Authorization: this.accessToken }
              : {}),

            ...customHeaders,
          },

          signal: controller.signal,

          ...otherConfig,
        })

        .then(response => {
          resolve(response.data as never);
        })

        .catch(err => {
          if (err.code !== 'ERR_CANCELED' && isHandleError) {
            handleError(err);
          }

          reject(err);
        })

        .finally(() => {
          if (this.requestInstance[requestId]) {
            delete this.requestInstance[requestId];
          }

          if (cancelTimeout) {
            clearTimeout(cancelTimeout);
          }
        });
    });
  };

  get = <T>({ url, config, params }: GetRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'GET',

      config: {
        ...(config || {}),

        url,

        params,
      },
    });
  };

  post = <T>({ url, config, data }: PostRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'POST',

      config: {
        ...(config || {}),

        url,

        data,
      },
    });
  };

  put = <T>({ url, config, data }: PostRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'PUT',

      config: {
        ...(config || {}),

        url,

        data,
      },
    });
  };

  delete = <T>({
    url,
    config,
    params,
  }: GetRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'DELETE',

      config: {
        ...(config || {}),

        url,

        params,
      },
    });
  };
}

const showErrorMessage = (message: string) => {
  console.log(message);
  // TODO handle message
};

export const handleError = (error: AxiosError<{ msg: string }>) => {
  const msg = error.response?.data?.msg;

  showErrorMessage(
    msg || error.message || 'Something went wrong, please try again'
  );

  // TODO captureException

  // if (error.response) {

  //   // The request was made and the server responded with a status code

  //   // that falls out of the range of 2xx

  // } else if (error.request) {

  //   // The request was made but no response was received

  //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of

  //   // http.ClientRequest in node.js

  // } else {

  //   // Something happened in setting up the request that triggered an Error

  // }
};

const createAxios = (config: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    headers: { 'Content-Type': 'application/json' },

    ...config,
  });

  axiosInstance.interceptors.request.use(
    async function (config) {
      // Do something before request is sent

      if (process.env.ENVIRONMENT === 'local') {
        console.log('URL request = ' + config.url);

        // console.log('HEADER = ', config.headers);

        console.log('PARAMS = ', JSON.stringify(config.params));

        console.log('data = ' + JSON.stringify(config.data));
      }

      if (config.headers) {
        // TODO config header
      }

      return config;
    },

    function (error) {
      // Do something with request error

      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },

    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger

      // Do something with response error

      return Promise.reject(error);
    },

    { synchronous: true }
  );

  return axiosInstance;
};

const httpClient = new HttpClient({});
export default httpClient;
