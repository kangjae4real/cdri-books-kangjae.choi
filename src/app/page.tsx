"use client";

import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { booksQueries } from "@/queries/books";
import PageLayout from "@/components/layouts/page-layout";
import SearchForm from "@/components/search-form";
import List from "@/components/list";
import ListEmpty from "@/components/list-empty";
import BookListItem from "@/components/book-list-item";
import { Text } from "@/components/typography";
import { SearchSubmitValue } from "@/schemas/search";

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

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <PageLayout>
      <div className="flex w-full flex-col gap-8">
        <SearchForm title="도서 검색" onSearch={setParams} />

        <List
          items={documents}
          getKey={(book) => book.isbn}
          renderItem={(book) => <BookListItem book={book} />}
          prefix={
            <div className="flex items-center gap-3">
              <Text type="paragraph">도서 검색 결과</Text>
              <Text type="paragraph">
                총 <span className="text-primary">{totalCount}</span>건
              </Text>
            </div>
          }
          emptyState={isFetching ? null : <ListEmpty message="검색된 결과가 없습니다." />}
          infinite
          loading={isFetchingNextPage}
          onEndReached={handleEndReached}
        />
      </div>
    </PageLayout>
  );
}
