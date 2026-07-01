import type { ZodType } from 'zod';

import { apiClient } from '@/services/http/axios';
import { API_ENDPOINTS } from '@/services/http/endpoints';
import { ApiError } from '@/services/http/errors';

import {
  type LoginInput,
  type RegisterInput,
  type TokenResponse,
  TokenResponseSchema,
  type User,
  UserSchema,
} from './auth.schemas';

const unauthenticatedRequest = { skipAuth: true } as const;

function parseResponse<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError({
      message: 'The server returned an unexpected response.',
      status: 502,
      cause: result.error,
    });
  }

  return result.data;
}

export async function login(input: LoginInput): Promise<TokenResponse> {
  const response = await apiClient.post(API_ENDPOINTS.auth.login, input, unauthenticatedRequest);

  return parseResponse(TokenResponseSchema, response.data);
}

export async function register(input: RegisterInput): Promise<TokenResponse> {
  const response = await apiClient.post(API_ENDPOINTS.auth.register, input, unauthenticatedRequest);

  return parseResponse(TokenResponseSchema, response.data);
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get(API_ENDPOINTS.auth.me);

  return parseResponse(UserSchema, response.data);
}
