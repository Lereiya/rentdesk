import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  MapPin,
  Users,
  Wallet,
  CalendarDays,
  DoorOpen,
  CreditCard,
} from "lucide-react";
import { AppShell, EmptyState, Panel } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import {
  homeFor,
  kes,
  monthlyDue,
  monthlySeries,
  paymentsQuery,
  profileQuery,
  propertiesQuery,
  requireRole,
  rolesQuery,
  tenantsQuery,
} from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview | RentDesk" },
      {
        name: "description",
        content: "Rent collection, occupancy and arrears across your properties.",
      },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const roles = await context.queryClient.ensureQueryData(rolesQuery);
    const home = homeFor(roles);
    if (home !== "/dashboard") throw redirect({ to: home });
    await requireRole(context.queryClient, "landlord");
  },
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(profileQuery),
      queryClient.ensureQueryData(propertiesQuery),
      queryClient.ensureQueryData(tenantsQuery),
      queryClient.ensureQueryData(paymentsQuery),
    ]).then(() => undefined),
  errorComponent: ({ error }) => (
    <div
      role="alert"
      className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
    >
      The portfolio overview could not be loaded: {(error as Error).message}
    </div>
  ),
  component: Overview,
});

function Overview() {
  const { data: profile } = useSuspenseQuery(profileQuery);
  const { data: properties } = useSuspenseQuery(propertiesQuery);
  const { data: tenants } = useSuspenseQuery(tenantsQuery);
  const { data: payments } = useSuspenseQuery(paymentsQuery);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const expected = tenants.reduce((sum, tenant) => sum + monthlyDue(tenant), 0);
  const collected = payments
    .filter((payment) => payment.paid_on.startsWith(selectedMonth))
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const totalArrears = tenants.reduce(
    (sum, tenant) => sum + Math.max(Number(tenant.balance), 0),
    0,
  );
  const totalUnits = properties.reduce((sum, property) => sum + Number(property.units), 0);
  const occupiedUnits = properties.reduce((sum, property) => sum + Number(property.occupied), 0);
  const occupancy = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const billedPerMonth = tenants.reduce((sum, tenant) => sum + monthlyDue(tenant), 0);
  const rentSeries = monthlySeries(payments, billedPerMonth);

  return (
    <AppShell
      title={`Habari, ${profile?.full_name || "Landlord"}`}
      subtitle="Your portfolio, in good order. Here's the month at a glance."
      eyebrow="Portfolio overview  /  Kenya"
      actions={
        <div className="relative w-full sm:w-auto">
          <CalendarDays
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#315d40]"
          />
          <Input
            type="month"
            aria-label="Select month for portfolio totals"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="month-picker h-10 w-full min-w-0 shrink-0 rounded-xl border-[#e5dfd3] bg-[#fffefa] pl-9 pr-10 text-sm text-[#36463a] focus-visible:ring-[#145632] sm:w-[204px]"
          />
        </div>
      }
    >
      <div className="mb-3 flex items-center gap-3">
        <h2 className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#69746c]">
          This month at a glance
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-[#e6e0d4]" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <MetricCard
          label="Collected this month"
          value={kes(collected)}
          detail={`${expected > 0 ? Math.round((collected / expected) * 100) : 0}% of ${kes(expected)}`}
          icon={<CreditCard aria-hidden="true" className="h-4 w-4" />}
          iconClass="bg-[#dcecdf] text-[#24613a]"
        />
        <MetricCard
          label="Outstanding arrears"
          value={kes(totalArrears)}
          detail={`${tenants.filter((tenant) => Number(tenant.balance) > 0).length} tenants`}
          icon={<AlertTriangle aria-hidden="true" className="h-4 w-4" />}
          iconClass="bg-[#fbe6e3] text-[#bd4d44]"
        />
        <MetricCard
          label="Occupancy"
          value={`${occupancy}%`}
          detail={`${occupiedUnits} of ${totalUnits} units`}
          icon={<DoorOpen aria-hidden="true" className="h-4 w-4" />}
          iconClass="bg-[#f4e9dc] text-[#9b6840]"
        />
        <MetricCard
          label="Properties"
          value={String(properties.length)}
          detail={`${tenants.length} tenants`}
          icon={<Building2 aria-hidden="true" className="h-4 w-4" />}
          iconClass="bg-[#e4ece8] text-[#527566]"
        />
      </div>

      <Panel className="mb-8 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#17261c]">Rent, received</h2>
            <p className="mt-1 text-xs text-[#69746c]">
              Billed and collected over the last six months
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#69746c]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#145632]" />
              Collected
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 border-t border-dashed border-[#aa9270]" />
              Billed
            </span>
          </div>
        </div>
        <RentReceivedChart data={rentSeries} />
      </Panel>

      {/* PROPERTIES LIST */}
      <section className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your properties</h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick view of the homes under your management.
            </p>
          </div>
          <Link
            to="/properties"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <Panel>
            <EmptyState text="Your properties will appear here once added." />
          </Panel>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => {
              const propertyTenants = tenants.filter((t) => t.property_id === property.id);
              const propertyArrears = propertyTenants.reduce(
                (sum, t) => sum + Math.max(Number(t.balance), 0),
                0,
              );
              const occupancy = property.units
                ? Math.round((property.occupied / property.units) * 100)
                : 0;

              return (
                <article
                  key={property.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {property.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {property.location || "Location not provided"}
                        </span>
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {property.occupied}/{property.units} occupied
                    </span>
                  </div>
                  <div className="border-t border-slate-100 px-5 py-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Users className="h-4 w-4" /> Tenants
                      </span>
                      <span className="font-semibold text-slate-800">{propertyTenants.length}</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Wallet className="h-4 w-4" /> Outstanding
                      </span>
                      <span
                        className={`font-semibold ${propertyArrears > 0 ? "text-red-600" : "text-emerald-600"}`}
                      >
                        {kes(propertyArrears)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${Math.min(occupancy, 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{occupancy}% occupancy</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* RECENT PAYMENTS */}
      <Panel title="Recent Payments">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Latest rent payments recorded across your properties.
          </p>
          <Link
            to="/payments"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            All payments <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        {payments.length === 0 ? (
          <EmptyState text="Recent payments will appear here when received." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {payments.slice(0, 6).map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Wallet className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {payment.tenant?.name || "Tenant payment"}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      Unit {payment.tenant?.unit || "—"} <span className="px-1">·</span>
                      {payment.method} <span className="px-1">·</span>
                      {new Date(payment.paid_on).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    +{kes(Number(payment.amount))}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{payment.ref || "Payment received"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </AppShell>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <Panel className="min-h-[112px] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#69746c]">{label}</p>
          <p className="mt-3 font-serif text-[26px] font-medium leading-none text-[#17261c]">
            {value}
          </p>
          <p className="mt-1.5 truncate text-[11px] text-[#69746c]">{detail}</p>
        </div>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${iconClass}`}>
          {icon}
        </span>
      </div>
    </Panel>
  );
}

function RentReceivedChart({ data }: { data: ReturnType<typeof monthlySeries> }) {
  const maximum = Math.max(0, ...data.flatMap((month) => [month.billed, month.collected]));
  if (maximum === 0) {
    return (
      <EmptyState text="Rent activity will appear here once billing or payments are recorded." />
    );
  }

  const width = 760;
  const height = 220;
  const left = 44;
  const right = 12;
  const top = 10;
  const bottom = 32;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = (index: number) => left + (plotWidth * index) / Math.max(data.length - 1, 1);
  const y = (value: number) => top + plotHeight - (value / maximum) * plotHeight;
  const collectedPoints = data.map((month, index) => `${x(index)},${y(month.collected)}`).join(" ");
  const billedPoints = data.map((month, index) => `${x(index)},${y(month.billed)}`).join(" ");
  const ticks = [0, maximum / 2, maximum];
  const compact = new Intl.NumberFormat("en-KE", { notation: "compact", maximumFractionDigits: 0 });

  return (
    <>
      <svg
        role="img"
        aria-labelledby="rent-chart-title rent-chart-description"
        viewBox={`0 0 ${width} ${height}`}
        className="h-52 w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <title id="rent-chart-title">Rent received over the last six months</title>
        <desc id="rent-chart-description">
          Monthly collected payments compared with the current monthly amount billed.
        </desc>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="#e9e3d8"
              strokeDasharray="3 4"
            />
            <text x={left - 8} y={y(tick) + 4} textAnchor="end" fill="#7a827b" fontSize="10">
              {compact.format(tick)}
            </text>
          </g>
        ))}
        <polyline
          points={billedPoints}
          fill="none"
          stroke="#aa9270"
          strokeDasharray="5 4"
          strokeWidth="1.5"
        />
        <polyline
          points={collectedPoints}
          fill="none"
          stroke="#145632"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        {data.map((month, index) => (
          <g key={month.month}>
            <circle cx={x(index)} cy={y(month.collected)} r="3" fill="#145632">
              <title>{`${month.month}: ${kes(month.collected)} collected`}</title>
            </circle>
            <text x={x(index)} y={height - 8} textAnchor="middle" fill="#69746c" fontSize="10">
              {month.month}
            </text>
          </g>
        ))}
      </svg>
      <table className="sr-only">
        <caption>Rent billed and collected over the last six months</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Billed</th>
            <th scope="col">Collected</th>
          </tr>
        </thead>
        <tbody>
          {data.map((month) => (
            <tr key={month.month}>
              <th scope="row">{month.month}</th>
              <td>{kes(month.billed)}</td>
              <td>{kes(month.collected)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
