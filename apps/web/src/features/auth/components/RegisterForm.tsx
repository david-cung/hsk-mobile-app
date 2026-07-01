import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { FieldError, Input, Label } from '@/components/ui/Input';
import { useFieldErrorMap } from '@/hooks/useFieldErrorMap';
import { useZodForm } from '@/hooks/useZodForm';

import { RegisterInputSchema } from '../api/auth.schemas';
import { useRegister } from '../hooks/useRegister';

const EMAIL_FIELD_ID = 'register-email';
const EMAIL_ERROR_ID = 'register-email-error';
const PASSWORD_FIELD_ID = 'register-password';
const PASSWORD_ERROR_ID = 'register-password-error';
const DISPLAY_NAME_FIELD_ID = 'register-display-name';
const DISPLAY_NAME_HINT_ID = 'register-display-name-hint';
const DISPLAY_NAME_ERROR_ID = 'register-display-name-error';
const FORM_ERROR_ID = 'register-form-error';

export function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useZodForm(RegisterInputSchema, {
    defaultValues: {
      email: '',
      password: '',
      display_name: '',
    },
  });
  const { mapFieldErrors } = useFieldErrorMap(setError);
  const registerMutation = useRegister({
    onSuccess: () => {
      navigate('/', { replace: true });
    },
  });
  const isSubmitting = registerMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values, {
      onError: mapFieldErrors,
    });
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const displayNameError = errors.display_name?.message;
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
          autoComplete="new-password"
          disabled={isSubmitting}
          error={Boolean(passwordError)}
          id={PASSWORD_FIELD_ID}
          minLength={6}
          required
          spellCheck={false}
          type="password"
        />
        <FieldError id={PASSWORD_ERROR_ID}>{passwordError}</FieldError>
      </div>

      <div>
        <Label htmlFor={DISPLAY_NAME_FIELD_ID}>Display name</Label>
        <p className="m-0 mb-1 text-label-sm text-on-surface-variant" id={DISPLAY_NAME_HINT_ID}>
          Optional. Shown on your profile.
        </p>
        <Input
          {...register('display_name')}
          aria-describedby={
            displayNameError
              ? `${DISPLAY_NAME_HINT_ID} ${DISPLAY_NAME_ERROR_ID}`
              : DISPLAY_NAME_HINT_ID
          }
          autoComplete="nickname"
          disabled={isSubmitting}
          error={Boolean(displayNameError)}
          id={DISPLAY_NAME_FIELD_ID}
          maxLength={100}
          type="text"
        />
        <FieldError id={DISPLAY_NAME_ERROR_ID}>{displayNameError}</FieldError>
      </div>

      <FieldError id={FORM_ERROR_ID}>{formError}</FieldError>

      <Button fullWidth loading={isSubmitting} type="submit">
        Create account
      </Button>
    </form>
  );
}
