import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { g as tenantsQuery, o as kes, s as monthlyDue } from "./data-BeWW2Avz.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { f as Search } from "../_libs/lucide-react.mjs";
import { i as StatusPill, n as EmptyState, r as Panel, t as AppShell } from "./AppShell-CO8M4S7x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-Cxa4HDFe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Tenants() {
	const { data: tenants } = useSuspenseQuery(tenantsQuery);
	const [q, setQ] = (0, import_react.useState)("");
	const list = tenants.filter((t) => `${t.name} ${t.unit} ${t.property?.name}`.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Tenants",
		subtitle: `${tenants.length} active tenants`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full sm:w-72",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "pl-9",
				placeholder: "Search name, unit, property",
				value: q,
				onChange: (e) => setQ(e.target.value)
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "overflow-x-auto p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[760px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Tenant",
						"Property / Unit",
						"Rent",
						"Water",
						"Garbage",
						"Monthly",
						"Balance",
						"Status"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-semibold",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y",
					children: list.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-muted/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: t.phone
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [
									t.property?.name,
									" · ",
									t.unit
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: kes(Number(t.rent))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: kes(Number(t.water))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: kes(Number(t.garbage))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold",
								children: kes(monthlyDue(t))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold",
								children: kes(Number(t.balance))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { balance: Number(t.balance) })
							})
						]
					}, t.id))
				})]
			}), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: q ? `No tenants match “${q}”.` : "No tenants yet." })]
		})
	});
}
//#endregion
export { Tenants as component };
