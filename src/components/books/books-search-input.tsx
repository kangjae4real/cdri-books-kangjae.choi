"use client";

import { useCallback, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import SearchInput from "@/components/ui/search-input";
import { useSearchHistory } from "@/hooks/use-search-history";
import { SearchFormValues, SearchSubmitValue } from "@/schemas/search";

type BooksSearchInputProps = {
  className?: string;
  placeholder?: string;
  onSubmit?: (value: SearchSubmitValue) => void;
};

export default function BooksSearchInput({ className, placeholder, onSubmit }: BooksSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { history, add, remove } = useSearchHistory();

  const { control, setValue, trigger } = useFormContext<SearchFormValues>();
  const { field } = useController({ control, name: "keyword" });

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

  const handleHistorySelect = useCallback(
    async (value: string) => {
      await submit(value);
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

  return (
    <SearchInput
      className={className}
      placeholder={placeholder}
      inputRef={inputRef}
      value={field.value ?? ""}
      onChange={field.onChange}
      onInputBlur={field.onBlur}
      onSubmit={submit}
      history={history}
      onHistorySelect={handleHistorySelect}
      onHistoryRemove={handleHistoryRemove}
    />
  );
}
