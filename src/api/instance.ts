import axios from "axios";
import { env } from "@/env";
import { buildURL } from "@/utils/string";

const kakaoRestApiInstance = axios.create({
  baseURL: buildURL(env.NEXT_PUBLIC_KAKAO_REST_API_URL, env.NEXT_PUBLIC_KAKAO_REST_API_VERSION),
  headers: {
    Authorization: `KakaoAK ${env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
  },
});

export default kakaoRestApiInstance;
