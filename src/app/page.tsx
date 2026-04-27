"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { booksQueries } from "@/queries/books";
import PageLayout from "@/components/layouts/page-layout";
import SearchForm from "@/components/search-form";
import List from "@/components/list";
import BookListItem from "@/components/book-list-item";
import { Text } from "@/components/typography";
import { SearchSubmitValue } from "@/schemas/search";

export default function IndexPage() {
  const [params, setParams] = useState<SearchSubmitValue>({ query: "" });
  const { data, isFetching } = useQuery(booksQueries.search(params));

  const documents = useMemo(() => {
    if (!data?.documents) {
      return [];
    }

    return data.documents;
  }, [data]);

  const isEmpty = useMemo(() => {
    return !!params.query && !isFetching && !documents.length;
  }, [params.query, isFetching, documents]);

  return (
    <PageLayout>
      <div className="flex w-full flex-col gap-8">
        <SearchForm title="도서 검색" onSearch={setParams} />

        {isEmpty ? (
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
