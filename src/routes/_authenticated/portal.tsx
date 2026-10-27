import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, CreditCard, Droplets, FileText, LayoutDashboard, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleShell, IssueBadge } from "@/components/SimpleShell";
import { Panel, StatusPill, EmptyState } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  announcementsQuery,
  documentsQuery,
  issuesQuery,
  kes,
  monthlyDue,
  myTenancyQuery,
  paymentsQuery,
  requireRole,
} from "@/lib/data";
import { TenantUpload, DocRow } from "@/components/TenantDocs";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Tenant portal | RentDesk" },
      {
        name: "description",
        content:
          "Your rent and water arrears, payments, documents, notifications and repair requests.",
      },
      { property: "og:title", content: "Tenant portal | RentDesk" },
      { property: "og:description", content: "Your bills, notices and repair requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: ({ context }) => requireRole(context.queryClient, "tenant"),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all(
      [myTenancyQuery, announcementsQuery, issuesQuery, paymentsQuery, documentsQuery].map((o) =>
        q.ensureQueryData(o as never),
      ),
    ).then(() => undefined),
  errorComponent: ({ error }) => (
    <div className="p-8 text-destructive">{(error as Error).message}</div>
  ),
  component: Portal,
});

const tabs = [
  { id: "overview", label: "Arrears", icon: LayoutDashboard },
  { id: "water", label: "Water", icon: Droplets },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "issues", label: "Issues", icon: Wrench },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;
type Tab = (typeof tabs)[number]["id"];

