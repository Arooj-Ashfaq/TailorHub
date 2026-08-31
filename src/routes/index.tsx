import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Scissors, Sparkles, Ruler, Package, Star, Quote } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import hero from "@/assets/hero.jpg";
import serviceSuit from "@/assets/service-suit.jpg";
import serviceWedding from "@/assets/service-wedding.jpg";
import serviceShirt from "@/assets/service-shirt.jpg";
import fabrics from "@/assets/fabrics.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TailorHub — Bespoke Tailoring Atelier" },
      {
        name: "description",
        content:
          "Master tailors crafting bespoke suits, wedding wear and shirts with millimetre precision. Book a private fitting at TailorHub.",
      },
      { property: "og:title", content: "TailorHub — Bespoke Tailoring Atelier" },
      {
        property: "og:description",
        content: "Bespoke suits and wedding wear, hand-finished by master tailors.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <WhyUs />
        <HowItWorks />
        <Stats />
        <Portfolio />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <img
        src={hero}
        alt="Master tailor stitching a bespoke navy jacket"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-24">
        <div className="max-w-2xl animate-float-up">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs uppercase tracking-[0.35em] text-gold">
              Since 1998 · Est. Atelier
            </span>
          </div>
          <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
            The art of the <br />
            <span className="text-gradient-gold italic">perfectly fitted</span> suit.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Hand-drafted patterns, cloth chosen thread by thread, and a fit
            calibrated to the millimetre. Bespoke tailoring as it was meant to
            be.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-[0_0_40px_-5px_var(--gold)]"
            >
              Book Appointment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-gold/10"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground md:flex">
        <span>Scroll</span>
        <span className="h-8 w-px animate-pulse bg-gold" />
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Loro Piana", "Ermenegildo Zegna", "Scabal", "Holland & Sherry", "Dormeuil", "Vitale Barberis"];
  return (
    <div className="border-y border-border/40 bg-ink py-6 overflow-hidden">
      <div className="flex items-center justify-around gap-12 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {items.map((i) => (
          <span key={i} className="whitespace-nowrap">{i}</span>
        ))}
      </div>
    </div>
  );
}

const services = [
  { title: "Custom Suits", price: 899, days: "3–4 weeks", img: serviceSuit, desc: "Fully canvassed two- and three-piece suits, cut on your personal block." },
  { title: "Wedding Suits", price: 1499, days: "5–6 weeks", img: serviceWedding, desc: "Tuxedos and morning suits for the most photographed day of your life." },
  { title: "Shirts", price: 189, days: "2–3 weeks", img: serviceShirt, desc: "Bespoke shirting from Thomas Mason and Albini poplins & twills." },
];

function Services() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <SectionHeader
        eyebrow="Featured Services"
        title={<>Bespoke, from <em className="text-gradient-gold not-italic">first draft</em> to final stitch</>}
        description="Every garment is drafted from scratch on paper, cut by hand, and finished across up to 60 hours of atelier work."
      />
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {services.map((s) => (
          <article key={s.title} className="hover-lift group overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border border-gold/40 bg-background/70 px-3 py-1 text-xs uppercase tracking-widest text-gold backdrop-blur">
                {s.days}
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  From <span className="ml-1 text-gold">${s.price}</span>
                </span>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1 text-sm text-foreground hover:text-gold"
                >
                  Book <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Scissors, title: "Master Tailors", desc: "Over 200 combined years of Savile-Row-trained craft in a single atelier." },
    { icon: Ruler, title: "22-point Measurement", desc: "A truly personal block, kept on file for a lifetime of perfect fits." },
    { icon: Award, title: "Certified Cloths", desc: "Only the finest Super 120s–180s from Italy's oldest cloth mills." },
    { icon: Sparkles, title: "Hand-finished", desc: "Milanese buttonholes, pick-stitched lapels, functional cuffs—always." },
  ];
  return (
    <section className="border-y border-border/40 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <SectionHeader eyebrow="Why Choose Us" title="Craft you can feel in the seams" />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel rounded-2xl p-8 hover-lift">
              <Icon className="h-8 w-8 text-gold" strokeWidth={1.4} />
              <h3 className="mt-6 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Consultation", desc: "A private session with your tailor to discuss cut, cloth and occasion." },
    { n: "02", title: "Measurement", desc: "22 measurements, taken with a personal block filed under your name." },
    { n: "03", title: "Craftsmanship", desc: "Your pattern is cut by hand and stitched over 40–60 atelier hours." },
    { n: "04", title: "Final Fitting", desc: "Nip, tuck and hand-finish until every line falls exactly right." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <SectionHeader eyebrow="How It Works" title="Four appointments. One perfect garment." />
      <ol className="mt-16 grid gap-8 md:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="relative">
            <div className="text-gradient-gold font-display text-5xl">{s.n}</div>
            <div className="mt-4 h-px w-12 bg-gold" />
            <h3 className="mt-4 font-display text-xl">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "27+", l: "Years of craft" },
    { v: "12k", l: "Suits delivered" },
    { v: "98%", l: "Return clients" },
    { v: "42", l: "Master tailors" },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border/40">
      <img src={fabrics} alt="Luxury fabrics" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-background/60" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-24 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-gradient-gold font-display text-5xl md:text-6xl">{s.v}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Portfolio() {
  const imgs = [serviceSuit, serviceWedding, serviceShirt, serviceSuit, serviceWedding, serviceShirt];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <SectionHeader eyebrow="Latest Designs" title="Recent work from the atelier" />
      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
        {imgs.map((src, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl ${i % 5 === 0 ? "md:row-span-2 aspect-[3/5]" : "aspect-[4/5]"}`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-5 translate-y-2 text-sm text-gold opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              View piece →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { name: "James Whitcomb", role: "CEO, Whitcomb & Sons", quote: "The finest suit I have ever owned—cut, cloth and finish are peerless." },
    { name: "Adaeze Okonkwo", role: "Fashion Editor", quote: "TailorHub understand proportion the way great architects understand light." },
    { name: "Marco Bellini", role: "Groom, June '24", quote: "They made me feel like a film star on the most important day of my life." },
  ];
  return (
    <section className="border-y border-border/40 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <SectionHeader eyebrow="Testimonials" title="What our clients wear home" />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {t.map((r) => (
            <figure key={r.name} className="glass-panel rounded-2xl p-8">
              <Quote className="h-6 w-6 text-gold" />
              <blockquote className="mt-4 font-display text-xl leading-snug">
                “{r.quote}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <figcaption className="mt-4">
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-card to-ink p-12 md:p-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Package className="h-8 w-8 text-gold" strokeWidth={1.2} />
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
              Ready for a suit that <em className="text-gradient-gold not-italic">fits like nothing else?</em>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Book a private fitting at our atelier, or invite our master tailor to your home or office.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Link to="/services" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:shadow-[0_0_40px_-5px_var(--gold)] transition-all">
              Book Appointment
            </Link>
            <Link to="/contact" className="rounded-full border border-gold/40 px-7 py-3.5 text-sm hover:bg-gold/10">
              Talk to a tailor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
