import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PaymentMethod = "M-Pesa" | "Co-op Bank" | "Cash";

const unwrap = <T,>(r: { data: T | null; error: { message: string } | null }) => {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
};

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const r = await supabase.from("profiles").select("full_name").eq("id", u.user!.id).maybeSingle();
    if (r.error) throw new Error(r.error.message);
    return r.data;
  },
});
export const propertiesQuery = queryOptions({
  queryKey: ["properties"],
  queryFn: async () => unwrap(await supabase.from("properties").select("*").order("name")),
});
export const tenantsQuery = queryOptions({
  queryKey: ["tenants"],
  queryFn: async () => unwrap(await supabase.from("tenants").select("*, property:properties(name)").order("name")),
});
export const paymentsQuery = queryOptions({
  queryKey: ["payments"],
  queryFn: async () =>
    unwrap(await supabase.from("payments").select("*, tenant:tenants(name, unit, property:properties(name))").order("paid_on", { ascending: false }).order("created_at", { ascending: false }).limit(500)),
});

export const kes = (n: number) => "KES " + Math.round(n).toLocaleString("en-KE");
export const monthlyDue = (t: { rent: number; water: number; garbage: number }) => Number(t.rent) + Number(t.water) + Number(t.garbage);

/** Collected per month (last 6), billed = current monthly charges for each month. */
export function monthlySeries(payments: { amount: number; paid_on: string }[], billedPerMonth: number, now = new Date()) {
  const out: { month: string; billed: number; collected: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const collected = payments.filter((p) => p.paid_on.startsWith(key)).reduce((s, p) => s + Number(p.amount), 0);
    out.push({ month: d.toLocaleString("en-KE", { month: "short" }), billed: billedPerMonth, collected });
  }
  return out;
}

export const rolesQuery = queryOptions({
  queryKey: ["roles"],
  queryFn: async () => {
    const r = await supabase.from("user_roles").select("role");
    if (r.error) throw new Error(r.error.message);
    return r.data.map((x) => x.role);
  },
});

/** Landlord wins, then caretaker, then tenant. */
export const homeFor = (roles: string[]) =>
  roles.includes("landlord") ? "/dashboard" : roles.includes("caretaker") ? "/caretaker/dashboard" : roles.includes("tenant") ? "/portal" : "/dashboard";

export const issuesQuery = queryOptions({
  queryKey: ["issues"],
  queryFn: async () => unwrap(await supabase.from("issues").select("*, tenant:tenants(name, unit), property:properties(name)").order("created_at", { ascending: false })),
});
export const announcementsQuery = queryOptions({
  queryKey: ["announcements"],
  queryFn: async () => unwrap(await supabase.from("announcements").select("*, property:properties(name)").order("created_at", { ascending: false }).limit(100)),
});
export const staffQuery = queryOptions({
  queryKey: ["staff"],
  queryFn: async () => unwrap(await supabase.from("property_staff").select("*").order("created_at")),
});
export const myTenancyQuery = queryOptions({
  queryKey: ["my-tenancy"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const r = await supabase.from("tenants").select("*, property:properties(name, location)").eq("user_id", u.user!.id).maybeSingle();
    if (r.error) throw new Error(r.error.message);
    return r.data;
  },
});

export type Portal = "landlord" | "caretaker" | "tenant";
/** Each sign-in page only admits its own role. */
export const allowedOnPortal = (roles: string[], portal: Portal) => roles.includes(portal);

// FIXED: Point caretaker to the dashboard route
export const portalHome = (portal: Portal) => (portal === "caretaker" ? "/caretaker/dashboard" : portal === "tenant" ? "/portal" : "/dashboard");

export const documentsQuery = queryOptions({
  queryKey: ["documents"],
  queryFn: async () => unwrap(await supabase.from("documents").select("*").order("created_at", { ascending: false })),
});

/** Use in beforeLoad: send users who lack the role to their own home. */
export async function requireRole(qc: import("@tanstack/react-query").QueryClient, role: "landlord" | "caretaker" | "tenant") {
  const roles = await qc.ensureQueryData(rolesQuery);
  if (!roles.includes(role)) {
    const { redirect } = await import("@tanstack/react-router");
    const home = homeFor(roles);
    throw redirect({ to: home === "/dashboard" && role === "landlord" ? "/auth" : home });
  }
}