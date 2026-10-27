import { t as supabase } from "./client-C382HBve.mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-BeWW2Avz.js
var unwrap = (r) => {
	if (r.error) throw new Error(r.error.message);
	return r.data;
};
var profileQuery = queryOptions({
	queryKey: ["profile"],
	queryFn: async () => {
		const { data: u } = await supabase.auth.getUser();
		const r = await supabase.from("profiles").select("full_name").eq("id", u.user.id).maybeSingle();
		if (r.error) throw new Error(r.error.message);
		return r.data;
	}
});
var propertiesQuery = queryOptions({
	queryKey: ["properties"],
	queryFn: async () => unwrap(await supabase.from("properties").select("*").order("name"))
});
var tenantsQuery = queryOptions({
	queryKey: ["tenants"],
	queryFn: async () => unwrap(await supabase.from("tenants").select("*, property:properties(name)").order("name"))
});
var paymentsQuery = queryOptions({
	queryKey: ["payments"],
	queryFn: async () => unwrap(await supabase.from("payments").select("*, tenant:tenants(name, unit, property:properties(name))").order("paid_on", { ascending: false }).order("created_at", { ascending: false }).limit(500))
});
var kes = (n) => "KES " + Math.round(n).toLocaleString("en-KE");
var monthlyDue = (t) => Number(t.rent) + Number(t.water) + Number(t.garbage);
/** Collected per month (last 6), billed = current monthly charges for each month. */
function monthlySeries(payments, billedPerMonth, now = /* @__PURE__ */ new Date()) {
	const out = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		const collected = payments.filter((p) => p.paid_on.startsWith(key)).reduce((s, p) => s + Number(p.amount), 0);
		out.push({
			month: d.toLocaleString("en-KE", { month: "short" }),
			billed: billedPerMonth,
			collected
		});
	}
	return out;
}
var rolesQuery = queryOptions({
	queryKey: ["roles"],
	queryFn: async () => {
		const r = await supabase.from("user_roles").select("role");
		if (r.error) throw new Error(r.error.message);
		return r.data.map((x) => x.role);
	}
});
/** Landlord wins, then caretaker, then tenant. */
var homeFor = (roles) => roles.includes("landlord") ? "/dashboard" : roles.includes("caretaker") ? "/caretaker/dashboard" : roles.includes("tenant") ? "/portal" : "/dashboard";
var issuesQuery = queryOptions({
	queryKey: ["issues"],
	queryFn: async () => unwrap(await supabase.from("issues").select("*, tenant:tenants(name, unit), property:properties(name)").order("created_at", { ascending: false }))
});
var announcementsQuery = queryOptions({
	queryKey: ["announcements"],
	queryFn: async () => unwrap(await supabase.from("announcements").select("*, property:properties(name)").order("created_at", { ascending: false }).limit(100))
});
queryOptions({
	queryKey: ["staff"],
	queryFn: async () => unwrap(await supabase.from("property_staff").select("*").order("created_at"))
});
var myTenancyQuery = queryOptions({
	queryKey: ["my-tenancy"],
	queryFn: async () => {
		const { data: u } = await supabase.auth.getUser();
		const r = await supabase.from("tenants").select("*, property:properties(name, location)").eq("user_id", u.user.id).maybeSingle();
		if (r.error) throw new Error(r.error.message);
		return r.data;
	}
});
/** Each sign-in page only admits its own role. */
var allowedOnPortal = (roles, portal) => roles.includes(portal);
var portalHome = (portal) => portal === "caretaker" ? "/caretaker/dashboard" : portal === "tenant" ? "/portal" : "/dashboard";
var documentsQuery = queryOptions({
	queryKey: ["documents"],
	queryFn: async () => unwrap(await supabase.from("documents").select("*").order("created_at", { ascending: false }))
});
/** Use in beforeLoad: send users who lack the role to their own home. */
async function requireRole(qc, role) {
	const roles = await qc.ensureQueryData(rolesQuery);
	if (!roles.includes(role)) {
		const { redirect } = await import("../_libs/@tanstack/react-router+[...].mjs").then((n) => n.d);
		const home = homeFor(roles);
		throw redirect({ to: home === "/dashboard" && role === "landlord" ? "/auth" : home });
	}
}
//#endregion
export { issuesQuery as a, monthlySeries as c, portalHome as d, profileQuery as f, tenantsQuery as g, rolesQuery as h, homeFor as i, myTenancyQuery as l, requireRole as m, announcementsQuery as n, kes as o, propertiesQuery as p, documentsQuery as r, monthlyDue as s, allowedOnPortal as t, paymentsQuery as u };
