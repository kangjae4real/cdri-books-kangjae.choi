"use client";

import { cva, VariantProps } from "class-variance-authority";
import { FormProvider, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { cn } from "@/utils/shadcn";
import { Heading } from "@/components/typography";
import SearchInput from "@/components/search-input";
import DetailSearchButton from "@/components/detail-search-button";
import { SearchFormValues, searchFormSchema } from "@/schemas/search";

const searchFormVariants = cva("flex flex-col gap-4");

type SearchFormProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof searchFormVariants> & {
    title: string;
    onSearch?: (keyword: string) => void;
  };

export default function SearchForm({ className, title, onSearch, ...props }: SearchFormProps) {
  const form = useForm<SearchFormValues>({
    resolver: standardSchemaResolver(searchFormSchema),
    defaultValues: { keyword: "" },
    mode: "onSubmit",
  });

  return (
    <div className={cn(searchFormVariants(), className)} {...props}>
      <Heading as="h2" className="text-[#1A1E27]">
        {title}
      </Heading>

      <FormProvider {...form}>
        <div className="grid w-fit grid-cols-[auto_auto] items-start gap-4">
          <SearchInput onSubmit={onSearch} />
          <DetailSearchButton className="mt-2" />
        </div>
      </FormProvider>
    </div>
  );
}
