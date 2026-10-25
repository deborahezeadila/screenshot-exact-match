import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useContact } from "./contact-context";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/shopify-services", label: "Shopify Services" },
  { to: "/other-services", label: "Other Services" },
  { to: "/process", label: "My Process" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About Me" },
  { to: "/blog", label: "Blog" },
  { to: "/faqs", label: "FAQs" },
  { to: "/email-updates", label: "Email Updates" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { open: openContact } = useContact();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-petal/90 backdrop-blur">
      <div className="container-site flex h-18 items-center justify-between gap-3 py-3">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Search services">
            <Link to="/shopify-services"><Search /></Link>
          </Button>
          <Button variant="cta" className="hidden sm:inline-flex" onClick={openContact}>Contact Me</Button>
          <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="!size-6" />
          </Button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[86vw] max-w-sm border-l-0 bg-oxblood p-0 text-petal">
          <SheetTitle className="sr-only">Site menu</SheetTitle>
          <SheetDescription className="sr-only">Navigate the website</SheetDescription>
          <nav className="flex h-full flex-col px-8 pb-8 pt-16">
            <ul className="space-y-1">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-display text-2xl text-petal/85 transition-colors hover:text-blush"
                    activeProps={{ className: "!text-blush" }}
                    activeOptions={{ exact: n.to === "/" }}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button variant="light" size="lg" className="mt-auto" onClick={() => { setOpen(false); openContact(); }}>
              Contact Me
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
