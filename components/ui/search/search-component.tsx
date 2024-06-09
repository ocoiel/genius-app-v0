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

interface SearchDialogProps
  extends SharedProps,
    Omit<SearchContentProps, "defaultItems"> {
  footer?: ReactNode;
}

interface SearchContentProps {
  search: string;
  onSearchChange: (v: string) => void;
  results: SortedResult[] | "empty";
  defaultItems?: SortedResult[];
}

export function SearchDialog({
  open,
  onOpenChange,
  footer,
  links = [],
  ...props
}: SearchDialogProps): React.ReactElement {
  const defaultItems = useMemo(
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
      <Search defaultItems={defaultItems} {...props} />
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
}: SearchContentProps): React.ReactElement {
  const router = useRouter();
  const { setOpenSearch } = useSearchContext();
  const sidebar = useSidebar();

  const items = results === "empty" ? defaultItems : results;
  const hideList = results === "empty" && defaultItems.length === 0;

  const onOpen = (url: string): void => {
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
          {items.map((item) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={() => {
                onOpen(item.url);
              }}
              icon={item.title ? <Music /> : <User />}
              // Agrupar musicas por artista (ta errado ainda.. vou consertar)
              nested={
                item.title
                  ? item.band.toLowerCase().includes(search.toLowerCase())
                  : false
              }
            >
              <div className="flex p-2 gap-2 items-center">
                <Avatar>
                  <AvatarFallback>{item.band[0]}</AvatarFallback>
                  <AvatarImage
                    src={`https://www.vagalume.com.br/${item.band.toLocaleLowerCase()}/images/${item.band.toLocaleLowerCase()}.jpg`}
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
