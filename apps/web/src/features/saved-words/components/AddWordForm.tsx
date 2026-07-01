import { useId } from 'react';

import { Button } from '@/components/ui/Button';
import { FieldError, Input, Label } from '@/components/ui/Input';
import { useZodForm } from '@/hooks/useZodForm';

import { type SavedWordCreateInput, SavedWordCreateInputSchema } from '../api/savedWords.schemas';

type AddWordFormProps = {
  onSubmit: (values: SavedWordCreateInput) => void;
};

const HANZI_FIELD_ID = 'add-word-hanzi';
const HANZI_ERROR_ID = 'add-word-hanzi-error';
const PINYIN_FIELD_ID = 'add-word-pinyin';
const PINYIN_ERROR_ID = 'add-word-pinyin-error';
const MEANING_FIELD_ID = 'add-word-meaning';
const MEANING_ERROR_ID = 'add-word-meaning-error';

export function AddWordForm({ onSubmit }: AddWordFormProps) {
  const formId = useId();
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
        <Label htmlFor={HANZI_FIELD_ID} required>
          Hanzi
        </Label>
        <Input
          {...register('hanzi')}
          aria-describedby={hanziError ? HANZI_ERROR_ID : undefined}
          autoComplete="off"
          error={Boolean(hanziError)}
          id={HANZI_FIELD_ID}
          inputMode="text"
          lang="zh-Hans"
          placeholder="你好"
        />
        <FieldError id={HANZI_ERROR_ID}>{hanziError}</FieldError>
      </div>

      <div>
        <Label htmlFor={PINYIN_FIELD_ID}>Pinyin</Label>
        <Input
          {...register('pinyin')}
          aria-describedby={pinyinError ? PINYIN_ERROR_ID : undefined}
          autoComplete="off"
          error={Boolean(pinyinError)}
          id={PINYIN_FIELD_ID}
          placeholder="nǐ hǎo"
        />
        <FieldError id={PINYIN_ERROR_ID}>{pinyinError}</FieldError>
      </div>

      <div>
        <Label htmlFor={MEANING_FIELD_ID}>Meaning</Label>
        <Input
          {...register('meaning')}
          aria-describedby={meaningError ? MEANING_ERROR_ID : undefined}
          autoComplete="off"
          error={Boolean(meaningError)}
          id={MEANING_FIELD_ID}
          placeholder="Hello / Hi"
        />
        <FieldError id={MEANING_ERROR_ID}>{meaningError}</FieldError>
      </div>

      <Button className="self-start" type="submit">
        Save word
      </Button>
    </form>
  );
}

export type { AddWordFormProps };
