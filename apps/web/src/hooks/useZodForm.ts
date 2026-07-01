import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

type SchemaValues<TSchema extends z.ZodTypeAny> = z.infer<TSchema>;

type UseZodFormOptions<TSchema extends z.ZodTypeAny> = Omit<
  UseFormProps<SchemaValues<TSchema>>,
  'resolver'
>;

export function useZodForm<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  options?: UseZodFormOptions<TSchema>,
): UseFormReturn<SchemaValues<TSchema>> {
  return useForm<SchemaValues<TSchema>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    ...options,
    resolver: zodResolver(schema),
  });
}
