export const ROOT_PAGE = "/"; // 도서 검색 페이지
export const LIKES_PAGE = `/likes`; // 내가 찜한 책 페이지

export const pages = [ROOT_PAGE, LIKES_PAGE] as const;
export type Pages = (typeof pages)[number];

export const PAGE_MAP: Record<Pages, string> = {
  "/": "도서 검색",
  "/likes": "내가 찜한 책",
};
