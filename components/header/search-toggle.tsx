import { ButtonHTMLAttributes, useCallback } from "react";
import { SearchIcon } from "lucide-react";
import { useSearchContext } from "@/contexts/search";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function SearchToggle(
  props: ButtonHTMLAttributes<HTMLButtonElement>
): React.ReactElement {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          size: "icon",
          variant: "ghost",
          className: props.className,
        })
      )}
      aria-label="Open Search"
      onClick={useCallback(() => {
        setOpenSearch(true);
      }, [setOpenSearch])}
    >
      <SearchIcon />
    </button>
  );
}

export function LargeSearchToggle(
  props: ButtonHTMLAttributes<HTMLButtonElement>
): React.ReactElement {
  const { hotKey, setOpenSearch } = useSearchContext();

  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-secondary/50 p-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        props.className
      )}
      onClick={useCallback(() => {
        setOpenSearch(true);
      }, [setOpenSearch])}
    >
      <SearchIcon className="ms-1 size-4" />
      Busca
      <div className="ms-auto inline-flex gap-0.5 text-xs">
        {hotKey.map((k, i) => (
          <kbd key={i} className="rounded-md border bg-background px-1.5">
            {k.display}
          </kbd>
        ))}
      </div>
    </button>
  );
}
