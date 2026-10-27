import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Building2, U as ArrowRight, t as Zap, u as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-QCbAfwDn.js
var import_jsx_runtime = require_jsx_runtime();
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#f7f4eb] text-[#17261c]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-10 border-b border-[#e6e0d4] bg-[#0c2918]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Main navigation",
					className: "mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-7 lg:px-9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						"aria-label": "RentDesk home",
						className: "flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								"aria-hidden": "true",
								className: "h-5 w-5"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-lg font-semibold text-[#f7f4eb] sm:text-xl",
							children: "RentDesk"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex shrink-0 items-center gap-2 sm:gap-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "h-9 rounded-lg bg-[#d6aa59] px-3 text-xs font-semibold text-[#173c27] shadow-none hover:bg-[#e1ba70] focus-visible:ring-[#d6aa59] sm:px-4 sm:text-sm",
								children: "Sign in"
							})
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-7 sm:pt-20 lg:px-9 lg:pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#315d40]",
							children: "Property desk / Kenya"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-[#17261c] sm:text-5xl lg:text-6xl",
							children: ["Property management,", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[#315d40]",
								children: "in good order."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-2xl text-base leading-7 text-[#69746c] sm:text-lg",
							children: "Manage tenants, track rent and arrears, record payments, and keep property teams and residents connected from one considered workspace."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 flex flex-wrap items-center gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "h-11 rounded-lg bg-[#145632] px-5 font-semibold text-white shadow-none hover:bg-[#104728] focus-visible:ring-[#145632]",
									children: ["Get started ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										"aria-hidden": "true",
										className: "ml-1 h-4 w-4"
									})]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": "RentDesk features",
					className: "mt-14 grid gap-4 md:mt-20 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
								"aria-hidden": "true",
								className: "h-5 w-5"
							}),
							title: "Rent collection",
							description: "Record M-Pesa, bank and cash payments, and keep an up-to-date view of balances."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
								"aria-hidden": "true",
								className: "h-5 w-5"
							}),
							title: "Tenant support",
							description: "Give residents a dedicated place to review their charges and report maintenance issues."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								"aria-hidden": "true",
								className: "h-5 w-5"
							}),
							title: "Property operations",
							description: "Coordinate property teams and tenant records across the homes you manage."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-[#e6e0d4] px-4 py-5 text-center text-xs text-[#69746c]",
				children: "RentDesk · Property management in Kenya"
			})
		]
	});
}
function FeatureCard({ icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl border border-[#e5dfd3] bg-[#fffefa] p-5 shadow-[0_2px_8px_rgba(27,42,30,0.06)] sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-5 grid h-10 w-10 place-items-center rounded-full bg-[#e4ece4] text-[#315d40]",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl font-semibold text-[#17261c]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-[#69746c]",
				children: description
			})
		]
	});
}
//#endregion
export { LandingPage as component };
