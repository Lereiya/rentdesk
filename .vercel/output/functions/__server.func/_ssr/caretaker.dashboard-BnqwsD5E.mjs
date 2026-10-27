import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as FileText, E as Droplets, M as CircleCheckBig, N as CircleAlert, O as DollarSign, R as Calculator, S as FolderOpen, _ as LogOut, a as Users, h as Megaphone, l as Trash2, m as Plus, p as Receipt, r as Wrench, s as Upload, z as Building } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/caretaker.dashboard-BnqwsD5E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CaretakerDashboard() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("tenants");
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [property, setProperty] = (0, import_react.useState)(null);
	const [tenants, setTenants] = (0, import_react.useState)([]);
	const [issues, setIssues] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)({
		collectedThisMonth: 0,
		expectedRentThisMonth: 0,
		totalArrears: 0
	});
	const [financeMonth, setFinanceMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
	const [newTenant, setNewTenant] = (0, import_react.useState)({
		name: "",
		phone: "",
		unit: "",
		rent: 0,
		water: 0,
		garbage: 0
	});
	const [notice, setNotice] = (0, import_react.useState)({
		target: "all",
		title: "",
		content: ""
	});
	const [billingMonth, setBillingMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
	const [waterRates, setWaterRates] = (0, import_react.useState)({});
	const fetchData = async () => {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return navigate({ to: "/caretaker-login" });
			const { data: profileData } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
			if (profileData) setProfile(profileData);
			const { data: staffData, error: staffError } = await supabase.from("property_staff").select("property_id, property:properties(name, location, owner_id)").eq("user_id", user.id).maybeSingle();
			if (staffError) throw new Error(staffError.message);
			if (!staffData) throw new Error(`No property is assigned to ${user.email ?? "this account"}. Ask your landlord to add this exact sign-in account under Properties > Caretaker Portal Access, then sign out and sign in again.`);
			setProperty(staffData.property);
			setLoadError(null);
			const propId = staffData.property_id;
			const { data: tenantData, error: tenantError } = await supabase.from("tenants").select("*").eq("property_id", propId).order("name");
			if (tenantError) throw new Error(tenantError.message);
			if (tenantData) setTenants(tenantData);
			const { data: issueData } = await supabase.from("issues").select("*, tenant:tenants(name)").eq("property_id", propId).order("created_at", { ascending: false });
			if (issueData) setIssues(issueData.map((i) => ({
				...i,
				tenant_name: i.tenant?.name || "Unknown"
			})));
			if (tenantData && tenantData.length > 0) {
				const tenantIds = tenantData.map((t) => t.id);
				const expectedRent = tenantData.reduce((sum, t) => sum + Number(t.rent), 0);
				const totalArrears = tenantData.reduce((sum, t) => sum + Number(t.balance), 0);
				const { data: payments } = await supabase.from("payments").select("amount, paid_on").in("tenant_id", tenantIds).gte("paid_on", `${financeMonth}-01`).lte("paid_on", `${financeMonth}-31`);
				const collected = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
				setStats({
					collectedThisMonth: collected,
					expectedRentThisMonth: expectedRent,
					totalArrears
				});
			}
		} catch (err) {
			console.error("Dashboard fetch error:", err);
			const message = err instanceof Error ? err.message : "Could not load caretaker dashboard.";
			setLoadError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [financeMonth]);
	const handleLogout = async () => {
		await supabase.auth.signOut();
		navigate({ to: "/caretaker-login" });
	};
	const handleAddTenant = async (e) => {
		e.preventDefault();
		if (!property) return;
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return toast.error("Your session expired. Please sign in again.");
		const { data: staffData } = await supabase.from("property_staff").select("property_id").eq("user_id", user.id).single();
		if (!staffData) return toast.error("Could not verify property");
		const { error } = await supabase.from("tenants").insert({
			property_id: staffData.property_id,
			owner_id: property.owner_id,
			name: newTenant.name,
			phone: newTenant.phone,
			unit: newTenant.unit,
			rent: newTenant.rent,
			water: newTenant.water,
			garbage: newTenant.garbage,
			balance: newTenant.rent + newTenant.water + newTenant.garbage
		});
		if (error) return toast.error(error.message);
		toast.success("Tenant added successfully");
		setNewTenant({
			name: "",
			phone: "",
			unit: "",
			rent: 0,
			water: 0,
			garbage: 0
		});
		fetchData();
	};
	const handleDeleteTenant = async (id) => {
		if (!confirm("Are you sure you want to delete this tenant?")) return;
		const { error } = await supabase.from("tenants").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Tenant deleted");
		fetchData();
	};
	const handleResolveIssue = async (id) => {
		await supabase.from("issues").update({ status: "resolved" }).eq("id", id);
		toast.success("Issue marked as resolved");
		fetchData();
	};
	const handleSendNotice = async (e) => {
		e.preventDefault();
		if (!property || !notice.content) return;
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return;
		const { data: staffData } = await supabase.from("property_staff").select("property_id").eq("user_id", user.id).single();
		if (!staffData) return toast.error("Could not verify property ID");
		const { error } = await supabase.from("announcements").insert({
			property_id: staffData.property_id,
			owner_id: property.owner_id,
			author_id: user.id,
			title: notice.title,
			body: notice.content
		});
		if (error) return toast.error(error.message);
		toast.success("Notice sent!");
		setNotice({
			target: "all",
			title: "",
			content: ""
		});
	};
	const handleGenerateBill = async (tenant) => {
		const waterCharge = (waterRates[tenant.id] || 0) * 150;
		const totalBill = Number(tenant.rent) + waterCharge + Number(tenant.garbage);
		const { error: updateError } = await supabase.from("tenants").update({
			water: waterCharge,
			balance: Number(tenant.balance) + totalBill
		}).eq("id", tenant.id);
		if (updateError) return toast.error(updateError.message);
		toast.success(`Bill of KES ${totalBill} generated for ${tenant.name}`);
		setWaterRates({
			...waterRates,
			[tenant.id]: 0
		});
		fetchData();
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] p-10 text-center text-[#69746c]",
		children: "Loading caretaker portal..."
	});
	if (!property) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] p-6 text-center font-medium text-red-700",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-10 w-10 mx-auto mb-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 font-serif text-xl font-bold",
				children: "Dashboard Error"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto max-w-xl text-sm leading-6",
				children: loadError || "Your caretaker property could not be loaded."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: handleLogout,
				className: "mt-6 bg-[#145632] text-white hover:bg-[#104728]",
				children: "Sign out"
			})
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "portal-theme flex min-h-screen flex-col bg-[#f7f4eb] text-[#17261c]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-10 border-b border-[#1e422b] bg-[#0c2918] px-4 py-3 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, {
								className: "h-5 w-5",
								"aria-hidden": "true"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg font-semibold leading-tight text-[#f7f4eb]",
								children: "RentDesk"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "truncate text-sm font-medium text-[#c2cec4]",
								children: [
									property.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1 text-[#8fa193]",
										children: "·"
									}),
									" ",
									profile?.full_name || "Caretaker"
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "h-9 shrink-0 rounded-lg border-white/20 bg-transparent text-xs font-medium text-[#f7f4eb] shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]",
						onClick: handleLogout,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
							"aria-hidden": "true",
							className: "mr-2 h-4 w-4"
						}), "Sign out"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-[#1e422b] bg-[#0c2918] px-3 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-6xl gap-2 overflow-x-auto",
					children: [
						{
							id: "tenants",
							label: "Tenants",
							icon: Users
						},
						{
							id: "billing",
							label: "Monthly Billing",
							icon: Receipt
						},
						{
							id: "finances",
							label: "Finances",
							icon: DollarSign
						},
						{
							id: "issues",
							label: "Maintenance",
							icon: Wrench
						},
						{
							id: "documents",
							label: "Documents",
							icon: FolderOpen
						},
						{
							id: "notices",
							label: "Notices",
							icon: Megaphone
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.id),
						"aria-current": activeTab === tab.id ? "page" : void 0,
						className: `flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d6aa59] sm:text-sm ${activeTab === tab.id ? "border-[#d6aa59] text-[#f7f4eb]" : "border-transparent text-[#aebcaf] hover:text-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "h-4 w-4" }),
							" ",
							tab.label
						]
					}, tab.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6",
				children: [
					activeTab === "tenants" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-lg font-bold text-slate-900 mb-5 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5 text-blue-600" }), " Add Tenant"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleAddTenant,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: newTenant.name,
										onChange: (e) => setNewTenant({
											...newTenant,
											name: e.target.value
										}),
										className: "bg-slate-50"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: newTenant.phone,
										onChange: (e) => setNewTenant({
											...newTenant,
											phone: e.target.value
										}),
										className: "bg-slate-50"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Unit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "e.g. A1",
										value: newTenant.unit,
										onChange: (e) => setNewTenant({
											...newTenant,
											unit: e.target.value
										}),
										className: "bg-slate-50"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												required: true,
												value: newTenant.rent || "",
												onChange: (e) => setNewTenant({
													...newTenant,
													rent: Number(e.target.value)
												}),
												className: "bg-slate-50"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Water" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: newTenant.water || "",
												onChange: (e) => setNewTenant({
													...newTenant,
													water: Number(e.target.value)
												}),
												className: "bg-slate-50"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Garbage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: newTenant.garbage || "",
												onChange: (e) => setNewTenant({
													...newTenant,
													garbage: Number(e.target.value)
												}),
												className: "bg-slate-50"
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "w-full bg-blue-600 hover:bg-blue-700 text-white mt-2",
										children: "Save Tenant"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-bold text-slate-900",
									children: [
										"Registered Tenants (",
										tenants.length,
										")"
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "divide-y divide-slate-100",
								children: [tenants.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-5 flex items-center justify-between hover:bg-slate-50 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-slate-900 flex items-center gap-2",
										children: [
											t.name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md",
												children: ["Unit ", t.unit]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-500 mt-1",
										children: t.phone
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-end gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
												children: "Balance"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: `font-bold ${t.balance > 0 ? "text-red-600" : "text-emerald-600"}`,
												children: ["KES ", t.balance.toLocaleString()]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => handleDeleteTenant(t.id),
											className: "text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-1" }), " Delete"]
										})]
									})]
								}, t.id)), tenants.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "p-10 text-center text-slate-500",
									children: "No tenants found."
								})]
							})]
						})]
					}),
					activeTab === "billing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-bold text-slate-900 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-5 w-5" }), " Monthly Billing"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "Billing Month"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "month",
									value: billingMonth,
									onChange: (e) => setBillingMonth(e.target.value),
									className: "w-40 h-8 text-sm"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-slate-100",
							children: [tenants.map((t) => {
								const units = waterRates[t.id] || 0;
								const waterCost = units * 150;
								const totalBill = Number(t.rent) + waterCost + Number(t.garbage);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-bold text-slate-900 flex items-center gap-2",
												children: [
													t.name,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md",
														children: ["Unit ", t.unit]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-4 mt-2 text-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-slate-500",
														children: ["Rent: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
															className: "text-slate-800",
															children: ["KES ", t.rent]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-slate-500",
														children: ["Garbage: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
															className: "text-slate-800",
															children: ["KES ", t.garbage]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-red-500",
														children: ["Arrears: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["KES ", t.balance] })]
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-xs font-semibold text-blue-800 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-3 w-3" }), " Water Units Used"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												placeholder: "0",
												value: units || "",
												onChange: (e) => setWaterRates({
													...waterRates,
													[t.id]: Number(e.target.value)
												}),
												className: "w-24 h-8 mt-1 bg-white border-blue-200"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-semibold text-blue-600",
													children: "Cost @ 150/unit"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-bold text-blue-900 text-sm",
													children: ["KES ", waterCost.toLocaleString()]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-end gap-2 min-w-[120px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right mb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-semibold text-slate-400 uppercase tracking-wider",
													children: "New Total Due"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-bold text-slate-900 text-lg",
													children: ["KES ", totalBill.toLocaleString()]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: () => handleGenerateBill(t),
												className: "w-full bg-slate-900 hover:bg-slate-800 text-white",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 mr-2" }), " Generate Bill"]
											})]
										})
									]
								}, t.id);
							}), tenants.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-10 text-center text-slate-500",
								children: "No tenants found."
							})]
						})]
					}),
					activeTab === "finances" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold text-slate-900",
								children: "Financial Overview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Month:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "month",
									value: financeMonth,
									onChange: (e) => setFinanceMonth(e.target.value),
									className: "w-40"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2",
											children: "Expected Rent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-3xl font-bold text-slate-900",
											children: ["KES ", stats.expectedRentThisMonth.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400 mt-2",
											children: "Based on monthly rent of all tenants."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2",
											children: "Collected This Month"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-3xl font-bold text-slate-900",
											children: ["KES ", stats.collectedThisMonth.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400 mt-2",
											children: "Only payments received in the selected month."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2",
											children: "Total Arrears"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-3xl font-bold text-slate-900",
											children: ["KES ", stats.totalArrears.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400 mt-2",
											children: "Total unpaid balance across all tenants."
										})
									]
								})
							]
						})]
					}),
					activeTab === "issues" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 border-b border-slate-100 bg-slate-50/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-bold text-slate-900",
								children: "Maintenance Requests"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-slate-100",
							children: [issues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 flex justify-between items-center hover:bg-slate-50 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-slate-900",
									children: issue.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-slate-500 mt-1",
									children: [
										"Reported by: ",
										issue.tenant_name,
										" •",
										" ",
										new Date(issue.created_at).toLocaleDateString()
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${issue.status === "open" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`,
										children: [
											issue.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }),
											" ",
											issue.status.toUpperCase()
										]
									}), issue.status !== "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => handleResolveIssue(issue.id),
										className: "border-slate-200 text-slate-600",
										children: "Resolve"
									})]
								})]
							}, issue.id)), issues.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-10 text-center text-slate-500",
								children: "No maintenance issues reported."
							})]
						})]
					}),
					activeTab === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-slate-900 mb-4",
							children: "Tenant Documents"
						}), tenants.map((tenant) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenantDocumentList, { tenant }, tenant.id))]
					}),
					activeTab === "notices" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-lg font-bold text-slate-900 mb-6 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-5 w-5 text-blue-600" }), " Send Notice"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSendNotice,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Send To" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
									value: notice.target,
									onChange: (e) => setNotice({
										...notice,
										target: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All Tenants in Building"
									}), tenants.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: t.id,
										children: [
											"Unit ",
											t.unit,
											" - ",
											t.name
										]
									}, t.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "e.g. Water Maintenance",
									value: notice.title,
									onChange: (e) => setNotice({
										...notice,
										title: e.target.value
									}),
									className: "bg-slate-50 mt-1"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: "flex min-h-[120px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
									placeholder: "e.g. Water will be shut off tomorrow...",
									value: notice.content,
									onChange: (e) => setNotice({
										...notice,
										content: e.target.value
									}),
									required: true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full bg-blue-600 hover:bg-blue-700 text-white",
									children: "Send Notice"
								})
							]
						})]
					})
				]
			})
		]
	});
}
function TenantDocumentList({ tenant }) {
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [file, setFile] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const fetchDocs = async () => {
		const { data } = await supabase.from("documents").select("*").eq("tenant_id", tenant.id).order("created_at", { ascending: false });
		if (data) setDocuments(data);
	};
	(0, import_react.useEffect)(() => {
		fetchDocs();
	}, [tenant.id]);
	const handleUpload = async () => {
		if (!file) return toast.error("Select a file first");
		setUploading(true);
		const { data: { user } } = await supabase.auth.getUser();
		const path = `${tenant.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
		const s = await supabase.storage.from("Documents").upload(path, file, { upsert: false });
		if (s.error) {
			toast.error(s.error.message);
			setUploading(false);
			return;
		}
		const { error } = await supabase.from("documents").insert({
			owner_id: tenant.owner_id,
			property_id: tenant.property_id,
			tenant_id: tenant.id,
			kind: "lease",
			title: `Lease Agreement — ${tenant.name}`,
			url: `tenant-docs:${path}`
		});
		setUploading(false);
		if (error) return toast.error(error.message);
		toast.success("Document uploaded");
		setFile(null);
		fetchDocs();
	};
	const handleOpenDoc = async (url) => {
		if (!url.startsWith("tenant-docs:")) return window.open(url, "_blank");
		const { data, error } = await supabase.storage.from("Documents").createSignedUrl(url.slice(12), 300);
		if (error) return toast.error(error.message);
		window.open(data.signedUrl, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "font-bold text-slate-900 mb-4",
				children: [
					tenant.name,
					" (Unit ",
					tenant.unit,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					onChange: (e) => setFile(e.target.files?.[0] ?? null),
					className: "bg-slate-50 max-w-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleUpload,
					disabled: uploading,
					className: "bg-slate-900 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-2" }),
						" ",
						uploading ? "Uploading..." : "Post Agreement"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y divide-slate-100 border rounded-lg",
				children: [documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 flex justify-between items-center text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-slate-400" }),
							" ",
							doc.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "link",
						size: "sm",
						onClick: () => handleOpenDoc(doc.url),
						children: "View / Download"
					})]
				}, doc.id)), documents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-3 text-slate-500 text-sm text-center",
					children: "No documents uploaded for this tenant yet."
				})]
			})
		]
	});
}
//#endregion
export { CaretakerDashboard as component };
