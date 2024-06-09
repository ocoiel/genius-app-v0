import { UseSearch } from "@/types/search";
import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "@/utils/use-debounce";
import { fetcher } from "./fetcher";

export function useSearch(
  urlApi = "https://suggest.vagalume.com.br/json"
): UseSearch {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 400);

  const query: UseSearch["query"] = useSWR(
    [urlApi, debouncedValue],
    (args) => fetcher(...args),
    {
      keepPreviousData: true,
    }
  );

  const { docs: queryResult } = query.data?.response ?? {};

  return { search, setSearch, query, queryResult };
}
