import { UseSearch } from "@/types/search";
import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "./utils";
import { fetcher } from "./fetcher";

export function useSearch(urlApi = "/api/search"): UseSearch {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 200);

  const query: UseSearch["query"] = useSWR(
    [urlApi, debouncedValue],
    (args) => fetcher(...args),
    {
      keepPreviousData: true,
    }
  );

  return { search, setSearch, query };
}
