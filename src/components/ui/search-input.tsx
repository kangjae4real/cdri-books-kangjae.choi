"use client";

import { cva, VariantProps } from "class-variance-authority";
import { useCallback, useState } from "react";
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/utils/shadcn";
import Input from "@/components/input";

const searchInputVariants = cva("w-120 flex flex-col rounded-4xl border-none bg-secondary px-4");

export type SearchInputProps = Omit<React.ComponentProps<"div">, "children" | "onChange" | "onBlur" | "onSubmit"> &
  VariantProps<typeof searchInputVariants> & {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onSubmit?: (value: string) => void;
    onInputBlur?: React.FocusEventHandler<HTMLInputElement>;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    prefixIcon?: React.ReactNode;
    placeholder?: string;
    history?: string[];
    onHistorySelect?: (value: string) => void;
    onHistoryRemove?: (value: string) => void;
  };

export default function SearchInput({
  className,
  value,
  onChange,
  onSubmit,
  onInputBlur,
  inputRef,
  prefixIcon,
  placeholder,
  history = [],
  onHistorySelect,
  onHistoryRemove,
  ...props
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  // history는 보통 클라이언트 전용 소스(localStorage 등)에서 오기 때문에 SSR/CSR 값이 달라질 수 있습니다.
  // 사용자가 한 번이라도 focus한 이후에만 history를 마운트해 첫 렌더에서는 항상 비어있도록 보장합니다.
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onSubmit?.(value);
      }
    },
    [onSubmit, value],
  );

  const handleBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setFocused(false);
  }, []);

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
        {prefixIcon ?? <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />}
        <Input
          ref={inputRef}
          value={value}
          onChange={onChange}
          onBlur={onInputBlur}
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
            {hasOpenedOnce &&
              history.map((item) => (
                <li key={item} className="flex items-center justify-between py-2">
                  <button
                    type="button"
                    onClick={() => onHistorySelect?.(item)}
                    className="text-foreground flex-1 cursor-pointer text-left text-sm"
                  >
                    {item}
                  </button>
                  <button
                    type="button"
                    aria-label="검색기록 삭제"
                    onClick={() => onHistoryRemove?.(item)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
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
