"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import PageLayout from "@/components/layouts/page-layout";
import List, { ListEmpty } from "@/components/list";
import BooksItem from "@/components/books/books-item";
import BooksListPrefix from "@/components/books/books-list-prefix";
import { useLikedBooksStore } from "@/stores/liked-books";

const PAGE_SIZE = 10;

// zustand persist의 hydration 완료 여부를 useSyncExternalStore로 구독합니다.
// SSR snapshot은 항상 false이니 서버는 loading indicator를 렌더하고,
// 클라이언트에서 persist가 localStorage를 다 읽으면 true가 되면서 List로 바뀝니다.
const subscribeToHydration = (callback: () => void) => useLikedBooksStore.persist.onFinishHydration(callback);
const getHydratedSnapshot = () => useLikedBooksStore.persist.hasHydrated();
const getServerHydratedSnapshot = () => false;

export default function LikesPage() {
  const books = useLikedBooksStore((state) => state.books);
  const hydrated = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerHydratedSnapshot);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);

  const displayedBooks = useMemo(() => {
    return books.slice(0, displayedCount);
  }, [books, displayedCount]);

  const hasNextPage = displayedBooks.length < books.length;

  const handleEndReached = useCallback(() => {
    if (!hasNextPage) {
      return;
    }

    setDisplayedCount((prev) => prev + PAGE_SIZE);
  }, [hasNextPage]);

  return (
    <PageLayout title="내가 찜한 책">
      <div className="flex w-full flex-col gap-8">
        {hydrated ? (
          <List
            items={displayedBooks}
            getKey={(book) => book.isbn}
            renderItem={(book) => <BooksItem book={book} />}
            prefix={<BooksListPrefix title="찜한 책" totalCount={books.length} />}
            emptyState={<ListEmpty message="찜한 책이 없습니다." />}
            onEndReached={handleEndReached}
            infinite
          />
        ) : (
          <div className="flex justify-center py-24">
            <HugeiconsIcon icon={Loading03Icon} className="text-muted-foreground size-8 animate-spin" />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
