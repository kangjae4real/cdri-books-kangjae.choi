import { booksApi } from "@/api/books";
import { SearchBooksParams } from "@/types/api";
import { infiniteQueryOptions } from "@tanstack/react-query";

export const booksQueries = {
  search: (params: Omit<SearchBooksParams, "page">) =>
    infiniteQueryOptions({
      queryKey: ["books", "search", params] as const,
      queryFn: ({ pageParam }) => booksApi.searchBooks({ ...params, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPage.meta.is_end) {
          return undefined;
        }

        return lastPageParam + 1;
      },
      enabled: !!params.query, // 검색어가 없으면 요청 보내지 않음
    }),
};
