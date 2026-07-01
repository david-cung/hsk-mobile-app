type SectionHeadingProps = {
  id: string;
  title: string;
  meta?: string;
};

export function SectionHeading({ id, title, meta }: SectionHeadingProps) {
  return (
    <div className="mb-stack-md flex items-center justify-between gap-stack-md">
      <h3 className="m-0 text-headline-md text-on-surface" id={id}>
        {title}
      </h3>
      {meta ? <span className="shrink-0 text-label-sm text-outline">{meta}</span> : null}
    </div>
  );
}

export type { SectionHeadingProps };
