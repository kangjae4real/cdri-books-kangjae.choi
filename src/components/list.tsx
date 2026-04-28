"use client";

import { cva, VariantProps } from "class-variance-authority";
import { useEffect, useRef } from "react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/utils/shadcn";
import Image from "next/image";
import { Text } from "@/components/typography";

type ListEmptyProps = {
  message: string;
};

export function ListEmpty({ message }: ListEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <Image src="/assets/icons/icon-book.png" alt="" width={84} height={86} className="h-20 w-auto" priority />
      <Text type="paragraph" className="text-muted-foreground">
        {message}
      </Text>
    </div>
  );
}

const listItemVariants = cva("");

export type ListItemProps = React.ComponentProps<"li"> & VariantProps<typeof listItemVariants> & {};

export function ListItem({ className, children, ...props }: ListItemProps) {
  return (
    <li className={cn(listItemVariants(), className)} {...props}>
      {children}
    </li>
  );
}

const listVariants = cva("flex flex-col gap-4");

export type ListProps<T> = Omit<React.ComponentProps<"div">, "children" | "prefix"> &
  VariantProps<typeof listVariants> & {
    items: T[];
    getKey: (item: T, index: number) => string | number;
    renderItem: (item: T, index: number) => React.ReactNode;
    itemClassName?: string;
    prefix?: React.ReactNode;
    emptyState?: React.ReactNode;
    infinite?: boolean;
    loading?: boolean;
    onEndReached?: () => void;
  };

export default function List<T>({
  items,
  getKey,
  renderItem,
  itemClassName,
  className,
  prefix,
  emptyState,
  infinite = false,
  loading = false,
  onEndReached,
  ...props
}: ListProps<T>) {
  const sentinelRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!infinite || !onEndReached) {
      return;
    }

    const node = sentinelRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onEndReached();
          }
        }
      },
      // 사용자 viewport 하단에 닿기 200px 전부터 미리 다음 페이지를 요청한다
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [infinite, onEndReached]);

  const isEmpty = items.length === 0;

  return (
    <div className={cn(listVariants(), className)} {...props}>
      {prefix}
      {isEmpty && emptyState ? (
        emptyState
      ) : (
        <ul className="flex flex-col">
          {items.map((item, index) => (
            <ListItem key={getKey(item, index)} className={itemClassName}>
              {renderItem(item, index)}
            </ListItem>
          ))}
          {infinite && !isEmpty && (
            <li ref={sentinelRef} aria-hidden={!loading} className={cn("flex justify-center", loading && "py-4")}>
              {loading && (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="text-muted-foreground size-6 animate-spin"
                  aria-label="다음 페이지 불러오는 중"
                />
              )}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
