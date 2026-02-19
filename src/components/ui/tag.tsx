
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

// 1. We put the variants INSIDE the cva() call
const tagStyles = cva(
  [
    "inline-flex",
    "items-center",
    "px-2.5",
    "py-0.5",
    "rounded-full",
    "text-xs",
    "font-semibold",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-ring",
    "focus:ring-offset-2",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/70",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/70",
        outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 2. We verify the type works automatically
type TagProps = ComponentProps<"button"> &
  VariantProps<typeof tagStyles> & {
    text: string;
  };

export function Tag({ className, variant, text, ...props }: TagProps) {
  return (
    <button className={twMerge(tagStyles({ variant, className }))} {...props}>
      {text}
    </button>
  );
}
