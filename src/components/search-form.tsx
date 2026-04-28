"use client";

import { cva, VariantProps } from "class-variance-authority";
import { FormProvider, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { cn } from "@/utils/shadcn";
import SearchInput from "@/components/search-input";
import DetailSearchButton from "@/components/detail-search-button";
import { SearchFormValues, SearchSubmitValue, searchFormSchema } from "@/schemas/search";

const searchFormVariants = cva("");

type SearchFormProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof searchFormVariants> & {
    onSearch?: (value: SearchSubmitValue) => void;
  };

export default function SearchForm({ className, onSearch, ...props }: SearchFormProps) {
  const form = useForm<SearchFormValues>({
    resolver: standardSchemaResolver(searchFormSchema),
    defaultValues: { keyword: "", detail: { target: "title", keyword: "" } },
    mode: "onSubmit",
  });

  return (
    <div className={cn(searchFormVariants(), className)} {...props}>
      <FormProvider {...form}>
        <div className="grid w-fit grid-cols-[auto_auto] items-start gap-4">
          <SearchInput onSubmit={onSearch} />
          <DetailSearchButton className="mt-2" onSubmit={onSearch} />
        </div>
      </FormProvider>
    </div>
  );
}
