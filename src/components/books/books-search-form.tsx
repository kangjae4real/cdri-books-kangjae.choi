"use client";

import { cva, VariantProps } from "class-variance-authority";
import { FormProvider, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { cn } from "@/utils/shadcn";
import BooksSearchInput from "@/components/books/books-search-input";
import BooksDetailSearchButton from "@/components/books/books-detail-search-button";
import { SearchFormValues, SearchSubmitValue, searchFormSchema } from "@/schemas/search";

const booksSearchFormVariants = cva("");

type BooksSearchFormProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof booksSearchFormVariants> & {
    onSearch?: (value: SearchSubmitValue) => void;
  };

export default function BooksSearchForm({ className, onSearch, ...props }: BooksSearchFormProps) {
  const form = useForm<SearchFormValues>({
    resolver: standardSchemaResolver(searchFormSchema),
    defaultValues: { keyword: "", detail: { target: "title", keyword: "" } },
    mode: "onSubmit",
  });

  return (
    <div className={cn(booksSearchFormVariants(), className)} {...props}>
      <FormProvider {...form}>
        <div className="grid w-fit grid-cols-[auto_auto] items-start gap-4">
          <BooksSearchInput onSubmit={onSearch} />
          <BooksDetailSearchButton className="mt-2" onSubmit={onSearch} />
        </div>
      </FormProvider>
    </div>
  );
}
