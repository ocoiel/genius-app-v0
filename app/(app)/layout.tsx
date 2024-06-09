import { SiteHeader } from "@/components/header";
import { Nav } from "@/components/header/test-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      {/* <SiteHeader /> */}
      <Nav
        title="Meaning"
        enableSearch
        items={[
          {
            type: "main",
            url: "/",
            text: "Home",
          },
          {
            type: "main",
            url: "/about",
            text: "About",
          },
          {
            type: "main",
            url: "/contact",
            text: "Contact",
          },
        ]}
      />
      <main className="flex-1">{children}</main>
    </>
  );
}
