"use client";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import { forwardRef } from "react";

const inputVariants = cva("w-full font-bold placeholder:font-bold");

export type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants> & {};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder = "검색어를 입력하세요", ...props }, ref) => {
    return <input ref={ref} placeholder={placeholder} className={cn(inputVariants(), className)} {...props} />;
  },
);
Input.displayName = "Input";

export default Input;