function Portal() {
  const { data: me } = useSuspenseQuery(myTenancyQuery);
  const { data: news } = useSuspenseQuery(announcementsQuery);
  const { data: issues } = useSuspenseQuery(issuesQuery);
  const { data: payments } = useSuspenseQuery(paymentsQuery);
  const { data: docs } = useSuspenseQuery(documentsQuery);
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const ch = supabase
      .channel("tenant-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () =>
        qc.invalidateQueries({ queryKey: ["announcements"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "issues" }, () =>
        qc.invalidateQueries({ queryKey: ["issues"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const report = useMutation({
    mutationFn: async () => {
      if (!me || !title.trim()) throw new Error("Describe the issue briefly");
      const { error } = await supabase
        .from("issues")
        .insert({
          owner_id: "00000000-0000-0000-0000-000000000000",
          property_id: me.property_id,
          tenant_id: me.id,
          title: title.trim(),
          description: desc.trim(),
        });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Issue sent to your caretaker");
      setTitle("");
      setDesc("");
      qc.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (e) => toast.error(e.message),
  });

  if (!me)
    return (
      <SimpleShell portal="Tenant portal" title="Welcome">
        <Panel>
          <EmptyState text="Your account isn't linked to a unit yet. Ask your caretaker to add your email to your tenant record." />
        </Panel>
      </SimpleShell>
    );

  const balance = Number(me.balance);
  const water = Number(me.water_balance || 0);
  const currentWaterBill = Number(me.water || 0);
  const currentGarbage = Number(me.garbage || 0);
  const currentRent = Number(me.rent || 0);

  // Calculate how many units they used based on the 150 KES rate
  const waterUnitsUsed = currentWaterBill / 150;

  const notifications = [
    ...news.map((a) => ({
      id: "a" + a.id,
      when: a.created_at,
      title: a.title,
      body: a.body,
      kind: "Notice",
    })),
    ...issues
      .filter((i) => i.status !== "open")
      .map((i) => ({
        id: "i" + i.id,
        when: i.created_at,
        title: `Your issue "${i.title}" is ${i.status.replace("_", " ")}`,
        body: "",
        kind: "Issue update",
      })),
  ].sort((a, b) => b.when.localeCompare(a.when));

  return (
    <SimpleShell
      portal="Tenant portal"
      title={`Habari, ${me.name.split(" ")[0]}`}
      subtitle={`${me.property?.name} · Unit ${me.unit}`}
    >
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border bg-card p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm ${tab === id ? "bg-primary-soft font-semibold text-primary" : "text-muted-foreground"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {id === "notifications" && notifications.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {notifications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Total Arrears">
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl font-semibold">{kes(balance)}</span>
              <StatusPill balance={balance} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Total amount still owed on your account (including previous months).
            </p>
          </Panel>

          <Panel title="This Month's Bill Breakdown">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Rent</dt>
                <dd className="font-medium">{kes(currentRent)}</dd>
              </div>

              <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-md -mx-2">
                <dt className="text-blue-700 flex flex-col">
                  <span>Water Bill</span>
                  <span className="text-xs text-blue-500">
                    ({waterUnitsUsed} units @ KES 150/unit)
                  </span>
                </dt>
                <dd className="font-medium text-blue-700">{kes(currentWaterBill)}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted-foreground flex flex-col">
                  <span>Garbage / Trash</span>
                  <span className="text-xs text-muted-foreground/70">(Fixed monthly fee)</span>
                </dt>
                <dd className="font-medium">{kes(currentGarbage)}</dd>
              </div>

              <div className="flex justify-between border-t pt-3 font-semibold text-base">
                <dt>Total Due This Month</dt>
                <dd>{kes(monthlyDue(me))}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      )}

      {/* WATER TAB */}
      {tab === "water" && (
        <Panel title="Water Details">
          <div className="flex items-center justify-between">
            <span className="font-display text-3xl font-semibold">{kes(water)}</span>
            <StatusPill balance={water} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            This is your total unpaid water balance.
          </p>

          <div className="mt-6 p-4 bg-muted rounded-xl">
            <h3 className="font-semibold mb-2">How your water is billed:</h3>
            <p className="text-sm text-muted-foreground">
              We charge <strong>KES 150 per unit</strong> (cubic meter) of water used.
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="bg-background p-2 rounded border">
                <span className="text-muted-foreground block text-xs">Units Used This Month</span>
                <strong>{waterUnitsUsed} units</strong>
              </div>
              <div className="bg-background p-2 rounded border">
                <span className="text-muted-foreground block text-xs">Current Water Bill</span>
                <strong>{kes(currentWaterBill)}</strong>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* PAYMENTS TAB */}
      {tab === "payments" && (
        <Panel title="My payments">
          {payments.length === 0 ? (
            <EmptyState text="No payments recorded yet." />
          ) : (
            <div className="divide-y">
              {payments.map((p) => (
                <div key={p.id} className="flex justify-between gap-3 py-3 text-sm">
                  <div>
                    <div className="font-medium">{p.method}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.ref || "—"} · {p.paid_on}
                    </div>
                  </div>
                  <div className="font-semibold text-success">{kes(Number(p.amount))}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* ISSUES TAB */}
      {tab === "issues" && (
        <Panel title="Report an issue">
          <div className="space-y-3">
            <Input
              placeholder="e.g. Leaking kitchen tap"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              rows={4}
              placeholder="Details (optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <Button disabled={report.isPending} onClick={() => report.mutate()}>
              Send to caretaker
            </Button>
          </div>
          <div className="mt-5 divide-y">
            {issues.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{i.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(i.created_at).toLocaleDateString("en-KE")}
                  </div>
                </div>
                <IssueBadge status={i.status} />
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* DOCUMENTS TAB */}
      {tab === "documents" && (
        <Panel title="Documents">
          <TenantUpload tenantId={me.id} propertyId={me.property_id} />
          {docs.length === 0 ? (
            <EmptyState text="No documents yet. Upload your lease agreement and ID above." />
          ) : (
            <ul className="divide-y">
              {docs.map((d) => (
                <DocRow key={d.id} d={d} />
              ))}
            </ul>
          )}
        </Panel>
      )}

      {/* NOTIFICATIONS TAB */}
      {tab === "notifications" && (
        <Panel title="Notifications">
          {notifications.length === 0 ? (
            <EmptyState text="No notifications right now." />
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n.id} className="rounded-xl border-l-4 border-primary bg-primary-soft p-4">
                  <div className="text-xs font-semibold text-primary">{n.kind}</div>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(n.when).toLocaleString("en-KE")}
                  </div>
                  {n.body && <p className="mt-2 whitespace-pre-wrap text-sm">{n.body}</p>}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}
    </SimpleShell>
  );
}
