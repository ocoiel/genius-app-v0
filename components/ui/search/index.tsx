"use client";

import { type ReactNode } from "react";
import { SearchDialog, type SharedProps } from "./search-component";
import { useSearch } from "@/lib/client-search";

export interface DefaultSearchDialogProps extends SharedProps {
  api?: string;
  footer?: ReactNode;
}

export default function DefaultSearchDialog({
  api,
  ...props
}: DefaultSearchDialogProps): React.ReactElement {
  const { search, setSearch, query } = useSearch(api);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      results={query.data ?? []}
      {...props}
    />
  );
}
