import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import { useAuth } from "@/lib/auth-context";
import { getMyAppointments } from "@/lib/api";
import { Calendar, LogOut, Mail, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "My Account — TailorHub" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [isLoading, user, navigate]);

  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    isError,
  } = useQuery({
    queryKey: ["appointments", "mine"],
    queryFn: getMyAppointments,
    enabled: !!user,
  });

  function handleLogout() {
    logout();
    toast.success("Logged out.");
    navigate({ to: "/" });
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="pt-24">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center text-sm text-muted-foreground">Loading…</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <SectionHeader eyebrow="Account" title={`Welcome, ${user.name.split(" ")[0]}`} />

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <aside className="glass-panel h-fit space-y-4 rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <UserIcon className="h-4 w-4 text-gold" />
                <span className="text-sm">{user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold" />
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-widest hover:border-gold hover:text-gold"
              >
                <LogOut className="h-3.5 w-3.5" /> Log out
              </button>
            </aside>

            <div className="md:col-span-2">
              <h3 className="font-display text-xl">My fitting requests</h3>

              {isLoadingAppointments && (
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl border border-border/60 bg-card" />
                  ))}
                </div>
              )}

              {isError && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Couldn't load your appointments right now — make sure the backend is running.
                </p>
              )}

              {!isLoadingAppointments && !isError && appointments.length === 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  No fitting requests yet — book one from the Contact page.
                </p>
              )}

              <div className="mt-4 space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-border/60 bg-card p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg">{a.fittingType}</span>
                      <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                        {a.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(a.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </div>
                    {a.notes && <p className="mt-3 text-sm text-muted-foreground">{a.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
