"use client";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import { useMemo, useRef } from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Input from "@/components/input";

const searchInputVariants = cva("w-120 h-12.5 rounded-4xl border-none bg-secondary flex items-center px-4");

type SearchInputProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof searchInputVariants> & {
    prefixIcon?: React.ReactNode;
    placeholder?: string;
  };

export default function SearchInput({ className, prefixIcon, placeholder, ...props }: SearchInputProps) {
  const inputRef = useRef(null);

  const prefix = useMemo(() => {
    return prefixIcon ?? <HugeiconsIcon icon={Search01Icon} />;
  }, [prefixIcon]);

  return (
    <div className={cn(searchInputVariants(), className)} {...props}>
      <div className="flex w-full items-center gap-4">
        {prefix}
        <Input ref={inputRef} placeholder={placeholder} />
      </div>
    </div>
  );
}
