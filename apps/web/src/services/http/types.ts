import type { AxiosRequestConfig } from 'axios';

/** HTTP verbs supported by the API client. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Controls whether auth headers are attached to a request. */
export type RequestAuthMode = 'required' | 'optional' | 'none';

export type ApiRequestConfig = AxiosRequestConfig & {
  /** When true, the request will not include an Authorization header. */
  skipAuth?: boolean;
};

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}
