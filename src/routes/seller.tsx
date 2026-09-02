import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/Section";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
import { Pencil, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/seller")({
  head: () => ({ meta: [{ title: "Seller Dashboard — TailorHub" }] }),
  component: SellerPage,
});

const CATEGORIES = ["Fabrics", "Ready-made", "Accessories", "Cufflinks", "Belts", "Shoes"];
const IMAGE_KEYS = ["fabrics", "service-suit", "service-wedding", "service-shirt"];

function SellerPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (user.role !== "seller" && user.role !== "admin") { navigate({ to: "/account" }); return; }
  }, [isLoading, user, navigate]);

  if (isLoading || !user || (user.role !== "seller" && user.role !== "admin")) {
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
        <section className="mx-auto max-w-5xl px-6 py-16">
          <SectionHeader eyebrow="Seller Dashboard" title="Manage your listings" description="Create, edit and remove the products and services you offer." />
          <div className="mt-12">
            <ProductsPanel />
          </div>
          <div className="mt-16">
            <ServicesPanel />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProductsPanel() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<api.Product | null>(null);

  const { data: products = [], isLoading } = useQuery({ queryKey: ["products", "mine"], queryFn: api.getMyProducts });

  const createMutation = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added.");
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<api.Product> }) => api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated.");
      setEditing(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product removed.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name")),
      category: String(fd.get("category")),
      price: Number(fd.get("price")),
      image: String(fd.get("image")),
      rating: Number(fd.get("rating") || 5),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Products</h3>
        <button
          onClick={() => { setEditing(null); setShowForm((v) => !v); }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {(showForm || editing) && (
        <form onSubmit={handleSubmit} className="glass-panel mt-4 grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
          <Field label="Name" name="name" defaultValue={editing?.name} required />
          <SelectField label="Category" name="category" options={CATEGORIES} defaultValue={editing?.category} />
          <Field label="Price ($)" name="price" type="number" step="0.01" defaultValue={editing?.price} required />
          <Field label="Rating (0–5)" name="rating" type="number" step="0.1" min={0} max={5} defaultValue={editing?.rating ?? 5} />
          <SelectField label="Image" name="image" options={IMAGE_KEYS} defaultValue={editing?.image} />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {editing ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">You haven't listed any products yet.</p>
      ) : (
        <div className="mt-6 divide-y divide-border/60 rounded-2xl border border-border/60">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category} · ${p.price}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(p); setShowForm(false); }}
                  className="rounded-full border border-border p-2 hover:border-gold hover:text-gold"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(p.id)}
                  className="rounded-full border border-border p-2 hover:border-destructive hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ServicesPanel() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<api.Service | null>(null);

  const { data: services = [], isLoading } = useQuery({ queryKey: ["services", "mine"], queryFn: api.getMyServices });

  const createMutation = useMutation({
    mutationFn: api.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service added.");
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<api.Service> }) => api.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated.");
      setEditing(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service removed.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: String(fd.get("title")),
      duration: String(fd.get("duration")),
      price: Number(fd.get("price")),
      image: String(fd.get("image")),
      description: String(fd.get("description")),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Services</h3>
        <button
          onClick={() => { setEditing(null); setShowForm((v) => !v); }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? "Cancel" : "Add Service"}
        </button>
      </div>

      {(showForm || editing) && (
        <form onSubmit={handleSubmit} className="glass-panel mt-4 grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
          <Field label="Title" name="title" defaultValue={editing?.title} required />
          <Field label="Duration" name="duration" defaultValue={editing?.duration} placeholder="e.g. 2 weeks" required />
          <Field label="Price ($)" name="price" type="number" step="0.01" defaultValue={editing?.price} required />
          <SelectField label="Image" name="image" options={IMAGE_KEYS} defaultValue={editing?.image} />
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-widest text-gold">Description</label>
            <textarea
              name="description"
              defaultValue={editing?.description}
              rows={3}
              required
              className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {editing ? "Save changes" : "Create service"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : services.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">You haven't listed any services yet.</p>
      ) : (
        <div className="mt-6 divide-y divide-border/60 rounded-2xl border border-border/60">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.duration} · ${s.price}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(s); setShowForm(false); }}
                  className="rounded-full border border-border p-2 hover:border-gold hover:text-gold"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(s.id)}
                  className="rounded-full border border-border p-2 hover:border-destructive hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  [key: string]: unknown;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-gold">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
        {...rest}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-gold">{label}</label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
