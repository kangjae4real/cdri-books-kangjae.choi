"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "search-history";
const MAX_HISTORY_SIZE = 8;

const readHistory = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter((keyword) => typeof keyword === "string") : [];
  } catch {
    return [];
  }
};

const writeHistory = (history: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const useSearchHistory = () => {
  // lazy initializer, 첫 렌더링에만 한 번만 호출되도록 함수 자체를 제공합니다.
  // 아래 표현식에서 함수 호출이 일어나게 되면, 매번 렌더링마다 함수를 호출하게 되므로, 성능상 유리하지 않습니다.
  // local storage를 읽는 행위는 기회비용이 비싸 아래와 같이 작성했습니다.
  const [history, setHistory] = useState<string[]>(readHistory);

  const add = useCallback((keyword: string) => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      return;
    }

    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((v) => v !== trimmed)].slice(0, MAX_HISTORY_SIZE);
      writeHistory(next);
      return next;
    });
  }, []);

  const remove = useCallback((keyword: string) => {
    setHistory((prev) => {
      const next = prev.filter((history) => history !== keyword);
      writeHistory(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    writeHistory([]);
  }, []);

  return { history, add, remove, clear };
};
