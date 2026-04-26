export const ROOT_PAGE = "/"; // 도서 검색 페이지
export const LIKE_PAGE = `/like`;

export const pages = [ROOT_PAGE, LIKE_PAGE] as const;
export type Pages = (typeof pages)[number];

export const PAGE_MAP: Record<Pages, string> = {
  "/": "도서 검색",
  "/like": "내가 찜한 책",
};
