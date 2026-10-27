import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Clock3, B as Building2, E as Droplets, H as ArrowUpRight, N as CircleAlert, _ as LogOut, b as House, d as Send, j as CircleCheck, l as Trash2, r as Wrench } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenant.dashboard-Dh8UjJL5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var money = (amount) => `KES ${Math.round(amount).toLocaleString("en-KE")}`;
function statusStyle(status) {
	switch (status.toLowerCase()) {
		case "resolved": return {
			label: "Resolved",
			className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
			Icon: CircleCheck
		};
		case "in progress":
		case "in_progress": return {
			label: "In progress",
			className: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
			Icon: Clock3
		};
		default: return {
			label: "Open",
			className: "bg-rose-50 text-rose-700 ring-rose-600/15",
			Icon: CircleAlert
		};
	}
}
function TenantPortal() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [tenant, setTenant] = (0, import_react.useState)(null);
	const [issues, setIssues] = (0, import_react.useState)([]);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [newIssue, setNewIssue] = (0, import_react.useState)({
		title: "",
		description: ""
	});
	const fetchTenantData = (0, import_react.useCallback)(async () => {
		try {
			const { data: authData, error: authError } = await supabase.auth.getUser();
			if (authError) throw authError;
			if (!authData.user) {
				await navigate({ to: "/tenant-login" });
				return;
			}
			const { data: tenantData, error: tenantError } = await supabase.from("tenants").select("*, property:properties(name, location)").eq("user_id", authData.user.id).maybeSingle();
			if (tenantError) throw tenantError;
			if (!tenantData) {
				setTenant(null);
				return;
			}
			setTenant(tenantData);
			const { data: issueData, error: issueError } = await supabase.from("issues").select("*").eq("tenant_id", tenantData.id).order("created_at", { ascending: false });
			if (issueError) throw issueError;
			setIssues(issueData ?? []);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not load your tenant portal.");
		} finally {
			setLoading(false);
		}
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		fetchTenantData();
	}, [fetchTenantData]);
	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error(error.message);
			return;
		}
		await navigate({ to: "/tenant-login" });
	};
	const handleReportIssue = async (event) => {
		event.preventDefault();
		if (!tenant) return;
		setSubmitting(true);
		const { error } = await supabase.from("issues").insert({
			tenant_id: tenant.id,
			property_id: tenant.property_id,
			title: newIssue.title.trim(),
			description: newIssue.description.trim(),
			status: "open"
		});
		setSubmitting(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Your maintenance issue has been reported.");
		setNewIssue({
			title: "",
			description: ""
		});
		await fetchTenantData();
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-slate-500",
			children: "Loading your tenant portal…"
		})
	});
	if (!tenant) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-md rounded-2xl border border-[#e5dfd3] bg-[#fffefa] p-8 text-center shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-serif text-lg font-semibold text-[#17261c]",
					children: "Tenant profile unavailable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-slate-500",
					children: "We couldn’t find a tenant record linked to this account. Please contact your caretaker."
				})
			]
		})
	});
	const totalDue = Number(tenant.rent) + Number(tenant.water) + Number(tenant.garbage);
	const balance = Number(tenant.balance);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "portal-theme min-h-screen bg-[#f7f4eb] text-[#17261c]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-[#1e422b] bg-[#0c2918]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg font-semibold leading-tight text-[#f7f4eb]",
								children: "RentDesk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "truncate text-sm font-medium tracking-tight text-[#c2cec4] sm:text-base",
								children: ["Habari, ", tenant.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-[#aebcaf]",
								children: [
									"Unit ",
									tenant.unit,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1 text-[#728576]",
										children: "·"
									}),
									tenant.property?.name ?? "Your property"
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: handleLogout,
					className: "h-9 shrink-0 rounded-lg border-white/20 bg-transparent text-xs font-medium text-[#f7f4eb] shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Log out"
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[0.85fr_1.35fr] lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-700 p-6 text-white sm:p-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-indigo-100",
									children: "Your current bill"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-3xl font-bold tracking-tight",
									children: money(balance)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-indigo-100",
									children: "Outstanding balance"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-2xl bg-white/15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-indigo-100",
								children: "Monthly charges"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: money(totalDue)
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 p-5 sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-3 text-sm font-medium text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" })
									}), "Rent"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold tabular-nums",
									children: money(Number(tenant.rent))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-3 text-sm font-medium text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-4 w-4" })
									}), "Water"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold tabular-nums",
									children: money(Number(tenant.water))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-3 text-sm font-medium text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									}), "Garbage"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold tabular-nums",
									children: money(Number(tenant.garbage))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-t border-slate-100 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-slate-500",
									children: "Balance status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-3 py-1 text-xs font-semibold ${balance > 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`,
									children: balance > 0 ? "Payment due" : "Paid up"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-sm transition hover:bg-indigo-700",
								disabled: true,
								title: "M-Pesa payments will be available soon",
								children: ["Pay via M-Pesa", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-2 h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-slate-400",
								children: "Online payments coming soon"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-slate-800",
							children: "Your home, in one place"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-6 text-slate-600",
							children: "Track your balance and stay up to date on maintenance requests from your tenant portal."
						})] })]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold tracking-tight",
							children: "Report a maintenance issue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-slate-500",
							children: "Tell your caretaker what needs attention."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReportIssue,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "issue-title",
									className: "text-sm font-medium text-slate-700",
									children: "Issue title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "issue-title",
									required: true,
									maxLength: 120,
									placeholder: "e.g. Leaking kitchen sink",
									value: newIssue.title,
									onChange: (event) => setNewIssue({
										...newIssue,
										title: event.target.value
									}),
									className: "h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "issue-description",
									className: "text-sm font-medium text-slate-700",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "issue-description",
									required: true,
									rows: 4,
									maxLength: 2e3,
									placeholder: "Describe the problem and where it is happening…",
									value: newIssue.description,
									onChange: (event) => setNewIssue({
										...newIssue,
										description: event.target.value
									}),
									className: "min-h-28 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400",
									children: "Your caretaker will be notified."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: submitting,
									className: "h-10 rounded-xl bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), submitting ? "Sending…" : "Submit issue"]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold tracking-tight",
							children: "My reported issues"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-slate-500",
							children: "Updates from your property team"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600",
							children: issues.length
						})]
					}), issues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-semibold text-slate-700",
								children: "Nothing to track yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-slate-500",
								children: "Your maintenance requests will appear here."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-slate-100",
						children: issues.map((issue) => {
							const status = statusStyle(issue.status);
							const StatusIcon = status.Icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-slate-900",
												children: issue.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 whitespace-pre-line text-sm leading-6 text-slate-500",
												children: issue.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-xs text-slate-400",
												children: new Date(issue.created_at).toLocaleDateString("en-KE", {
													day: "numeric",
													month: "short",
													year: "numeric"
												})
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { className: "h-3.5 w-3.5" }), status.label]
									})]
								})
							}, issue.id);
						})
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { TenantPortal as component };
