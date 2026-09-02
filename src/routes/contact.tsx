import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { createAppointment } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TailorHub Atelier" },
      { name: "description", content: "Book a private fitting or reach the TailorHub atelier team." },
      { property: "og:title", content: "Contact TailorHub" },
      { property: "og:description", content: "Book a fitting or reach our master tailors." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Thank you — a tailor will be in touch shortly.");
      formRef.current?.reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      fittingType: String(formData.get("fittingType") || ""),
      notes: String(formData.get("notes") || ""),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader
            eyebrow="Contact"
            title={<>Book a <em className="text-gradient-gold not-italic">private fitting</em></>}
            description="Visit us at the atelier, request a home visit, or arrange a video consultation."
          />
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-28 md:grid-cols-5">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass-panel md:col-span-3 rounded-3xl p-8 md:p-10 space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" name="name" />
              <Field label="Email" name="email" type="email" />
            </div>
            <Field label="Phone" name="phone" />
            <div>
              <label htmlFor="fittingType" className="text-xs uppercase tracking-widest text-gold">Fitting type</label>
              <select id="fittingType" name="fittingType" className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold">
                <option>In-store visit</option>
                <option>Home visit</option>
                <option>Video consultation</option>
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="text-xs uppercase tracking-widest text-gold">Notes</label>
              <textarea id="notes" name="notes" rows={5} className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold" />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:shadow-[0_0_40px_-5px_var(--gold)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Sending…" : "Request Appointment"}
            </button>
          </form>

          <aside className="md:col-span-2 space-y-4">
            <Info icon={MapPin} title="Atelier" body="42 Elgin Street, Mayfair, London W1K" />
            <Info icon={Phone} title="Phone" body="+44 20 7946 0128" />
            <Info icon={Mail} title="Email" body="atelier@tailorhub.co" />
            <Info icon={Clock} title="Hours" body="Mon–Sat · 10:00–19:00 · By appointment" />
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-gold">{label}</label>
      <input id={name} name={name} type={type} required className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold" />
    </div>
  );
}

function Info({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <Icon className="h-5 w-5 text-gold" />
      <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="mt-1 text-base">{body}</div>
    </div>
  );
}
