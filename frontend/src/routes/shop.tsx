import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { resolveImage } from "@/lib/product-images";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — TailorHub" },
      { name: "description", content: "Fabrics, ready-made garments and accessories curated by TailorHub." },
      { property: "og:title", content: "Shop — TailorHub" },
      { property: "og:description", content: "Ready-to-wear and accessories from the TailorHub atelier." },
    ],
  }),
  component: ShopPage,
});

const categories = ["All", "Fabrics", "Ready-made", "Accessories", "Cufflinks", "Belts", "Shoes"];

function ShopPage() {
  const [cat, setCat] = useState("All");
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const list = cat === "All" ? products : products.filter((p) => p.category === cat);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader eyebrow="Shop" title={<>The <em className="text-gradient-gold not-italic">TailorHub</em> shop</>} description="Cloth, ready-to-wear and finishing touches, curated by our head tailors." />
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                  cat === c
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 pb-28">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl border border-border/60 bg-card" />
              ))}
            </div>
          )}
          {isError && (
            <p className="text-center text-sm text-muted-foreground">
              Couldn't load the shop right now — make sure the backend is running on port 4000.
            </p>
          )}
          {!isLoading && !isError && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((p) => (
                <article key={p.id} className="hover-lift group overflow-hidden rounded-2xl border border-border/60 bg-card">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={resolveImage(p.image)} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button aria-label="Wishlist" className="absolute right-3 top-3 rounded-full bg-background/70 p-2 backdrop-blur hover:text-gold">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{p.category}</div>
                    <h3 className="mt-2 font-display text-lg leading-tight">{p.name}</h3>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-gold text-gold" /> {p.rating}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-xl text-gold">${p.price}</span>
                      <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
                        <ShoppingBag className="h-3.5 w-3.5" /> Add
                      </button>
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
