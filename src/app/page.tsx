"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { booksQueries } from "@/queries/books";
import PageLayout from "@/components/layouts/page-layout";
import SearchForm from "@/components/search-form";
import List from "@/components/list";
import BookListItem from "@/components/book-list-item";
import { Text } from "@/components/typography";

export default function IndexPage() {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useQuery(booksQueries.search({ query }));

  const documents = data?.documents ?? [];
  const showEmptyState = !!query && !isFetching && documents.length === 0;

  return (
    <PageLayout>
      <div className="flex w-full flex-col gap-8">
        <SearchForm title="도서 검색" onSearch={setQuery} />

        {showEmptyState ? (
          <Text type="paragraph" className="text-sub-title py-12 text-center">
            검색 결과가 없습니다.
          </Text>
        ) : (
          <List items={documents} getKey={(book) => book.isbn} renderItem={(book) => <BookListItem book={book} />} />
        )}
      </div>
    </PageLayout>
  );
}
