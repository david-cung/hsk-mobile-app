import { useId } from 'react';

import { Button } from '@/components/ui/Button';
import { FieldError, Input, Label } from '@/components/ui/Input';
import { useZodForm } from '@/hooks/useZodForm';

import { type SavedWordCreateInput, SavedWordCreateInputSchema } from '../api/savedWords.schemas';

type AddWordFormProps = {
  onSubmit: (values: SavedWordCreateInput) => void;
};

export function AddWordForm({ onSubmit }: AddWordFormProps) {
  const formId = useId();
  const hanziFieldId = `${formId}-hanzi`;
  const hanziErrorId = `${formId}-hanzi-error`;
  const pinyinFieldId = `${formId}-pinyin`;
  const pinyinErrorId = `${formId}-pinyin-error`;
  const meaningFieldId = `${formId}-meaning`;
  const meaningErrorId = `${formId}-meaning-error`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(SavedWordCreateInputSchema, {
    defaultValues: {
      hanzi: '',
      pinyin: '',
      meaning: '',
    },
  });

  const submitHandler = handleSubmit((values) => {
    onSubmit(values);
    reset();
  });

  const hanziError = errors.hanzi?.message;
  const pinyinError = errors.pinyin?.message;
  const meaningError = errors.meaning?.message;

  return (
    <form
      aria-labelledby={`${formId}-heading`}
      className="flex flex-col gap-stack-md"
      noValidate
      onSubmit={submitHandler}
    >
      <h2 className="m-0 text-headline-md text-on-surface" id={`${formId}-heading`}>
        Add a word
      </h2>
      <p className="m-0 text-body-md text-on-surface-variant">
        Save vocabulary from your lessons or add new words manually.
      </p>

      <div>
        <Label htmlFor={hanziFieldId} required>
          Hanzi
        </Label>
        <Input
          {...register('hanzi')}
          aria-describedby={hanziError ? hanziErrorId : undefined}
          autoComplete="off"
          error={Boolean(hanziError)}
          id={hanziFieldId}
          inputMode="text"
          lang="zh-Hans"
          placeholder="你好"
        />
        <FieldError id={hanziErrorId}>{hanziError}</FieldError>
      </div>

      <div>
        <Label htmlFor={pinyinFieldId}>Pinyin</Label>
        <Input
          {...register('pinyin')}
          aria-describedby={pinyinError ? pinyinErrorId : undefined}
          autoComplete="off"
          error={Boolean(pinyinError)}
          id={pinyinFieldId}
          placeholder="nǐ hǎo"
        />
        <FieldError id={pinyinErrorId}>{pinyinError}</FieldError>
      </div>

      <div>
        <Label htmlFor={meaningFieldId}>Meaning</Label>
        <Input
          {...register('meaning')}
          aria-describedby={meaningError ? meaningErrorId : undefined}
          autoComplete="off"
          error={Boolean(meaningError)}
          id={meaningFieldId}
          placeholder="Hello / Hi"
        />
        <FieldError id={meaningErrorId}>{meaningError}</FieldError>
      </div>

      <Button className="self-start" type="submit">
        Save word
      </Button>
    </form>
  );
}

export type { AddWordFormProps };
