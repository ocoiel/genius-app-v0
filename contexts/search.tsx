import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  SearchLink,
  SharedProps,
} from "@/components/ui/search/search-component";

interface HotKey {
  display: React.ReactNode;
  key: string | ((e: KeyboardEvent) => boolean);
}

export interface SearchProviderProps {
  preload?: boolean;
  links?: SearchLink[];
  hotKey?: HotKey[];
  options?: Partial<SharedProps>;
  children?: React.ReactNode;
  /**
   * Replace default search dialog, allowing you to use other solutions such as Algolia Search
   *
   * It receives the `open` and `onOpenChange` prop, can be lazy loaded with `next/dynamic`
   */
  SearchDialog: React.ComponentType<SharedProps>;
}

interface SearchContextType {
  enabled: boolean;
  hotKey: HotKey[];
  setOpenSearch: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextType>({
  enabled: false,
  hotKey: [],
  setOpenSearch: () => undefined,
});

export function useSearchContext(): SearchContextType {
  return useContext(SearchContext);
}

export function SearchProvider({
  SearchDialog,
  children,
  preload = true,
  options,
  hotKey = [
    {
      key: "k",
      display: "K",
    },
    {
      key: (e) => e.metaKey || e.ctrlKey,
      display: "⌘",
    },
  ],
  links,
}: SearchProviderProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(preload ? false : undefined);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (
        hotKey.every((v) =>
          typeof v.key === "string" ? e.key === v.key : v.key(e)
        )
      ) {
        setIsOpen(true);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [hotKey]);

  return (
    <SearchContext.Provider
      value={useMemo(
        () => ({ enabled: true, hotKey, setOpenSearch: setIsOpen }),
        [hotKey]
      )}
    >
      {isOpen !== undefined && (
        <SearchDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          links={links}
          {...options}
        />
      )}
      {children}
    </SearchContext.Provider>
  );
}
