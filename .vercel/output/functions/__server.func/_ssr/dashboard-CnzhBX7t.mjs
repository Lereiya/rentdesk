import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { c as monthlySeries, f as profileQuery, g as tenantsQuery, o as kes, p as propertiesQuery, s as monthlyDue, u as paymentsQuery } from "./data-BeWW2Avz.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Building2, D as DoorOpen, H as ArrowUpRight, L as CalendarDays, a as Users, c as TriangleAlert, g as MapPin, i as Wallet, k as CreditCard } from "../_libs/lucide-react.mjs";
import { n as EmptyState, r as Panel, t as AppShell } from "./AppShell-CO8M4S7x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CnzhBX7t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const { data: profile } = useSuspenseQuery(profileQuery);
	const { data: properties } = useSuspenseQuery(propertiesQuery);
	const { data: tenants } = useSuspenseQuery(tenantsQuery);
	const { data: payments } = useSuspenseQuery(paymentsQuery);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(() => {
		const now = /* @__PURE__ */ new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	});
	const expected = tenants.reduce((sum, tenant) => sum + monthlyDue(tenant), 0);
	const collected = payments.filter((payment) => payment.paid_on.startsWith(selectedMonth)).reduce((sum, payment) => sum + Number(payment.amount), 0);
	const totalArrears = tenants.reduce((sum, tenant) => sum + Math.max(Number(tenant.balance), 0), 0);
	const totalUnits = properties.reduce((sum, property) => sum + Number(property.units), 0);
	const occupiedUnits = properties.reduce((sum, property) => sum + Number(property.occupied), 0);
	const occupancy = totalUnits > 0 ? Math.round(occupiedUnits / totalUnits * 100) : 0;
	const rentSeries = monthlySeries(payments, tenants.reduce((sum, tenant) => sum + monthlyDue(tenant), 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: `Habari, ${profile?.full_name || "Landlord"}`,
		subtitle: "Your portfolio, in good order. Here's the month at a glance.",
		eyebrow: "Portfolio overview  /  Kenya",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full sm:w-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
				"aria-hidden": "true",
				className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#315d40]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "month",
				"aria-label": "Select month for portfolio totals",
				value: selectedMonth,
				onChange: (event) => setSelectedMonth(event.target.value),
				className: "month-picker h-10 w-full min-w-0 shrink-0 rounded-xl border-[#e5dfd3] bg-[#fffefa] pl-9 pr-10 text-sm text-[#36463a] focus-visible:ring-[#145632] sm:w-[204px]"
			})]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#69746c]",
					children: "This month at a glance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "h-px flex-1 bg-[#e6e0d4]"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Collected this month",
						value: kes(collected),
						detail: `${expected > 0 ? Math.round(collected / expected * 100) : 0}% of ${kes(expected)}`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, {
							"aria-hidden": "true",
							className: "h-4 w-4"
						}),
						iconClass: "bg-[#dcecdf] text-[#24613a]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Outstanding arrears",
						value: kes(totalArrears),
						detail: `${tenants.filter((tenant) => Number(tenant.balance) > 0).length} tenants`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
							"aria-hidden": "true",
							className: "h-4 w-4"
						}),
						iconClass: "bg-[#fbe6e3] text-[#bd4d44]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Occupancy",
						value: `${occupancy}%`,
						detail: `${occupiedUnits} of ${totalUnits} units`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorOpen, {
							"aria-hidden": "true",
							className: "h-4 w-4"
						}),
						iconClass: "bg-[#f4e9dc] text-[#9b6840]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Properties",
						value: String(properties.length),
						detail: `${tenants.length} tenants`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
							"aria-hidden": "true",
							className: "h-4 w-4"
						}),
						iconClass: "bg-[#e4ece8] text-[#527566]"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mb-8 p-5 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl font-semibold text-[#17261c]",
						children: "Rent, received"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-[#69746c]",
						children: "Billed and collected over the last six months"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 text-[11px] text-[#69746c]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#145632]" }), "Collected"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 border-t border-dashed border-[#aa9270]" }), "Billed"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RentReceivedChart, { data: rentSeries })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold text-slate-900",
						children: "Your properties"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-slate-500",
						children: "A quick view of the homes under your management."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/properties",
						className: "hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700",
						children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
					})]
				}), properties.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: "Your properties will appear here once added." }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
					children: properties.map((property) => {
						const propertyTenants = tenants.filter((t) => t.property_id === property.id);
						const propertyArrears = propertyTenants.reduce((sum, t) => sum + Math.max(Number(t.balance), 0), 0);
						const occupancy = property.units ? Math.round(property.occupied / property.units * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-4 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-3 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "truncate text-base font-bold text-slate-900",
											children: property.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 flex items-center gap-1.5 text-sm text-slate-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: property.location || "Location not provided"
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600",
									children: [
										property.occupied,
										"/",
										property.units,
										" occupied"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-slate-100 px-5 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2 text-slate-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Tenants"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-slate-800",
											children: propertyTenants.length
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4 flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2 text-slate-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }), " Outstanding"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-semibold ${propertyArrears > 0 ? "text-red-600" : "text-emerald-600"}`,
											children: kes(propertyArrears)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 overflow-hidden rounded-full bg-slate-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-blue-500 transition-all",
											style: { width: `${Math.min(occupancy, 100)}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-slate-400",
										children: [occupancy, "% occupancy"]
									})
								]
							})]
						}, property.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Recent Payments",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-slate-500",
						children: "Latest rent payments recorded across your properties."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/payments",
						className: "inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700",
						children: ["All payments ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
					})]
				}), payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: "Recent payments will appear here when received." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-slate-100",
					children: payments.slice(0, 6).map((payment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold text-slate-900",
									children: payment.tenant?.name || "Tenant payment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 truncate text-xs text-slate-500",
									children: [
										"Unit ",
										payment.tenant?.unit || "—",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1",
											children: "·"
										}),
										payment.method,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1",
											children: "·"
										}),
										new Date(payment.paid_on).toLocaleDateString("en-KE", {
											day: "numeric",
											month: "short",
											year: "numeric"
										})
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-bold text-emerald-600",
								children: ["+", kes(Number(payment.amount))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-slate-400",
								children: payment.ref || "Payment received"
							})]
						})]
					}, payment.id))
				})]
			})
		]
	});
}
function MetricCard({ label, value, detail, icon, iconClass }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		className: "min-h-[112px] p-4 sm:p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-[#69746c]",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-serif text-[26px] font-medium leading-none text-[#17261c]",
						children: value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 truncate text-[11px] text-[#69746c]",
						children: detail
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `grid h-8 w-8 shrink-0 place-items-center rounded-full ${iconClass}`,
				children: icon
			})]
		})
	});
}
function RentReceivedChart({ data }) {
	const maximum = Math.max(0, ...data.flatMap((month) => [month.billed, month.collected]));
	if (maximum === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: "Rent activity will appear here once billing or payments are recorded." });
	const width = 760;
	const height = 220;
	const left = 44;
	const right = 12;
	const top = 10;
	const bottom = 32;
	const plotWidth = width - left - right;
	const plotHeight = height - top - bottom;
	const x = (index) => left + plotWidth * index / Math.max(data.length - 1, 1);
	const y = (value) => 188 - value / maximum * plotHeight;
	const collectedPoints = data.map((month, index) => `${x(index)},${y(month.collected)}`).join(" ");
	const billedPoints = data.map((month, index) => `${x(index)},${y(month.billed)}`).join(" ");
	const ticks = [
		0,
		maximum / 2,
		maximum
	];
	const compact = new Intl.NumberFormat("en-KE", {
		notation: "compact",
		maximumFractionDigits: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		role: "img",
		"aria-labelledby": "rent-chart-title rent-chart-description",
		viewBox: `0 0 ${width} ${height}`,
		className: "h-52 w-full overflow-visible",
		preserveAspectRatio: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", {
				id: "rent-chart-title",
				children: "Rent received over the last six months"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("desc", {
				id: "rent-chart-description",
				children: "Monthly collected payments compared with the current monthly amount billed."
			}),
			ticks.map((tick) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: left,
				x2: width - right,
				y1: y(tick),
				y2: y(tick),
				stroke: "#e9e3d8",
				strokeDasharray: "3 4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: left - 8,
				y: y(tick) + 4,
				textAnchor: "end",
				fill: "#7a827b",
				fontSize: "10",
				children: compact.format(tick)
			})] }, tick)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				points: billedPoints,
				fill: "none",
				stroke: "#aa9270",
				strokeDasharray: "5 4",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				points: collectedPoints,
				fill: "none",
				stroke: "#145632",
				strokeLinejoin: "round",
				strokeLinecap: "round",
				strokeWidth: "2.5"
			}),
			data.map((month, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: x(index),
				cy: y(month.collected),
				r: "3",
				fill: "#145632",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${month.month}: ${kes(month.collected)} collected` })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x(index),
				y: height - 8,
				textAnchor: "middle",
				fill: "#69746c",
				fontSize: "10",
				children: month.month
			})] }, month.month))
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
		className: "sr-only",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", { children: "Rent billed and collected over the last six months" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "col",
					children: "Month"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "col",
					children: "Billed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "col",
					children: "Collected"
				})
			] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((month) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "row",
					children: month.month
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: kes(month.billed) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: kes(month.collected) })
			] }, month.month)) })
		]
	})] });
}
//#endregion
export { Overview as component };
