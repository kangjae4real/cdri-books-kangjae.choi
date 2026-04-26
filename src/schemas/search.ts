import { z } from "zod";

export const searchFormSchema = z.object({
  keyword: z.string().trim().min(1, "검색어를 입력해주세요"),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
