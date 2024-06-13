import { FileTextIcon, HashIcon, Music, TextIcon, User } from "lucide-react";
import type { SortedResult } from "@/types/search";
import { useRouter } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSearchContext } from "@/contexts/search";
import { useSidebar } from "@/contexts/sidebar";
import { Avatar, AvatarFallback } from "../avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export type SearchLink = [name: string, href: string];

export interface SharedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links?: SearchLink[];
}

interface SearchDialogProps extends SharedProps, SearchContentProps {
  footer?: ReactNode;
  tag?: "music" | "artist" | "album";
}

interface SearchContentProps {
  search: string;
  onSearchChange: (v: string) => void;
  results: SortedResult[];
  defaultItems?: SortedResult[];
  tag?: "music" | "artist" | "album";
}

export function SearchDialog({
  open,
  onOpenChange,
  footer,
  defaultItems,
  links = [],
  ...props
}: SearchDialogProps): React.ReactElement {
  const remapDefaultItems = useMemo(
    () =>
      links.map<SortedResult>(([name, link]) => ({
        id: link,
        band: name,
        url: link,
      })),
    [links]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} footer={footer}>
      <Search defaultItems={defaultItems ?? remapDefaultItems} {...props} />
    </CommandDialog>
  );
}

const icons = {
  text: <TextIcon />,
  heading: <HashIcon />,
  page: <FileTextIcon />,
};

function Search({
  search,
  onSearchChange,
  defaultItems = [],
  results,
  tag,
}: SearchContentProps): React.ReactElement {
  console.log("🚀 ~ results:", results);
  const router = useRouter();
  const { setOpenSearch } = useSearchContext();
  const sidebar = useSidebar();

  const items = !results.length ? defaultItems : results;

  // If tag is music, filter items that only start with "l" (lyrics)
  // If tag is artist, filter items that only start with "b" (band)
  // If tag is album, filter items that only start with "a" (album)
  const itemsFilteredByTag = items.filter((item) => {
    if (tag === "music") {
      return item.id?.toLowerCase().startsWith("l");
    } else if (tag === "artist") {
      return item.id.toLowerCase().startsWith("b");
    } else if (tag === "album") {
      return item.id.toLowerCase().startsWith("a");
    }
  });

  const hideList = results.length === 0 && defaultItems?.length === 0;

  const onOpen = (url: string, id?: string): void => {
    if (url.endsWith(".html")) {
      url = url.replace(".html", "");
    }
    if (id) {
      url = `${url}-${id}`;
    }

    router.push(url);
    setOpenSearch(false);

    if (location.pathname === url.split("#")[0]) {
      sidebar.setOpen(false);
    } else {
      sidebar.closeOnRedirect.current = true;
    }
  };

  return (
    <>
      <CommandInput
        value={search}
        onValueChange={onSearchChange}
        placeholder={"Músicas, artistas, álbuns..."}
      />
      <CommandList className={cn(hideList && "hidden")}>
        <CommandEmpty>
          🧐 Ops, nenhum resultado encontrado... Que tal procurar por outra
          coisa?
        </CommandEmpty>

        <CommandGroup value="result">
          {itemsFilteredByTag.map((item) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={() => {
                onOpen(item.url, item.id);
              }}
              icon={item.title ? <Music /> : <User />}
            >
              <div className="flex p-2 gap-2 items-center">
                <Avatar>
                  <AvatarFallback>{item.band[0]}</AvatarFallback>
                  {/* Remove slash in item.url */}
                  <AvatarImage
                    src={`https://www.vagalume.com.br/${item.url.replace(
                      /\//g,
                      ""
                    )}/images/${item.url.replace(/\//g, "")}.jpg`}
                    alt={item.band}
                  />
                </Avatar>
                {item.title ? `${item.title} -` : null} {item.band}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </>
  );
}
