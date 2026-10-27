import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "@/lib/data";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, Panel, EmptyState } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kes, paymentsQuery, tenantsQuery, type PaymentMethod } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [
      { title: "Payments | RentDesk" },
      {
        name: "description",
        content: "M-Pesa, Co-op Bank and cash payments received from tenants.",
      },
      { property: "og:title", content: "Payments | RentDesk" },
      { property: "og:description", content: "Track and record tenant payments." },
    ],
  }),
  beforeLoad: ({ context }) => requireRole(context.queryClient, "landlord"),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all([q.ensureQueryData(paymentsQuery), q.ensureQueryData(tenantsQuery)]).then(
      () => undefined,
    ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-destructive">{(error as Error).message}</div>
  ),
  component: Payments,
});

function Payments() {
  const { data: list } = useSuspenseQuery(paymentsQuery);
  const { data: tenants } = useSuspenseQuery(tenantsQuery);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("M-Pesa");
  const [amount, setAmount] = useState("");
  const [ref, setRef] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const n = Number(amount);
      if (!tenantId || !n || n <= 0) throw new Error("Choose a tenant and enter a valid amount");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("payments")
        .insert({ owner_id: u.user!.id, tenant_id: tenantId, amount: n, method, ref: ref.trim() });
      if (error) throw new Error(error.message);
      return n;
    },
    onSuccess: (n) => {
      toast.success(`${kes(n)} recorded for ${tenants.find((t) => t.id === tenantId)?.name}`);
      qc.invalidateQueries();
      setOpen(false);
      setTenantId("");
      setAmount("");
      setRef("");
    },
    onError: (e) => toast.error(e.message),
  });

  const month = new Date().toISOString().slice(0, 7);
  const total = list
    .filter((p) => p.paid_on.startsWith(month))
    .reduce((s, p) => s + Number(p.amount), 0);

  return (
    <AppShell
      title="Payments"
      subtitle={`${kes(total)} received this month`}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Record payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record a payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Tenant</Label>
                <Select value={tenantId} onValueChange={setTenantId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} — {t.unit} (owes {kes(Number(t.balance))})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Method</Label>
                <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["M-Pesa", "Co-op Bank", "Cash"] as const).map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Amount (KES)</Label>
                  <Input
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Reference</Label>
                  <Input
                    placeholder="e.g. SJK4H7Q2LM"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={save.isPending} onClick={() => save.mutate()}>
                {save.isPending ? "Saving…" : "Save payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Panel className="p-0">
        {list.length === 0 ? (
          <EmptyState text="No payments yet." />
        ) : (
          <div className="divide-y">
            {list.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.tenant?.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {p.tenant?.property?.name} · {p.tenant?.unit} · {p.method} · {p.ref || "—"} ·{" "}
                    {p.paid_on}
                  </div>
                </div>
                <div className="font-semibold text-success">+{kes(Number(p.amount))}</div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
