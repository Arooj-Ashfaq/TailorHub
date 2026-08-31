import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Scissors } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="glass-panel border-b border-t-0 border-l-0 border-r-0">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Scissors className="h-5 w-5 text-gold transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl tracking-wide">
              Tailor<span className="text-gradient-gold">Hub</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  activeProps={{ className: "text-gold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Link
              to="/services"
              className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:shadow-[0_0_30px_-5px_var(--gold)]"
            >
              Book Appointment
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden border-t border-border/40 bg-background/95 px-6 py-4">
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
