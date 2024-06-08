"use client";

import { cva } from "class-variance-authority";
import type { SharedProps } from "@/components/ui/search/search-component";
import SearchDialog from "@/components/ui/search";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { modes } from "@/lib/utils";
import { useMode } from "@/utils/use-mode";

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

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;

if (!appId || !apiKey) throw new Error("API Credentials");

export default function CustomSearchDialog(
  props: SharedProps
): React.ReactElement {
  const defaultTag = useMode() ?? "music";
  const [tag, setTag] = useState(defaultTag);

  useEffect(() => {
    setTag(defaultTag);
  }, [defaultTag]);

  return (
    <SearchDialog
      {...props}
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
            Search powered by Gabriel
          </a>
        </div>
      }
    />
  );
}
