import { type ClassValue, clsx } from "clsx";
import {
  LayoutIcon,
  LibraryIcon,
  PaperclipIcon,
  type LucideIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useDebounce<T>(value: T, delayMs = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
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

export function useMode(): string | undefined {
  const { slug } = useParams();
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}
