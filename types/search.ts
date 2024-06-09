import { type SWRResponse } from "swr";

export interface APIResponse {
  response: {
    numFound: number;
    start: number;
    docs: SortedResult[];
  };
}

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
  query: SWRResponse<APIResponse, Error, { keepPreviousData: true }>;
  queryResult?: SortedResult[];
}
