"use client";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import { useCallback, useMemo, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Input from "@/components/input";
import { useSearchHistory } from "@/hooks/use-search-history";
import { SearchFormValues, SearchSubmitValue } from "@/schemas/search";

const searchInputVariants = cva("w-120 flex flex-col rounded-4xl border-none bg-secondary px-4");

type SearchInputProps = Omit<React.ComponentProps<"div">, "children" | "onSubmit"> &
  VariantProps<typeof searchInputVariants> & {
    prefixIcon?: React.ReactNode;
    placeholder?: string;
    onSubmit?: (value: SearchSubmitValue) => void;
  };

export default function SearchInput({ className, prefixIcon, placeholder, onSubmit, ...props }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const { history, add, remove } = useSearchHistory();

  const { control, getValues, setValue, trigger } = useFormContext<SearchFormValues>();
  const { field } = useController({ control, name: "keyword" });

  const prefix = useMemo(() => {
    return prefixIcon ?? <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />;
  }, [prefixIcon]);

  const submit = useCallback(
    async (value: string) => {
      setValue("keyword", value);

      const valid = await trigger("keyword");

      if (!valid) {
        return;
      }

      const trimmed = value.trim();
      add(trimmed);

      // 키워드 검색 시, 상세 검색 상태 초기화
      setValue("detail", { target: "title", keyword: "" });

      if (onSubmit) {
        onSubmit({ query: trimmed });
      }
    },
    [setValue, trigger, add, onSubmit],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit(getValues("keyword"));
      }
    },
    [getValues, submit],
  );

  const handleBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setFocused(false);
  }, []);

  const handleHistoryClick = useCallback(
    (value: string) => {
      submit(value);

      inputRef.current?.focus();
    },
    [submit],
  );

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
      onFocus={() => {
        setFocused(true);
        setHasOpenedOnce(true);
      }}
      onBlur={handleBlur}
      {...props}
    >
      <div className="flex h-12.5 w-full items-center gap-4">
        {prefix}
        <Input
          ref={inputRef}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
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
          {/* localStorage 기반 history는 SSR/CSR 간 값이 달라 hydration mismatch가 발생하므로, */}
          {/* 사용자가 한 번이라도 focus한 이후에만 마운트하여 첫 렌더에서 항상 비어있도록 보장합니다. */}
          <ul className="flex flex-col pt-1 pb-3 pl-9">
            {hasOpenedOnce &&
              history.map((item) => (
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
