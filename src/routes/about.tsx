import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import hero from "@/assets/hero.jpg";
import fabrics from "@/assets/fabrics.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TailorHub Atelier" },
      { name: "description", content: "The story, craft and people behind TailorHub — a bespoke tailoring atelier established in 1998." },
      { property: "og:title", content: "About TailorHub" },
      { property: "og:description", content: "Meet the master tailors behind TailorHub." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const timeline = [
    { y: "1998", t: "Atelier founded on Elgin Street with three tailors." },
    { y: "2006", t: "First royal commission; move to flagship on the Row." },
    { y: "2014", t: "Women's bespoke line launches." },
    { y: "2020", t: "Digital measurement studio & remote fittings." },
    { y: "2026", t: "42 master tailors, 12,000 suits delivered." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader
            eyebrow="Our Story"
            title={<>Cut, cloth and <em className="text-gradient-gold not-italic">conviction</em> since 1998</>}
            description="TailorHub was built on a stubborn belief: that a garment cut for one person, by hand, will always outlive a garment cut for everyone."
          />
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 md:grid-cols-2 md:items-center">
          <img src={hero} alt="Atelier" loading="lazy" className="rounded-3xl object-cover aspect-[4/5]" />
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-3xl">Mission</h3>
              <p className="mt-2 text-muted-foreground">To make bespoke feel personal again — one client, one pattern, one perfect suit at a time.</p>
            </div>
            <div>
              <h3 className="font-display text-3xl">Vision</h3>
              <p className="mt-2 text-muted-foreground">A house where craft outlives trend, and every garment is a small argument for doing things properly.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-border/40 bg-ink">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <SectionHeader eyebrow="Timeline" title="Milestones" />
            <ol className="mx-auto mt-14 max-w-3xl space-y-8">
              {timeline.map((item) => (
                <li key={item.y} className="flex gap-6">
                  <div className="text-gradient-gold shrink-0 font-display text-3xl w-24">{item.y}</div>
                  <p className="text-muted-foreground pt-2">{item.t}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-28">
          <img src={fabrics} alt="Cloths" loading="lazy" className="rounded-3xl object-cover w-full aspect-[16/7]" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
