
import { cva } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const tagStyles = cva([
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
]);

const tagVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/70",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/70",
  outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
};

type TagProps = ComponentProps<"button"> & {
  variant?: keyof typeof tagVariants;
  text: string;
};

export function Tag({ className, variant = "outline", text, ...props }: TagProps) {
  return (
    <button
      className={twMerge(tagStyles({ className, variant }))}
      {...props}
    >
      {text}
    </button>
  );
}
