import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, CreditCard, LayoutDashboard, LogOut, Users } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/tenants", label: "Tenants", icon: Users },
  { to: "/payments", label: "Payments", icon: CreditCard },
] as const;

function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.clear();
    navigate({ to: "/auth", replace: true });
  };
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]">
        <Building2 aria-hidden="true" className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-serif text-lg font-semibold leading-tight text-[#f7f4eb]">
          RentDesk
        </span>
        <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.18em] text-[#a6b5a8]">
          PROPERTY DESK
        </span>
      </span>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const signOut = useSignOut();

  return (
    <div className="flex min-h-screen bg-[#f7f4eb] text-[#17261c]">
      <aside className="hidden w-44 shrink-0 flex-col bg-[#0c2918] px-4 py-5 min-[700px]:flex lg:w-60 lg:px-5">
        <Link
          to="/dashboard"
          aria-label="RentDesk overview"
          className="mb-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]"
        >
          <Brand />
        </Link>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa193]">
          Workspace
        </p>
        <nav aria-label="Workspace" className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-[#c2cec4] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]"
              activeProps={{
                className:
                  "flex items-center gap-3 rounded-xl border-l-2 border-[#d6aa59] bg-[#1d3b28] px-3 py-2.5 text-sm font-semibold text-[#f7f4eb]",
              }}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hidden min-h-14 items-center justify-end border-b border-[#e6e0d4] bg-[#fffefa] px-6 min-[700px]:flex">
          <Button
            variant="outline"
            onClick={signOut}
            className="h-9 rounded-lg border-[#e5dfd3] bg-transparent text-xs font-medium text-[#36463a] shadow-none hover:bg-[#f1ece2] hover:text-[#145632] focus-visible:ring-[#145632]"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </Button>
        </header>
        <header className="flex items-center justify-between border-b border-[#e6e0d4] bg-[#0c2918] px-4 py-3 min-[700px]:hidden">
          <Link
            to="/dashboard"
            aria-label="RentDesk overview"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]"
          >
            <Brand compact />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            onClick={signOut}
            className="text-[#f7f4eb] hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
          </Button>
        </header>

        <nav
          aria-label="Workspace"
          className="flex gap-1 overflow-x-auto border-b border-[#e6e0d4] bg-[#0c2918] px-3 pb-3 min-[700px]:hidden"
        >
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#c2cec4] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]"
              activeProps={{
                className:
                  "flex shrink-0 items-center gap-2 rounded-lg bg-[#1d3b28] px-3 py-2 text-sm font-semibold text-[#f7f4eb]",
              }}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-9 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <header className="mb-7 flex flex-col gap-4 border-b border-[#e6e0d4] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#315d40]">
                    {eyebrow}
                  </p>
                )}
                <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#17261c] sm:text-[2.4rem]">
                  {title}
                </h1>
                {subtitle && <p className="mt-2 text-sm text-[#69746c]">{subtitle}</p>}
              </div>
              {actions && (
                <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
                  {actions}
                </div>
              )}
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[#e5dfd3] bg-[#fffefa] p-5 shadow-[0_2px_8px_rgba(27,42,30,0.06)] ${className}`}
    >
      {title && <h2 className="mb-4 font-serif text-xl font-semibold text-[#17261c]">{title}</h2>}
      {children}
    </section>
  );
}

export function StatusPill({ balance }: { balance: number }) {
  if (balance <= 0)
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Paid up
      </span>
    );
  if (balance < 10000)
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Partial
      </span>
    );
  return (
    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
      In arrears
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="p-10 text-center text-sm text-[#69746c]">{text}</p>;
}
