import { type SWRResponse } from "swr";

export interface SortedResult {
  band: string;
  id: string;
  url: string;
  title?: string;
  langID?: number;
  fmRadios?: string[];
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
