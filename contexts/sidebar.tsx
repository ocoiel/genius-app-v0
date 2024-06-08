import {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  type MutableRefObject,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider as BaseProvider } from "@/components/sidebar";

interface SidebarContext {
  open: boolean;
  setOpen: (v: boolean) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  /**
   * When set to true, close the sidebar on redirection
   */
  closeOnRedirect: MutableRefObject<boolean>;
}

const SidebarContext = createContext<SidebarContext | undefined>(undefined);

export function useSidebar(): SidebarContext {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("Missing root provider");
  return ctx;
}

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const closeOnRedirect = useRef(false);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (closeOnRedirect.current) {
      setOpen(false);
      closeOnRedirect.current = false;
    }
  }, [pathname]);

  return (
    <SidebarContext.Provider
      value={useMemo(
        () => ({
          open,
          setOpen,
          collapsed,
          setCollapsed,
          closeOnRedirect,
        }),
        [open, collapsed]
      )}
    >
      <BaseProvider open={open} onOpenChange={setOpen}>
        {children}
      </BaseProvider>
    </SidebarContext.Provider>
  );
}
