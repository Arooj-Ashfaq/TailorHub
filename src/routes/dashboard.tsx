import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TailorHub" }] }),
  component: DashboardRedirect,
});

/** A single "Dashboard" entry point that sends each role to its own dashboard: buyer -> /account, seller -> /seller, admin -> /admin. */
function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role === "admin") navigate({ to: "/admin" });
    else if (user.role === "seller") navigate({ to: "/seller" });
    else navigate({ to: "/account" });
  }, [isLoading, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center text-sm text-muted-foreground">
          Redirecting to your dashboard…
        </div>
      </main>
      <Footer />
    </div>
  );
}
