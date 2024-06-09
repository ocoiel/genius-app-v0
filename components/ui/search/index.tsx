"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SearchDialog, type SharedProps } from "./search-component";
import { useSearch } from "@/lib/client-search";
import { modes, cn } from "@/lib/utils";
import { useMode } from "@/utils/use-mode";
import { cva } from "class-variance-authority";
import { url } from "inspector";

export interface DefaultSearchDialogProps extends SharedProps {
  api?: string;
  footer?: ReactNode;
}

const itemVariants = cva(
  "rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors",
  {
    variants: {
      active: {
        true: "bg-accent text-accent-foreground",
      },
    },
  }
);

export default function DefaultSearchDialog({
  api,
  footer,
  ...props
}: DefaultSearchDialogProps): React.ReactElement {
  const { search, setSearch, queryResult } = useSearch(api);
  console.log("🚀 ~ queryResult:", queryResult);

  const defaultTag = useMode() ?? "music";
  const [tag, setTag] = useState(defaultTag);

  useEffect(() => {
    setTag(defaultTag);
  }, [defaultTag]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      defaultItems={[
        { band: "Belchior", id: "belchior", url: "/belchior" },
        {
          band: "Chico Buarque",
          id: "chico-buarque",
          url: "/chico-buarque",
        },
        {
          band: "Caetano Veloso",
          id: "caetano-veloso",
          url: "/caetano-veloso",
        },
        {
          band: "Gilberto Gil",
          id: "gilberto-gil",
          url: "/gilberto-gil",
        },
        {
          band: "Jorge Ben Jor",
          id: "jorge-ben-jor",
          url: "/jorge-ben-jor",
        },
        {
          band: "Tim Maia",
          id: "tim-maia",
          url: "/tim-maia",
          title: "Do leme ao pontal",
        },
        {
          band: "Raul Seixas",
          id: "raul-seixas",
          url: "/raul-seixas",
        },
        {
          band: "Novos Baianos",
          id: "novos-baianos",
          url: "/novos-baianos",
        },
        {
          band: "Os Mutantes",
          id: "os-mutantes",
          url: "/os-mutantes",
        },
        {
          band: "Secos & Molhados",
          id: "secos-e-molhados",
          url: "/secos-e-molhados",
        },
      ]}
      results={queryResult ?? []}
      footer={
        <div className="flex flex-row items-center gap-1">
          {modes.map((mode) => (
            <button
              key={mode.param}
              className={cn(itemVariants({ active: tag === mode.param }))}
              onClick={() => {
                setTag(mode.param);
              }}
              type="button"
              tabIndex={-1}
            >
              {mode.name}
            </button>
          ))}
          <a
            href="https://read.cv/gabrielc"
            rel="noreferrer noopener"
            className="ml-auto text-xs text-muted-foreground"
          >
            Feito com ❤️ por Gabriel
          </a>
        </div>
      }
      {...props}
    />
  );
}
