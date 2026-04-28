"use client";

import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { booksQueries } from "@/queries/books";
import PageLayout from "@/components/layouts/page-layout";
import SearchForm from "@/components/search-form";
import List, { ListEmpty } from "@/components/list";
import BooksItem from "@/components/books/books-item";
import { SearchSubmitValue } from "@/schemas/search";
import BooksListPrefix from "@/components/books/books-list-prefix";

export default function IndexPage() {
  const [params, setParams] = useState<SearchSubmitValue>({ query: "" });
  const { data, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    booksQueries.search(params),
  );
  const totalCount = useMemo(() => {
    if (!data?.pages || !data.pages.length) {
      return 0;
    }

    return data.pages[0].meta.total_count;
  }, [data]);

  const documents = useMemo(() => {
    return data?.pages.flatMap((page) => page.documents) ?? [];
  }, [data]);

  const handleEndReached = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    await fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <PageLayout title="도서 검색">
      <div className="flex w-full flex-col gap-8">
        <SearchForm onSearch={setParams} />

        <List
          items={documents}
          getKey={(book) => book.isbn}
          renderItem={(book) => <BooksItem book={book} />}
          prefix={<BooksListPrefix totalCount={totalCount} />}
          emptyState={isFetching ? null : <ListEmpty message="검색된 결과가 없습니다." />}
          loading={isFetchingNextPage}
          onEndReached={handleEndReached}
          infinite
        />
      </div>
    </PageLayout>
  );
}
