import { t as supabase } from "./client-C382HBve.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Building2, _ as LogOut, a as Users, k as CreditCard, y as LayoutDashboard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-CO8M4S7x.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/dashboard",
		label: "Overview",
		icon: LayoutDashboard
	},
	{
		to: "/properties",
		label: "Properties",
		icon: Building2
	},
	{
		to: "/tenants",
		label: "Tenants",
		icon: Users
	},
	{
		to: "/payments",
		label: "Payments",
		icon: CreditCard
	}
];
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
		navigate({
			to: "/auth",
			replace: true
		});
	};
}
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center ${compact ? "gap-2" : "gap-3"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
				"aria-hidden": "true",
				className: "h-5 w-5"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-serif text-lg font-semibold leading-tight text-[#f7f4eb]",
			children: "RentDesk"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 block text-[9px] font-semibold tracking-[0.18em] text-[#a6b5a8]",
			children: "PROPERTY DESK"
		})] })]
	});
}
function AppShell({ title, subtitle, eyebrow, actions, children }) {
	const signOut = useSignOut();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-[#f7f4eb] text-[#17261c]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-44 shrink-0 flex-col bg-[#0c2918] px-4 py-5 min-[700px]:flex lg:w-60 lg:px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					"aria-label": "RentDesk overview",
					className: "mb-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa193]",
					children: "Workspace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Workspace",
					className: "space-y-1",
					children: nav.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						className: "flex items-center gap-3 rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-[#c2cec4] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]",
						activeProps: { className: "flex items-center gap-3 rounded-xl border-l-2 border-[#d6aa59] bg-[#1d3b28] px-3 py-2.5 text-sm font-semibold text-[#f7f4eb]" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							"aria-hidden": "true",
							className: "h-4 w-4 shrink-0"
						}), label]
					}, to))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "hidden min-h-14 items-center justify-end border-b border-[#e6e0d4] bg-[#fffefa] px-6 min-[700px]:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: signOut,
						className: "h-9 rounded-lg border-[#e5dfd3] bg-transparent text-xs font-medium text-[#36463a] shadow-none hover:bg-[#f1ece2] hover:text-[#145632] focus-visible:ring-[#145632]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
							"aria-hidden": "true",
							className: "h-4 w-4"
						}), "Sign out"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-[#e6e0d4] bg-[#0c2918] px-4 py-3 min-[700px]:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						"aria-label": "RentDesk overview",
						className: "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Sign out",
						onClick: signOut,
						className: "text-[#f7f4eb] hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
							"aria-hidden": "true",
							className: "h-4 w-4"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Workspace",
					className: "flex gap-1 overflow-x-auto border-b border-[#e6e0d4] bg-[#0c2918] px-3 pb-3 min-[700px]:hidden",
					children: nav.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						className: "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#c2cec4] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]",
						activeProps: { className: "flex shrink-0 items-center gap-2 rounded-lg bg-[#1d3b28] px-3 py-2 text-sm font-semibold text-[#f7f4eb]" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							"aria-hidden": "true",
							className: "h-4 w-4"
						}), label]
					}, to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-9 lg:py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "mb-7 flex flex-col gap-4 border-b border-[#e6e0d4] pb-5 sm:flex-row sm:items-end sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#315d40]",
										children: eyebrow
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-serif text-3xl font-semibold leading-tight tracking-tight text-[#17261c] sm:text-[2.4rem]",
										children: title
									}),
									subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-[#69746c]",
										children: subtitle
									})
								]
							}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex min-w-0 flex-wrap items-center gap-2 sm:justify-end",
								children: actions
							})]
						}), children]
					})
				})
			]
		})]
	});
}
function Panel({ title, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-2xl border border-[#e5dfd3] bg-[#fffefa] p-5 shadow-[0_2px_8px_rgba(27,42,30,0.06)] ${className}`,
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 font-serif text-xl font-semibold text-[#17261c]",
			children: title
		}), children]
	});
}
function StatusPill({ balance }) {
	if (balance <= 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700",
		children: "Paid up"
	});
	if (balance < 1e4) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700",
		children: "Partial"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700",
		children: "In arrears"
	});
}
function EmptyState({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-center text-sm text-[#69746c]",
		children: text
	});
}
//#endregion
export { StatusPill as i, EmptyState as n, Panel as r, AppShell as t };
