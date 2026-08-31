import { Link } from "@tanstack/react-router";
import { Scissors, Instagram, Twitter, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-gold" />
              <span className="font-display text-xl">
                Tailor<span className="text-gradient-gold">Hub</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Bespoke tailoring, crafted with obsessive precision since 1998.
            </p>
            <div className="mt-6 flex gap-4">
              {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gold"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Atelier">
            <Link to="/services">Services</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">Our Story</Link>
          </FooterCol>
          <FooterCol title="Support">
            <Link to="/contact">Contact</Link>
            <a href="#">Measurement Guide</a>
            <a href="#">FAQ</a>
          </FooterCol>
          <FooterCol title="Newsletter">
            <p className="text-sm text-muted-foreground">
              Style notes & private previews, monthly.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="you@atelier.com"
                className="flex-1 rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-gold"
              />
              <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                Join
              </button>
            </form>
          </FooterCol>
        </div>

        <div className="gold-divider mt-14" />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TailorHub Atelier. Crafted in navy & gold.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">{title}</h4>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground [&_a:hover]:text-gold [&_a]:transition-colors">
        {children}
      </div>
    </div>
  );
}
