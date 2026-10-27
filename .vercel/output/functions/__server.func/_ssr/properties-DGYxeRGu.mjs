import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as MapPin, m as Plus, n as X, o as User, z as Building } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-CO8M4S7x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-DGYxeRGu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PropertiesPage() {
	const [properties, setProperties] = (0, import_react.useState)([]);
	const [staff, setStaff] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [newStaffEmail, setNewStaffEmail] = (0, import_react.useState)({});
	const fetchData = async () => {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return;
		const { data: props } = await supabase.from("properties").select("*").eq("owner_id", user.id).order("name");
		if (props) setProperties(props);
		const { data: staffData } = await supabase.from("property_staff").select("*").eq("owner_id", user.id);
		if (staffData) setStaff(staffData);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const handleAddStaff = async (propertyId) => {
		const email = newStaffEmail[propertyId]?.trim().toLowerCase();
		if (!email) return toast.error("Please enter an email");
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return;
		const { error } = await supabase.from("property_staff").insert({
			property_id: propertyId,
			owner_id: user.id,
			email
		});
		if (error) toast.error(error.message);
		else {
			toast.success("Caretaker added successfully");
			setNewStaffEmail({
				...newStaffEmail,
				[propertyId]: ""
			});
			fetchData();
		}
	};
	const handleRemoveStaff = async (staffId) => {
		if (!confirm("Remove this caretaker?")) return;
		const { error } = await supabase.from("property_staff").delete().eq("id", staffId);
		if (error) return toast.error(error.message);
		toast.success("Caretaker removed");
		fetchData();
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Properties",
		subtitle: "Loading your properties...",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "status",
			className: "p-10 text-center text-[#69746c]",
			children: "Loading properties..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Properties",
		subtitle: `${properties.length} properties under management`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "portal-theme",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: properties.map((prop) => {
					const propStaff = staff.filter((s) => s.property_id === prop.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-between items-start mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-blue-100 p-2 rounded-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-5 w-5 text-blue-600" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-bold text-slate-900",
										children: prop.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-slate-500 flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
											" ",
											prop.location
										]
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 p-3 rounded-lg border border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-slate-500 uppercase",
										children: "Vacant"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-slate-900",
										children: [prop.units - prop.occupied, " units"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 p-3 rounded-lg border border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-slate-500 uppercase",
										children: "Arrears"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-red-600",
										children: "KES 0"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-slate-100 pt-4 mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), " Caretaker Portal Access"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 mb-3",
										children: [propStaff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center bg-slate-50 px-3 py-2 rounded-md border border-slate-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium text-slate-700",
												children: s.email
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleRemoveStaff(s.id),
												className: "text-slate-400 hover:text-red-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
											})]
										}, s.id)), propStaff.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400 italic",
											children: "No caretakers assigned yet."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "caretaker@email.com",
											value: newStaffEmail[prop.id] || "",
											onChange: (e) => setNewStaffEmail({
												...newStaffEmail,
												[prop.id]: e.target.value
											}),
											className: "bg-slate-50 text-sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => handleAddStaff(prop.id),
											className: "bg-slate-900 hover:bg-slate-800 text-white",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Add"]
										})]
									})
								]
							})
						]
					}, prop.id);
				})
			})
		})
	});
}
//#endregion
export { PropertiesPage as component };
