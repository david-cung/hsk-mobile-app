import { Button } from '@/components/ui/Button';
import { FieldError, Input, Label } from '@/components/ui/Input';
import { useFieldErrorMap } from '@/hooks/useFieldErrorMap';
import { useZodForm } from '@/hooks/useZodForm';

import { LoginInputSchema } from '../api/auth.schemas';
import { useLogin } from '../hooks/useLogin';

const EMAIL_FIELD_ID = 'login-email';
const EMAIL_ERROR_ID = 'login-email-error';
const PASSWORD_FIELD_ID = 'login-password';
const PASSWORD_ERROR_ID = 'login-password-error';
const FORM_ERROR_ID = 'login-form-error';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useZodForm(LoginInputSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { mapFieldErrors } = useFieldErrorMap(setError);
  const loginMutation = useLogin();
  const isSubmitting = loginMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onError: mapFieldErrors,
    });
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const formError = errors.root?.message;

  return (
    <form className="flex flex-col gap-stack-md" noValidate onSubmit={onSubmit}>
      <div>
        <Label htmlFor={EMAIL_FIELD_ID} required>
          Email
        </Label>
        <Input
          {...register('email')}
          aria-describedby={emailError ? EMAIL_ERROR_ID : undefined}
          autoComplete="email"
          disabled={isSubmitting}
          error={Boolean(emailError)}
          id={EMAIL_FIELD_ID}
          inputMode="email"
          required
          type="email"
        />
        <FieldError id={EMAIL_ERROR_ID}>{emailError}</FieldError>
      </div>

      <div>
        <Label htmlFor={PASSWORD_FIELD_ID} required>
          Password
        </Label>
        <Input
          {...register('password')}
          aria-describedby={passwordError ? PASSWORD_ERROR_ID : undefined}
          autoComplete="current-password"
          disabled={isSubmitting}
          error={Boolean(passwordError)}
          id={PASSWORD_FIELD_ID}
          required
          spellCheck={false}
          type="password"
        />
        <FieldError id={PASSWORD_ERROR_ID}>{passwordError}</FieldError>
      </div>

      <FieldError id={FORM_ERROR_ID}>{formError}</FieldError>

      <Button fullWidth loading={isSubmitting} type="submit">
        Sign in
      </Button>
    </form>
  );
}
