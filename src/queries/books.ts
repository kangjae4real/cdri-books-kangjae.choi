import { booksApi } from "@/api/books";
import { SearchBooksParams } from "@/types/api";
import { queryOptions } from "@tanstack/react-query";

export const booksQueries = {
  search: (params: SearchBooksParams) =>
    queryOptions({
      queryKey: ["books", "search", params] as const,
      queryFn: () => booksApi.searchBooks(params),
      enabled: !!params.query, // 검색어가 없으면 요청 보내지 않음
    }),
};
