import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log In — TailorHub" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/account" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-md px-6 py-16">
          <SectionHeader eyebrow="Account" title="Log in" description="Welcome back to TailorHub." />

          <form onSubmit={handleSubmit} className="glass-panel mt-10 space-y-4 rounded-3xl p-8">
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-gold">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs uppercase tracking-widest text-gold">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-[0_0_40px_-5px_var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging in…" : "Log In"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-gold hover:underline">Sign up</Link>
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
