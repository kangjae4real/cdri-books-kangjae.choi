"use client";

import { useCallback, useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Cancel01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/utils/shadcn";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import Input from "@/components/input";
import { SearchFormValues, SearchSubmitValue, SearchTarget } from "@/schemas/search";

const detailSearchButtonVariants = cva("h-8.75");

type DetailSearchButtonProps = Omit<React.ComponentProps<"button">, "children" | "onSubmit"> &
  VariantProps<typeof detailSearchButtonVariants> & {
    onSubmit?: (value: SearchSubmitValue) => void;
  };

const TARGET_OPTIONS = [
  { value: "title", label: "제목" },
  { value: "person", label: "저자명" },
  { value: "publisher", label: "출판사" },
] as const;

const TARGET_OPTIONS_MAP: Record<SearchTarget, string> = {
  title: "제목",
  person: "저자명",
  publisher: "출판사명",
};

export default function DetailSearchButton({ className, onSubmit, ...props }: DetailSearchButtonProps) {
  const [open, setOpen] = useState(false);

  const { control, getValues, setValue, trigger } = useFormContext<SearchFormValues>();
  const { field: targetField } = useController({ control, name: "detail.target" });
  const { field: keywordField } = useController({ control, name: "detail.keyword" });

  const submit = useCallback(async () => {
    const valid = await trigger("detail.keyword");

    if (!valid) {
      return;
    }

    const detail = getValues("detail");
    const trimmed = detail.keyword.trim();

    // 상세 검색이 발동되면 키워드 검색 상태 초기화
    setValue("keyword", "");

    setOpen(false);

    if (onSubmit) {
      onSubmit({ query: trimmed, target: detail.target });
    }
  }, [trigger, getValues, setValue, onSubmit]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    },
    [submit],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn(detailSearchButtonVariants(), className)} {...props}>
          상세 검색
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-120 gap-0 rounded-lg p-6 pt-10">
        <PopoverClose
          aria-label="닫기"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/30 absolute top-4 right-4 inline-flex size-6 items-center justify-center"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-5" />
        </PopoverClose>

        <div className="flex items-center gap-3">
          <Select value={targetField.value} onValueChange={(value) => targetField.onChange(value as SearchTarget)}>
            <SelectTrigger
              className={cn(
                "group w-25 shrink-0 rounded-none border-x-0 border-t-0 bg-transparent px-0 pb-1",
                "data-[size=default]:h-10",
                "border-border border-b",
                "data-[state=open]:border-primary",
                "text-foreground text-base font-bold",
              )}
            >
              <span>{TARGET_OPTIONS_MAP[targetField.value]}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className="text-muted-foreground size-4 transition-transform group-data-[state=open]:rotate-180"
              />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={6} className="min-w-(--radix-select-trigger-width) p-1">
              {TARGET_OPTIONS.filter((option) => option.value !== targetField.value).map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-muted-foreground text-base font-bold"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Input
              value={keywordField.value ?? ""}
              onChange={keywordField.onChange}
              onBlur={keywordField.onBlur}
              onKeyDown={handleKeyDown}
              placeholder="검색어 입력"
              className={cn(
                "h-10 w-full bg-transparent pb-1 text-base outline-none",
                "border-border border-b",
                "placeholder:text-muted-foreground",
                "focus:border-primary",
              )}
            />
          </div>
        </div>

        <Button
          onClick={submit}
          className="mt-6 h-12 w-full rounded-lg text-base font-bold active:not-aria-[haspopup]:translate-y-0"
        >
          검색하기
        </Button>
      </PopoverContent>
    </Popover>
  );
}
