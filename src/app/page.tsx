"use client";

import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { booksQueries } from "@/queries/books";
import PageLayout from "@/components/layouts/page-layout";
import SearchForm from "@/components/search-form";
import List from "@/components/list";
import BookListItem from "@/components/book-list-item";
import { Text } from "@/components/typography";
import { SearchSubmitValue } from "@/schemas/search";

export default function IndexPage() {
  const [params, setParams] = useState<SearchSubmitValue>({ query: "" });
  const { data, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    booksQueries.search(params),
  );

  const documents = useMemo(() => {
    return data?.pages.flatMap((page) => page.documents) ?? [];
  }, [data]);

  const isEmpty = useMemo(() => {
    return !!params.query && !isFetching && !documents.length;
  }, [params.query, isFetching, documents]);

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

        {isEmpty ? (
          <Text type="paragraph" className="text-sub-title py-12 text-center">
            검색 결과가 없습니다.
          </Text>
        ) : (
          <List
            items={documents}
            getKey={(book) => book.isbn}
            renderItem={(book) => <BookListItem book={book} />}
            infinite
            loading={isFetchingNextPage}
            onEndReached={handleEndReached}
          />
        )}
      </div>
    </PageLayout>
  );
}
