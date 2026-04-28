import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import { Text } from "@/components/typography";

const booksListPrefixVariants = cva("flex items-center gap-3");

type BooksListPrefix = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof booksListPrefixVariants> & {
    title?: string;
    totalCount: number;
  };

export default function BooksListPrefix({
  className,
  title = "도서 검색 결과",
  totalCount,
  ...props
}: BooksListPrefix) {
  return (
    <div className={cn(booksListPrefixVariants(), className)} {...props}>
      <Text type="paragraph">{title}</Text>
      <Text type="paragraph">
        총 <span className="text-primary">{totalCount}</span>건
      </Text>
    </div>
  );
}
