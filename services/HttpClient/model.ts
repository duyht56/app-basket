import { AxiosResponse } from 'axios';

import { AxiosRequestConfig, Method } from 'axios';

export type RequestConfig = AxiosRequestConfig & {
  isCheckAuth?: boolean; //is request need pass auth token or not?

  isHandleError?: boolean; //is request need auto handle error or not?

  requestId?: string; //requestId passing to manual cancel request

  headers?: Record<string, string>; //some customHeaders

  isKeepRequest?: boolean; //is not auto cancel request after timeout?

  useShopToken?: boolean;
};

export type ApiErrorResponse<T> = AxiosResponse<T> & { message: string };

export type ApiRequestParams = {
  method: Method;
  config: RequestConfig;
};

export type GetRequestParams = {
  url: string;
  params?: unknown;
  config?: RequestConfig;
};

export type PostRequestParams = {
  url: string;
  data?: unknown;
  config?: RequestConfig;
};

export type BaseServerDataResponse<T> = {
  data: T;
  error: number;
  message: string;
};

export type BaseApiResponse<T> = Promise<T>;
