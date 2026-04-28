"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/utils/shadcn";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/typography";
import { useLikedBooksStore } from "@/stores/liked-books";
import { Document } from "@/types/api";

type BooksItemProps = {
  book: Document;
};

export default function BooksItem({ book }: BooksItemProps) {
  const [expanded, setExpanded] = useState(false);

  const liked = useLikedBooksStore((state) => state.books.some((b) => b.isbn === book.isbn));
  const add = useLikedBooksStore((state) => state.add);
  const remove = useLikedBooksStore((state) => state.remove);

  const hasSale = useMemo(() => {
    return typeof book.sale_price === "number" && book.sale_price >= 0;
  }, [book.sale_price]);
  const finalPrice = useMemo(() => {
    return hasSale ? (book.sale_price as number) : book.price;
  }, [hasSale, book.sale_price, book.price]);

  const handleToggleLike = () => {
    if (liked) {
      remove(book.isbn);
      return;
    }

    add(book);
  };

  const handleBuy = () => {
    window.open(book.url, "_blank", "noopener,noreferrer");
  };

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "border-border flex gap-6 border-b transition-[padding] duration-300",
        expanded ? "items-stretch py-6" : "items-center py-4",
      )}
    >
      <div className={cn("relative shrink-0 transition-all duration-300", expanded ? "h-72 w-52" : "h-22 w-16")}>
        {book.thumbnail ? (
          <Image src={book.thumbnail} alt={book.title} fill sizes="208px" className="object-cover" />
        ) : (
          <div className="bg-secondary h-full w-full" />
        )}

        <button
          type="button"
          aria-label={liked ? "찜 해제" : "찜하기"}
          onClick={handleToggleLike}
          className="absolute top-1 right-1 cursor-pointer"
        >
          <Image
            src={liked ? "/assets/icons/icon-heart-fill.svg" : "/assets/icons/icon-heart.svg"}
            width={22}
            height={20}
            alt="like-button-icon"
            className={cn("w-auto", expanded ? "h-6" : "h-4")}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-baseline gap-3">
          <Heading as="h3">{book.title}</Heading>
          <Text type="paragraph" className="text-muted-foreground">
            {book.authors.join(", ")}
          </Text>
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2">
              <Heading as="h3">책 소개</Heading>
              <Text type="paragraph" className="leading-relaxed">
                {book.contents}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {expanded ? (
        <div className="flex w-44 shrink-0 flex-col items-end justify-between">
          <Button variant="outline" onClick={handleToggleExpand} className="h-9 px-3">
            상세보기
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 rotate-180" />
          </Button>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-end gap-1">
              {hasSale && (
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground text-xs">원가</span>
                  <span className="text-muted-foreground text-sm line-through">{book.price.toLocaleString()}원</span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                {hasSale && <span className="text-muted-foreground text-xs">할인가</span>}
                <span className="text-foreground text-lg font-bold">{finalPrice.toLocaleString()}원</span>
              </div>
            </div>

            <Button onClick={handleBuy} className="h-12 w-full text-sm font-bold">
              구매하기
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-4">
          <Text type="paragraph" className="font-bold">
            {finalPrice.toLocaleString()}원
          </Text>
          <Button onClick={handleBuy} className="h-9 px-4">
            구매하기
          </Button>
          <Button variant="outline" onClick={handleToggleExpand} className="h-9 px-3">
            상세보기
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
