import './types';

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { API_REQUEST_TIMEOUT_MS } from '@/app/config/constants';
import { env } from '@/app/config/env';

import { getToken } from '../auth/tokenStorage';
import { normalizeAxiosError } from './errors';

function attachAuthorizationHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (config.skipAuth) {
    return config;
  }

  const token = getToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
}

function registerInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config) => attachAuthorizationHeader(config),
    (error: unknown) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeAxiosError(error)),
  );
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: API_REQUEST_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  registerInterceptors(client);

  return client;
}

export const apiClient = createApiClient();
