import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/api";
import { resolveImage } from "@/lib/product-images";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — TailorHub Bespoke Atelier" },
      {
        name: "description",
        content:
          "Custom suits, wedding wear, shirts, sherwani, alterations and more from TailorHub's master tailors.",
      },
      { property: "og:title", content: "TailorHub Services" },
      {
        property: "og:description",
        content: "Bespoke tailoring services with hand-finished detail and Italian cloth.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["services"], queryFn: getServices });

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader
            eyebrow="Services"
            title={
              <>
                The complete <em className="text-gradient-gold not-italic">atelier</em>
              </>
            }
            description="From a first bespoke suit to a full wedding party, every service is delivered with the same obsessive standard."
          />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28">
          {isLoading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl border border-border/60 bg-card"
                />
              ))}
            </div>
          )}
          {isError && (
            <p className="text-center text-sm text-muted-foreground">
              Couldn't load services right now — make sure the backend is running on port 4000.
            </p>
          )}
          {!isLoading && !isError && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article
                  key={s.id}
                  className="hover-lift group overflow-hidden rounded-2xl border border-border/60 bg-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={resolveImage(s.image)}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-2xl">{s.title}</h3>
                      <span className="shrink-0 rounded-full border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                        {s.duration}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {s.price ? (
                          <>
                            From <span className="text-gold">${s.price}</span>
                          </>
                        ) : (
                          "By consultation"
                        )}
                      </span>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1 text-sm hover:text-gold"
                      >
                        Book <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
