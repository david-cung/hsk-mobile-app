import { z } from 'zod';

const EMAIL_REQUIRED_MESSAGE = 'Email is required.';
const EMAIL_INVALID_MESSAGE = 'Enter a valid email address.';
const PASSWORD_REQUIRED_MESSAGE = 'Password is required.';
const PASSWORD_MIN_LENGTH_MESSAGE = 'Password must be at least 6 characters.';
const DISPLAY_NAME_MAX_LENGTH_MESSAGE = 'Display name must be 100 characters or fewer.';

/** Valid email address required by the auth API (`EmailStr`). */
const emailSchema = z.string().trim().min(1, EMAIL_REQUIRED_MESSAGE).email(EMAIL_INVALID_MESSAGE);

/**
 * Registration password rules aligned with `UserRegister.password`
 * (`min_length=6` on the API).
 */
const registerPasswordSchema = z.string().min(6, PASSWORD_MIN_LENGTH_MESSAGE);

const optionalDisplayNameSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
}, z.string().max(100, DISPLAY_NAME_MAX_LENGTH_MESSAGE).optional());

/**
 * Login form validation aligned with `POST /api/v1/auth/login`.
 */
export const LoginInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, PASSWORD_REQUIRED_MESSAGE),
});

/**
 * Registration form validation aligned with `POST /api/v1/auth/register`.
 */
export const RegisterInputSchema = z.object({
  email: emailSchema,
  password: registerPasswordSchema,
  display_name: optionalDisplayNameSchema,
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

/**
 * Token payload from `POST /api/v1/auth/login` and `POST /api/v1/auth/register`.
 * Aligned with the API `Token` schema.
 */
export const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
});

/**
 * Authenticated user from `GET /api/v1/auth/me`.
 * Aligned with the API `UserOut` schema.
 */
export const UserSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  display_name: z.string().nullable(),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type User = z.infer<typeof UserSchema>;
