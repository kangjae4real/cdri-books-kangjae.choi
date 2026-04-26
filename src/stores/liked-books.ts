"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Document } from "@/types/api";

type LikedBooksState = {
  books: Document[];
  add: (book: Document) => void;
  remove: (isbn: string) => void;
};

export const useLikedBooksStore = create<LikedBooksState>()(
  persist(
    (set) => ({
      books: [],
      add: (book) =>
        set((state) => ({
          books: [book, ...state.books.filter((b) => b.isbn !== book.isbn)],
        })),
      remove: (isbn) =>
        set((state) => ({
          books: state.books.filter((b) => b.isbn !== isbn),
        })),
    }),
    { name: "liked-books" },
  ),
);
