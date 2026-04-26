import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import { Heading } from "@/components/typography";
import SearchInput from "@/components/search-input";
import DetailSearchButton from "@/components/detail-search-button";

const searchFormVariants = cva("w-full flex flex-col gap-4");

type SearchFormProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof searchFormVariants> & {
    title: string;
  };

export default function SearchForm({ className, title, ...props }: SearchFormProps) {
  return (
    <div className={cn(searchFormVariants(), className)} {...props}>
      <Heading as="h2" className="text-[#1A1E27]">
        {title}
      </Heading>

      <div className="flex items-center gap-4">
        <SearchInput />
        <DetailSearchButton />
      </div>
    </div>
  );
}
