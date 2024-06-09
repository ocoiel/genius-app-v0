import { type ClassValue, clsx } from "clsx";
import {
  LayoutIcon,
  LibraryIcon,
  PaperclipIcon,
  type LucideIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Node } from "@/types/nav";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActive(
  url: string,
  pathname: string,
  nested = true
): boolean {
  return url === pathname || (nested && pathname.startsWith(`${url}/`));
}

export function replaceOrDefault(
  obj:
    | {
        enabled?: boolean;
        component?: ReactNode;
      }
    | undefined,
  def: ReactNode
): ReactNode {
  if (obj?.enabled === false) return;
  if (obj?.component !== undefined) return obj.component;

  return def;
}

export function hasActive(items: Node[], url: string): boolean {
  return items.some((item) => {
    if (item.type === "page") {
      return item.url === url;
    }

    if (item.type === "folder")
      return item.index?.url === url || hasActive(item.children, url);

    return false;
  });
}

export interface Mode {
  param: string;
  name: string;
  package: string;
  description: string;
  version: string;
  icon: LucideIcon;
}

export const modes: Mode[] = [
  {
    param: "music",
    name: "Música",
    package: "fumadocs-core",
    description: "Musica",
    version: "1",
    icon: LibraryIcon,
  },
  {
    param: "artist",
    name: "Artista",
    package: "fumadocs-ui",
    description: "Artista",
    version: "1",
    icon: LayoutIcon,
  },
  {
    param: "album",
    name: "Álbum",
    package: "fumadocs-mdx",
    description: "Álbum",
    version: "1",
    icon: PaperclipIcon,
  },
];
