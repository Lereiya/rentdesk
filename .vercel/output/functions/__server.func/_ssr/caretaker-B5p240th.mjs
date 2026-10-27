import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BcfNEHKo.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DXkrivVP.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/caretaker-B5p240th.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var inviteInput = objectType({
	email: stringType().trim().email().transform((email) => email.toLowerCase()),
	role: enumType(["caretaker", "tenant"]),
	propertyId: stringType().uuid().optional()
});
var inviteStaff = createServerFn({ method: "POST" }).validator(inviteInput).handler(createSsrRpc("aed6fd5241e0ed9fd83a66b0812c9cd3bc6359c089652e11df0c010501c79ab1"));
function CaretakerPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [propertyId, setPropertyId] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleInvite = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;
			if (!sessionData.session) throw new Error("You must be signed in to invite staff.");
			await inviteStaff({ data: {
				email,
				role: "caretaker",
				propertyId,
				accessToken: sessionData.session.access_token
			} });
			toast.success("Invite sent! Check your email.");
			setEmail("");
			setPropertyId("");
		} catch (error) {
			const message = error instanceof Error ? error.message : typeof error === "object" && error !== null && "message" in error && typeof error.message === "string" ? error.message : String(error);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 text-2xl font-bold",
			children: "Invite Caretaker"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleInvite,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "caretaker-email",
						children: "Email Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "caretaker-email",
						type: "email",
						placeholder: "caretaker@email.com",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "caretaker-property",
						children: "Property ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "caretaker-property",
						placeholder: "Enter property ID",
						value: propertyId,
						onChange: (e) => setPropertyId(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: loading,
					className: "w-full",
					children: loading ? "Sending..." : "Invite Caretaker"
				})
			]
		})]
	});
}
//#endregion
export { CaretakerPage as component };
