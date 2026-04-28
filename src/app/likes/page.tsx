"use client";

import PageLayout from "@/components/layouts/page-layout";
import List, { ListEmpty } from "@/components/list";
import BooksItem from "@/components/books/books-item";
import BooksListPrefix from "@/components/books/books-list-prefix";
import { useLikedBooksStore } from "@/stores/liked-books";

export default function LikesPage() {
  const books = useLikedBooksStore((state) => state.books);

  return (
    <PageLayout title="내가 찜한 책">
      <div className="flex w-full flex-col gap-8">
        <List
          items={books}
          getKey={(book) => book.isbn}
          renderItem={(book) => <BooksItem book={book} />}
          prefix={<BooksListPrefix title="찜한 책" totalCount={books.length} />}
          emptyState={<ListEmpty message="찜한 책이 없습니다." />}
        />
      </div>
    </PageLayout>
  );
}
