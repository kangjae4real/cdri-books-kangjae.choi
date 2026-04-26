"use client";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import { useCallback, useMemo, useRef, useState } from "react";
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Input from "@/components/input";
import { useSearchHistory } from "@/hooks/use-search-history";

const searchInputVariants = cva("w-120 flex flex-col rounded-4xl border-none bg-secondary px-4");

type SearchInputProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof searchInputVariants> & {
    prefixIcon?: React.ReactNode;
    placeholder?: string;
  };

export default function SearchInput({ className, prefixIcon, placeholder, ...props }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { history, add, remove } = useSearchHistory();

  const prefix = useMemo(() => {
    return prefixIcon ?? <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />;
  }, [prefixIcon]);

  const handleSubmit = useCallback(() => {
    if (!keyword.trim()) return;
    add(keyword);
  }, [keyword, add]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setFocused(false);
  }, []);

  const handleHistoryClick = useCallback((value: string) => {
    setKeyword(value);
    inputRef.current?.focus();
  }, []);

  const handleHistoryRemove = useCallback(
    (value: string) => {
      remove(value);
      inputRef.current?.focus();
    },
    [remove],
  );

  const showHistory = focused && history.length > 0;

  return (
    <div
      className={cn(searchInputVariants(), className)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      {...props}
    >
      <div className="flex h-12.5 w-full items-center gap-4">
        {prefix}
        <Input
          ref={inputRef}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          showHistory ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col pt-1 pb-3 pl-9">
            {history.map((item) => (
              <li key={item} className="flex items-center justify-between py-2">
                <button
                  type="button"
                  onClick={() => handleHistoryClick(item)}
                  className="text-foreground flex-1 text-left text-sm"
                >
                  {item}
                </button>
                <button
                  type="button"
                  aria-label="검색기록 삭제"
                  onClick={() => handleHistoryRemove(item)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
