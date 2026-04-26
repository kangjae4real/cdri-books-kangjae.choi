import kakaoRestApiInstance from "./instance";
import { SearchBooksResponse, SearchBooksParams } from "@/types/api";

const API_PATH = "search/book";

const DEFAULT_SEARCH_BOOKS_PARAMS = {
  sort: "accuracy",
  page: 1,
  size: 10,
  target: "title",
} as const;

export const booksApi = {
  searchBooks: async (params: SearchBooksParams): Promise<SearchBooksResponse> => {
    const { data } = await kakaoRestApiInstance.get<SearchBooksResponse>(API_PATH, {
      params: {
        ...DEFAULT_SEARCH_BOOKS_PARAMS,
        ...params,
      },
    });

    return data;
  },
};
