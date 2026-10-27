import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "@/lib/data";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell, Panel, StatusPill, EmptyState } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { kes, monthlyDue, tenantsQuery } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/tenants")({
  head: () => ({
    meta: [
      { title: "Tenants | RentDesk" },
      {
        name: "description",
        content: "Tenant list with rent, water and garbage charges and balances.",
      },
      { property: "og:title", content: "Tenants | RentDesk" },
      { property: "og:description", content: "Every tenant's monthly charges and balance." },
    ],
  }),
  beforeLoad: ({ context }) => requireRole(context.queryClient, "landlord"),
  loader: ({ context }) => context.queryClient.ensureQueryData(tenantsQuery).then(() => undefined),
  errorComponent: ({ error }) => (
    <div className="p-8 text-destructive">{(error as Error).message}</div>
  ),
  component: Tenants,
});

function Tenants() {
  const { data: tenants } = useSuspenseQuery(tenantsQuery);
  const [q, setQ] = useState("");
  const list = tenants.filter((t) =>
    `${t.name} ${t.unit} ${t.property?.name}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <AppShell
      title="Tenants"
      subtitle={`${tenants.length} active tenants`}
      actions={
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, unit, property"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      }
    >
      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {[
                "Tenant",
                "Property / Unit",
                "Rent",
                "Water",
                "Garbage",
                "Monthly",
                "Balance",
                "Status",
              ].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((t) => (
              <tr key={t.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.phone}</div>
                </td>
                <td className="px-4 py-3">
                  {t.property?.name} · {t.unit}
                </td>
                <td className="px-4 py-3">{kes(Number(t.rent))}</td>
                <td className="px-4 py-3">{kes(Number(t.water))}</td>
                <td className="px-4 py-3">{kes(Number(t.garbage))}</td>
                <td className="px-4 py-3 font-semibold">{kes(monthlyDue(t))}</td>
                <td className="px-4 py-3 font-semibold">{kes(Number(t.balance))}</td>
                <td className="px-4 py-3">
                  <StatusPill balance={Number(t.balance)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <EmptyState text={q ? `No tenants match “${q}”.` : "No tenants yet."} />
        )}
      </Panel>
    </AppShell>
  );
}
