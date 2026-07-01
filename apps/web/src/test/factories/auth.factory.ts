import {
  type TokenResponse,
  TokenResponseSchema,
  type User,
  UserSchema,
} from '@/features/auth/api/auth.schemas';

export function createTokenResponse(overrides: Partial<TokenResponse> = {}): TokenResponse {
  return TokenResponseSchema.parse({
    access_token: 'mock-access-token',
    token_type: 'bearer',
    ...overrides,
  });
}

export function createUser(overrides: Partial<User> = {}): User {
  return UserSchema.parse({
    id: 1,
    email: 'learner@example.com',
    display_name: 'Mock Learner',
    ...overrides,
  });
}
