import { NavProps } from "@/components/header/test-nav";
import { Icons } from "@/components/icons";
import { ReactElement, ReactNode } from "react";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export type Node = Item | Separator | Folder;

export interface Item {
  type: "page";
  name: string;
  url: string;
  external?: boolean;
  icon?: ReactElement;
}

export interface Separator {
  type: "separator";
  name: string;
}

export interface Folder {
  /**
   * Optional id to be attached to folders
   */
  id?: string;

  type: "folder";
  name: string;
  root?: boolean;
  defaultOpen?: boolean;
  index?: Item;
  icon?: ReactElement;
  children: Node[];
}

type ActiveType = "none" | "url" | "nested-url";

export type LinkItemType =
  | {
      type?: "main";
      url: string;
      /**
       * When the item is marked as active
       *
       * @defaultValue 'url'
       */
      active?: ActiveType;
      icon?: ReactNode;
      text: string;
      external?: boolean;
    }
  | {
      type: "menu";
      icon?: ReactNode;
      text: string;
      items: LinkItemType[];
    }
  | {
      type: "secondary";
      url: string;
      /**
       * When the item is marked as active
       *
       * @defaultValue 'url'
       */
      active?: ActiveType;
      icon: ReactNode;
      text: string;
      external?: boolean;
    };

interface NavOptions extends Omit<NavProps, "items"> {
  enabled: boolean;
  component: ReactNode;
}

export interface BaseLayoutProps {
  /**
   * GitHub url
   */
  githubUrl?: string;

  links?: LinkItemType[];
  /**
   * Replace or disable navbar
   */
  nav?: Partial<NavOptions>;

  children?: ReactNode;
}
