"use client";

import { cva, VariantProps } from "class-variance-authority";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/utils/shadcn";
import { Document } from "@/types/api";
import { Heading, Text } from "@/components/typography";
import { useLikedBooksStore } from "@/stores/liked-books";

const bookListItemVariants = cva("flex items-center gap-6 border-b border-border py-4");

type BookListItemProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof bookListItemVariants> & {
    book: Document;
  };

export default function BookListItem({ book, className, ...props }: BookListItemProps) {
  const liked = useLikedBooksStore((state) => state.books.some((b) => b.isbn === book.isbn));
  const add = useLikedBooksStore((state) => state.add);
  const remove = useLikedBooksStore((state) => state.remove);

  const handleToggleLike = () => {
    if (liked) {
      remove(book.isbn);
      return;
    }

    add(book);
  };

  return (
    <div className={cn(bookListItemVariants(), className)} {...props}>
      {book.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.thumbnail} alt={book.title} className="h-30 w-22 shrink-0 object-cover" />
      ) : (
        <div className="bg-secondary h-30 w-22 shrink-0" />
      )}

      <div className="flex flex-1 flex-col gap-1">
        <Heading as="h3">{book.title}</Heading>
        <Text type="paragraph" className="text-sub-title">
          {book.authors.join(", ")}
          {book.publisher ? ` · ${book.publisher}` : null}
        </Text>
        <Text type="paragraph" className="font-bold">
          {book.price.toLocaleString()}원
        </Text>
      </div>

      <button
        type="button"
        aria-label={liked ? "찜 해제" : "찜하기"}
        onClick={handleToggleLike}
        className={cn(
          "flex size-10 items-center justify-center rounded-full transition-colors",
          liked ? "text-destructive" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <HugeiconsIcon icon={FavouriteIcon} className="size-6" />
      </button>
    </div>
  );
}
