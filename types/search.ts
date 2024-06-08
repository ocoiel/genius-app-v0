import { type SWRResponse } from "swr";

export interface SortedResult {
  id: string;
  url: string;
  type: "page" | "heading" | "text";
  content: string;
}

export interface UseSearch {
  search: string;
  setSearch: (v: string) => void;
  query: SWRResponse<
    SortedResult[] | "empty",
    Error,
    { keepPreviousData: true }
  >;
}
