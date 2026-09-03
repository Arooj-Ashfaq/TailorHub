import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — TailorHub" }] }),
  component: AdminPage,
});

const TABS = ["Users", "Products", "Services", "Testimonials", "Appointments"] as const;
type Tab = (typeof TABS)[number];

function AdminPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Users");

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role !== "admin") {
      navigate({ to: "/account" });
      return;
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="pt-24">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeader
            eyebrow="Admin Panel"
            title="Manage TailorHub"
            description="Users, catalogue and fitting requests, all in one place."
          />

          <div className="mt-10 flex flex-wrap gap-2 border-b border-border/60 pb-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-gold"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "Users" && <UsersTab currentUserId={user.id} />}
            {tab === "Products" && <ProductsTab />}
            {tab === "Services" && <ServicesTab />}
            {tab === "Testimonials" && <TestimonialsTab />}
            {tab === "Appointments" && <AppointmentsTab />}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function UsersTab({ currentUserId }: { currentUserId: number }) {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: api.getAdminUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: api.UserRole }) => api.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role updated.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="divide-y divide-border/60 rounded-2xl border border-border/60">
      {users.map((u) => (
        <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="font-medium">{u.name}</div>
            <div className="text-xs text-muted-foreground">{u.email}</div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={u.role}
              disabled={u.id === currentUserId}
              onChange={(e) =>
                roleMutation.mutate({ id: u.id, role: e.target.value as api.UserRole })
              }
              className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs outline-none focus:border-gold disabled:opacity-50"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={() => deleteMutation.mutate(u.id)}
              disabled={u.id === currentUserId}
              className="rounded-full border border-border p-2 hover:border-destructive hover:text-destructive disabled:opacity-30"
              aria-label="Delete user"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
  });
  const deleteMutation = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        As admin you can delete any product. To add or edit listings, use the{" "}
        <a href="/seller" className="text-gold hover:underline">
          Seller Dashboard
        </a>{" "}
        — it has full create/edit forms and works for admins too.
      </p>
      <div className="divide-y divide-border/60 rounded-2xl border border-border/60">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">
                {p.category} · ${p.price} · seller #{p.sellerId ?? "house"}
              </div>
            </div>
            <button
              onClick={() => deleteMutation.mutate(p.id)}
              className="rounded-full border border-border p-2 hover:border-destructive hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesTab() {
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: api.getServices,
  });
  const deleteMutation = useMutation({
    mutationFn: api.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        As admin you can delete any service. To add or edit listings, use the{" "}
        <a href="/seller" className="text-gold hover:underline">
          Seller Dashboard
        </a>{" "}
        — it has full create/edit forms and works for admins too.
      </p>
      <div className="divide-y divide-border/60 rounded-2xl border border-border/60">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-muted-foreground">
                {s.duration} · ${s.price} · seller #{s.sellerId ?? "house"}
              </div>
            </div>
            <button
              onClick={() => deleteMutation.mutate(s.id)}
              className="rounded-full border border-border p-2 hover:border-destructive hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: api.getTestimonials,
  });

  const createMutation = useMutation({
    mutationFn: api.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial added.");
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      name: String(fd.get("name")),
      role: String(fd.get("role")),
      quote: String(fd.get("quote")),
      rating: Number(fd.get("rating") || 5),
    });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <button
        onClick={() => setShowForm((v) => !v)}
        className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
      >
        {showForm ? "Cancel" : "Add Testimonial"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel mt-4 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
        >
          <div>
            <label className="text-xs uppercase tracking-widest text-gold">Name</label>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gold">Role</label>
            <input
              name="role"
              required
              placeholder="e.g. CEO, Whitcomb & Sons"
              className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-widest text-gold">Quote</label>
            <textarea
              name="quote"
              rows={3}
              required
              className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 divide-y divide-border/60 rounded-2xl border border-border/60">
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
            <button
              onClick={() => deleteMutation.mutate(t.id)}
              className="rounded-full border border-border p-2 hover:border-destructive hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ["new", "confirmed", "completed", "cancelled"];

function AppointmentsTab() {
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["admin", "appointments"],
    queryFn: api.getAllAppointments,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
      toast.success("Status updated.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
      toast.success("Appointment deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="divide-y divide-border/60 rounded-2xl border border-border/60">
      {appointments.map((a) => (
        <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="font-medium">
              {a.name} — {a.fittingType}
            </div>
            <div className="text-xs text-muted-foreground">
              {a.email} {a.phone ? `· ${a.phone}` : ""}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={a.status}
              onChange={(e) => statusMutation.mutate({ id: a.id, status: e.target.value })}
              className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs outline-none focus:border-gold"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => deleteMutation.mutate(a.id)}
              className="rounded-full border border-border p-2 hover:border-destructive hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
