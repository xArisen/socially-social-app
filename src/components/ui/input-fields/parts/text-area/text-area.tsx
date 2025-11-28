import * as React from "react";

import { cn } from "@/lib/utils";

export enum TextareaVariant {
  Fixed = "fixed",
  Resizable = "resizable",
}

interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: TextareaVariant;
}

const textareaClassName = {
  base: "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  variants: {
    [TextareaVariant.Fixed]: "resize-none border-none",
    [TextareaVariant.Resizable]: "resize-y",
  } satisfies Record<TextareaVariant, string>,
};

function Textarea({
  className,
  variant = TextareaVariant.Resizable,
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        textareaClassName.base,
        textareaClassName.variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
