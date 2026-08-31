import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import serviceSuit from "@/assets/service-suit.jpg";
import serviceWedding from "@/assets/service-wedding.jpg";
import serviceShirt from "@/assets/service-shirt.jpg";
import fabrics from "@/assets/fabrics.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — TailorHub Bespoke Atelier" },
      { name: "description", content: "Custom suits, wedding wear, shirts, sherwani, alterations and more from TailorHub's master tailors." },
      { property: "og:title", content: "TailorHub Services" },
      { property: "og:description", content: "Bespoke tailoring services with hand-finished detail and Italian cloth." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { title: "Custom Suits", price: 899, days: "3–4 weeks", img: serviceSuit, desc: "Fully canvassed, hand-cut two and three-piece suits." },
  { title: "Wedding Suits", price: 1499, days: "5–6 weeks", img: serviceWedding, desc: "Tuxedos, morning coats and groom parties." },
  { title: "Shirts", price: 189, days: "2 weeks", img: serviceShirt, desc: "Thomas Mason & Albini poplins, twills and Oxfords." },
  { title: "Tailored Pants", price: 249, days: "2 weeks", img: serviceSuit, desc: "Flat-front and pleated trousers, hemmed to the millimetre." },
  { title: "Sherwani", price: 1299, days: "5 weeks", img: serviceWedding, desc: "Hand-embroidered wedding sherwanis in silk and velvet." },
  { title: "Waistcoats", price: 349, days: "2–3 weeks", img: serviceSuit, desc: "Odd waistcoats to sharpen any two-piece." },
  { title: "Alterations", price: 39, days: "3–7 days", img: serviceShirt, desc: "Precision alterations by senior tailors only." },
  { title: "Uniform Stitching", price: 129, days: "4 weeks", img: serviceShirt, desc: "Bulk corporate and hospitality uniforms." },
  { title: "Women's Dresses", price: 599, days: "4 weeks", img: serviceWedding, desc: "Made-to-measure occasion and evening wear." },
  { title: "Kids Clothing", price: 149, days: "2 weeks", img: serviceShirt, desc: "Little suits and party pieces, built to be handed down." },
  { title: "Premium Fabric Selection", price: 0, days: "in-store", img: fabrics, desc: "Explore 800+ mill cloths from Italy and the UK." },
  { title: "Express Delivery", price: 199, days: "10 days", img: serviceSuit, desc: "Fast-tracked craft for last-minute occasions." },
];

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader
            eyebrow="Services"
            title={<>The complete <em className="text-gradient-gold not-italic">atelier</em></>}
            description="From a first bespoke suit to a full wedding party, every service is delivered with the same obsessive standard."
          />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article key={s.title} className="hover-lift group overflow-hidden rounded-2xl border border-border/60 bg-card">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl">{s.title}</h3>
                    <span className="shrink-0 rounded-full border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">{s.days}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {s.price ? <>From <span className="text-gold">${s.price}</span></> : "By consultation"}
                    </span>
                    <Link to="/contact" className="inline-flex items-center gap-1 text-sm hover:text-gold">
                      Book <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
