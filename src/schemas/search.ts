import { z } from "zod";

export const searchTargetEnum = z.enum(["title", "person", "publisher"]);
export type SearchTarget = z.infer<typeof searchTargetEnum>;

export const searchFormSchema = z.object({
  keyword: z.string().trim().min(1, "검색어를 입력해주세요"),
  detail: z.object({
    target: searchTargetEnum,
    keyword: z.string().trim().min(1, "검색어를 입력해주세요"),
  }),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export type SearchSubmitValue = {
  query: string;
  target?: SearchTarget;
};
