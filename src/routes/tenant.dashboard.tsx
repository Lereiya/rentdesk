import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Droplets,
  Home,
  LogOut,
  Send,
  Trash2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/tenant/dashboard")({
  head: () => ({ meta: [{ title: "Tenant dashboard | RentDesk" }] }),
  component: TenantPortal,
});

type TenantRecord = {
  id: string;
  name: string;
  unit: string;
  rent: number;
  water: number;
  garbage: number;
  balance: number;
  property_id: string;
  property?: { name: string; location: string | null } | null;
};

type MaintenanceIssue = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
};

const money = (amount: number) => `KES ${Math.round(amount).toLocaleString("en-KE")}`;

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "resolved":
      return {
        label: "Resolved",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
        Icon: CheckCircle2,
      };
    case "in progress":
    case "in_progress":
      return {
        label: "In progress",
        className: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
        Icon: Clock3,
      };
    default:
      return {
        label: "Open",
        className: "bg-rose-50 text-rose-700 ring-rose-600/15",
        Icon: AlertCircle,
      };
  }
}

function TenantPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<TenantRecord | null>(null);
  const [issues, setIssues] = useState<MaintenanceIssue[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: "", description: "" });

  const fetchTenantData = useCallback(async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) {
        await navigate({ to: "/tenant-login" });
        return;
      }

      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("*, property:properties(name, location)")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (tenantError) throw tenantError;
      if (!tenantData) {
        setTenant(null);
        return;
      }

      setTenant(tenantData);
      const { data: issueData, error: issueError } = await supabase
        .from("issues")
        .select("*")
        .eq("tenant_id", tenantData.id)
        .order("created_at", { ascending: false });

      if (issueError) throw issueError;
      setIssues(issueData ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load your tenant portal.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void fetchTenantData();
  }, [fetchTenantData]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    await navigate({ to: "/tenant-login" });
  };

  const handleReportIssue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tenant) return;

    setSubmitting(true);
    const { error } = await supabase.from("issues").insert({
      tenant_id: tenant.id,
      property_id: tenant.property_id,
      title: newIssue.title.trim(),
      description: newIssue.description.trim(),
      status: "open",
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Your maintenance issue has been reported.");
    setNewIssue({ title: "", description: "" });
    await fetchTenantData();
  };

  if (loading) {
    return (
      <main className="portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] px-4">
        <p className="text-sm font-medium text-slate-500">Loading your tenant portal…</p>
      </main>
    );
  }

  if (!tenant) {
    return (
      <main className="portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] px-4">
        <section className="w-full max-w-md rounded-2xl border border-[#e5dfd3] bg-[#fffefa] p-8 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-lg font-semibold text-[#17261c]">
            Tenant profile unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            We couldn’t find a tenant record linked to this account. Please contact your caretaker.
          </p>
        </section>
      </main>
    );
  }

  const totalDue = Number(tenant.rent) + Number(tenant.water) + Number(tenant.garbage);
  const balance = Number(tenant.balance);

  return (
    <div className="portal-theme min-h-screen bg-[#f7f4eb] text-[#17261c]">
      <header className="border-b border-[#1e422b] bg-[#0c2918]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]">
              <Home className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold leading-tight text-[#f7f4eb]">
                RentDesk
              </p>
              <h1 className="truncate text-sm font-medium tracking-tight text-[#c2cec4] sm:text-base">
                Habari, {tenant.name}
              </h1>
              <p className="truncate text-xs text-[#aebcaf]">
                Unit {tenant.unit} <span className="px-1 text-[#728576]">·</span>
                {tenant.property?.name ?? "Your property"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="h-9 shrink-0 rounded-lg border-white/20 bg-transparent text-xs font-medium text-[#f7f4eb] shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[0.85fr_1.35fr] lg:px-8">
        <section className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-700 p-6 text-white sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-indigo-100">Your current bill</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{money(balance)}</p>
                  <p className="mt-1 text-sm text-indigo-100">Outstanding balance</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-sm">
                <span className="text-indigo-100">Monthly charges</span>
                <span className="font-semibold">{money(totalDue)}</span>
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Home className="h-4 w-4" />
                  </span>
                  Rent
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {money(Number(tenant.rent))}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600">
                    <Droplets className="h-4 w-4" />
                  </span>
                  Water
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {money(Number(tenant.water))}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Trash2 className="h-4 w-4" />
                  </span>
                  Garbage
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {money(Number(tenant.garbage))}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-500">Balance status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    balance > 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {balance > 0 ? "Payment due" : "Paid up"}
                </span>
              </div>
              <Button
                className="h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                disabled
                title="M-Pesa payments will be available soon"
              >
                Pay via M-Pesa
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-center text-xs text-slate-400">Online payments coming soon</p>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <div className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Your home, in one place</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Track your balance and stay up to date on maintenance requests from your tenant
                  portal.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Report a maintenance issue</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tell your caretaker what needs attention.
                </p>
              </div>
            </div>
            <form onSubmit={handleReportIssue} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issue-title" className="text-sm font-medium text-slate-700">
                  Issue title
                </Label>
                <Input
                  id="issue-title"
                  required
                  maxLength={120}
                  placeholder="e.g. Leaking kitchen sink"
                  value={newIssue.title}
                  onChange={(event) => setNewIssue({ ...newIssue, title: event.target.value })}
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-description" className="text-sm font-medium text-slate-700">
                  Description
                </Label>
                <Textarea
                  id="issue-description"
                  required
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the problem and where it is happening…"
                  value={newIssue.description}
                  onChange={(event) =>
                    setNewIssue({ ...newIssue, description: event.target.value })
                  }
                  className="min-h-28 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">Your caretaker will be notified.</p>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-10 rounded-xl bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Sending…" : "Submit issue"}
                </Button>
              </div>
            </form>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-bold tracking-tight">My reported issues</h2>
                <p className="mt-1 text-sm text-slate-500">Updates from your property team</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {issues.length}
              </span>
            </div>
            {issues.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <Wrench className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">Nothing to track yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Your maintenance requests will appear here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {issues.map((issue) => {
                  const status = statusStyle(issue.status);
                  const StatusIcon = status.Icon;
                  return (
                    <li
                      key={issue.id}
                      className="px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900">{issue.title}</h3>
                          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-500">
                            {issue.description}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">
                            {new Date(issue.created_at).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
