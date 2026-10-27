import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as useQueryClient, r as useSuspenseQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as issuesQuery, l as myTenancyQuery, n as announcementsQuery, o as kes, r as documentsQuery, s as monthlyDue, u as paymentsQuery } from "./data-BeWW2Avz.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as FileText, E as Droplets, V as Bell, _ as LogOut, b as House, k as CreditCard, r as Wrench, s as Upload, y as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { i as StatusPill, n as EmptyState, r as Panel } from "./AppShell-CO8M4S7x.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-Cgxs2pCk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SimpleShell({ portal, title, subtitle, children }) {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const signOut = async () => {
		await qc.cancelQueries();
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error(error.message);
			return;
		}
		qc.clear();
		navigate({
			to: portal.startsWith("Caretaker") ? "/caretaker-login" : portal.startsWith("Tenant") ? "/tenant-login" : "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#f7f4eb] text-[#17261c]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "bg-[#0c2918] text-[#f7f4eb]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, {
							"aria-hidden": "true",
							className: "h-5 w-5"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-serif text-lg font-semibold",
							children: "RentDesk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-[#aebcaf]",
							children: portal
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: signOut,
					className: "h-9 border-white/20 bg-transparent text-xs text-[#f7f4eb] shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
						"aria-hidden": "true",
						className: "h-4 w-4"
					}), "Sign out"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl p-4 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl font-semibold tracking-tight text-[#17261c] sm:text-[2.4rem]",
					children: title
				}),
				subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-[#69746c]",
					children: subtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children
				})
			]
		})]
	});
}
function IssueBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2.5 py-1 text-xs font-semibold ${{
			open: "bg-danger-soft text-destructive",
			in_progress: "bg-warning-soft text-warning",
			resolved: "bg-success-soft text-success"
		}[status] ?? ""}`,
		children: status.replace("_", " ")
	});
}
var DOC_KINDS = {
	lease: "Lease agreement",
	id: "National ID",
	other: "Other"
};
var PREFIX = "tenant-docs:";
async function openDoc(url) {
	if (!url.startsWith(PREFIX)) {
		window.open(url, "_blank", "noopener");
		return;
	}
	const { data, error } = await supabase.storage.from("Documents").createSignedUrl(url.slice(12), 300);
	if (error) {
		toast.error(error.message);
		return;
	}
	window.open(data.signedUrl, "_blank", "noopener");
}
function DocRow({ d, extra }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between gap-3 py-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex min-w-0 items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate font-medium",
					children: d.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block text-xs text-muted-foreground",
					children: [
						DOC_KINDS[d.kind ?? "other"] ?? "Other",
						extra ? ` · ${extra}` : "",
						" · ",
						new Date(d.created_at).toLocaleDateString("en-KE")
					]
				})]
			})]
		}), d.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "link",
			size: "sm",
			onClick: () => openDoc(d.url),
			children: "Open"
		})]
	});
}
function TenantUpload({ tenantId, propertyId }) {
	const qc = useQueryClient();
	const [kind, setKind] = (0, import_react.useState)("lease");
	const [file, setFile] = (0, import_react.useState)(null);
	const up = useMutation({
		mutationFn: async () => {
			if (!file) throw new Error("Choose a file first");
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) throw new Error("You must be logged in to upload documents.");
			const path = `${tenantId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
			const s = await supabase.storage.from("Documents").upload(path, file, { upsert: false });
			if (s.error) throw new Error(`Storage Error: ${s.error.message}`);
			const { error } = await supabase.from("documents").insert({
				owner_id: user.id,
				property_id: propertyId,
				tenant_id: tenantId,
				kind,
				title: `${DOC_KINDS[kind]} — ${file.name}`,
				url: PREFIX + path
			});
			if (error) throw new Error(`Database Error: ${error.message}`);
		},
		onSuccess: () => {
			toast.success("Document uploaded — your caretaker can now see it");
			setFile(null);
			qc.invalidateQueries({ queryKey: ["documents"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 grid gap-2 rounded-xl border bg-muted/40 p-3 sm:grid-cols-[160px_minmax(0,1fr)_auto]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: kind,
				onValueChange: setKind,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(DOC_KINDS).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: k,
					children: v
				}, k)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "file",
				accept: ".pdf,image/*",
				onChange: (e) => setFile(e.target.files?.[0] ?? null)
			}, file ? "f" : "e"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: up.isPending,
				onClick: () => up.mutate(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-2" }), up.isPending ? "Uploading…" : "Upload"]
			})
		]
	});
}
var tabs = [
	{
		id: "overview",
		label: "Arrears",
		icon: LayoutDashboard
	},
	{
		id: "water",
		label: "Water",
		icon: Droplets
	},
	{
		id: "payments",
		label: "Payments",
		icon: CreditCard
	},
	{
		id: "issues",
		label: "Issues",
		icon: Wrench
	},
	{
		id: "documents",
		label: "Documents",
		icon: FileText
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: Bell
	}
];
function Portal() {
	const { data: me } = useSuspenseQuery(myTenancyQuery);
	const { data: news } = useSuspenseQuery(announcementsQuery);
	const { data: issues } = useSuspenseQuery(issuesQuery);
	const { data: payments } = useSuspenseQuery(paymentsQuery);
	const { data: docs } = useSuspenseQuery(documentsQuery);
	const qc = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [title, setTitle] = (0, import_react.useState)("");
	const [desc, setDesc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel("tenant-live").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "announcements"
		}, () => qc.invalidateQueries({ queryKey: ["announcements"] })).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "issues"
		}, () => qc.invalidateQueries({ queryKey: ["issues"] })).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [qc]);
	const report = useMutation({
		mutationFn: async () => {
			if (!me || !title.trim()) throw new Error("Describe the issue briefly");
			const { error } = await supabase.from("issues").insert({
				owner_id: "00000000-0000-0000-0000-000000000000",
				property_id: me.property_id,
				tenant_id: me.id,
				title: title.trim(),
				description: desc.trim()
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			toast.success("Issue sent to your caretaker");
			setTitle("");
			setDesc("");
			qc.invalidateQueries({ queryKey: ["issues"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!me) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleShell, {
		portal: "Tenant portal",
		title: "Welcome",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: "Your account isn't linked to a unit yet. Ask your caretaker to add your email to your tenant record." }) })
	});
	const balance = Number(me.balance);
	const water = Number(me.water_balance || 0);
	const currentWaterBill = Number(me.water || 0);
	const currentGarbage = Number(me.garbage || 0);
	const currentRent = Number(me.rent || 0);
	const waterUnitsUsed = currentWaterBill / 150;
	const notifications = [...news.map((a) => ({
		id: "a" + a.id,
		when: a.created_at,
		title: a.title,
		body: a.body,
		kind: "Notice"
	})), ...issues.filter((i) => i.status !== "open").map((i) => ({
		id: "i" + i.id,
		when: i.created_at,
		title: `Your issue "${i.title}" is ${i.status.replace("_", " ")}`,
		body: "",
		kind: "Issue update"
	}))].sort((a, b) => b.when.localeCompare(a.when));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleShell, {
		portal: "Tenant portal",
		title: `Habari, ${me.name.split(" ")[0]}`,
		subtitle: `${me.property?.name} · Unit ${me.unit}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 flex gap-1 overflow-x-auto rounded-xl border bg-card p-1",
				children: tabs.map(({ id, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(id),
					className: `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm ${tab === id ? "bg-primary-soft font-semibold text-primary" : "text-muted-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
						label,
						id === "notifications" && notifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary px-1.5 text-xs text-primary-foreground",
							children: notifications.length
						})
					]
				}, id))
			}),
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Total Arrears",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl font-semibold",
							children: kes(balance)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { balance })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Total amount still owed on your account (including previous months)."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "This Month's Bill Breakdown",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Rent"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: kes(currentRent)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center bg-blue-50/50 p-2 rounded-md -mx-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-blue-700 flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Water Bill" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-blue-500",
										children: [
											"(",
											waterUnitsUsed,
											" units @ KES 150/unit)"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium text-blue-700",
									children: kes(currentWaterBill)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-muted-foreground flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Garbage / Trash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground/70",
										children: "(Fixed monthly fee)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: kes(currentGarbage)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-t pt-3 font-semibold text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total Due This Month" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: kes(monthlyDue(me)) })]
							})
						]
					})
				})]
			}),
			tab === "water" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Water Details",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl font-semibold",
							children: kes(water)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { balance: water })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "This is your total unpaid water balance."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 p-4 bg-muted rounded-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold mb-2",
								children: "How your water is billed:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"We charge ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "KES 150 per unit" }),
									" (cubic meter) of water used."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-background p-2 rounded border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-xs",
										children: "Units Used This Month"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [waterUnitsUsed, " units"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-background p-2 rounded border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-xs",
										children: "Current Water Bill"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: kes(currentWaterBill) })]
								})]
							})
						]
					})
				]
			}),
			tab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "My payments",
				children: payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: "No payments recorded yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y",
					children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: p.method
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								p.ref || "—",
								" · ",
								p.paid_on
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-success",
							children: kes(Number(p.amount))
						})]
					}, p.id))
				})
			}),
			tab === "issues" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Report an issue",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "e.g. Leaking kitchen tap",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 4,
							placeholder: "Details (optional)",
							value: desc,
							onChange: (e) => setDesc(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: report.isPending,
							onClick: () => report.mutate(),
							children: "Send to caretaker"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 divide-y",
					children: issues.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: i.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: new Date(i.created_at).toLocaleDateString("en-KE")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueBadge, { status: i.status })]
					}, i.id))
				})]
			}),
			tab === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Documents",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenantUpload, {
					tenantId: me.id,
					propertyId: me.property_id
				}), docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: "No documents yet. Upload your lease agreement and ID above." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocRow, { d }, d.id))
				})]
			}),
			tab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Notifications",
				children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { text: "No notifications right now." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border-l-4 border-primary bg-primary-soft p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-primary",
								children: n.kind
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: new Date(n.when).toLocaleString("en-KE")
							}),
							n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap text-sm",
								children: n.body
							})
						]
					}, n.id))
				})
			})
		]
	});
}
//#endregion
export { Portal as component };
