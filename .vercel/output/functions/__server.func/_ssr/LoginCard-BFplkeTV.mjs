import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { d as portalHome, h as rolesQuery, t as allowedOnPortal } from "./data-BeWW2Avz.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as EyeOff, b as House, w as Eye, x as HardHat } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LoginCard-BFplkeTV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var copy = {
	landlord: {
		badge: "Landlord sign-in",
		path: "/auth",
		others: [{
			to: "/caretaker-login",
			text: "Caretaker? Use the caretaker sign-in"
		}, {
			to: "/tenant-login",
			text: "Tenant? Use the tenant sign-in"
		}]
	},
	caretaker: {
		badge: "Caretaker sign-in",
		path: "/caretaker-login",
		others: [{
			to: "/auth",
			text: "Landlord? Sign in here"
		}, {
			to: "/tenant-login",
			text: "Tenant? Use the tenant sign-in"
		}]
	},
	tenant: {
		badge: "Tenant sign-in",
		path: "/tenant-login",
		others: [{
			to: "/auth",
			text: "Landlord? Sign in here"
		}, {
			to: "/caretaker-login",
			text: "Caretaker? Use the caretaker sign-in"
		}]
	}
};
function LoginCard({ portal }) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const c = copy[portal];
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	/** Only let accounts that belong to this portal through. */
	const proceed = (0, import_react.useCallback)(async (quiet = false) => {
		qc.removeQueries({ queryKey: ["roles"] });
		const roles = await qc.fetchQuery(rolesQuery);
		if (allowedOnPortal(roles, portal)) return void navigate({ to: portalHome(portal) });
		if (quiet) return;
		await supabase.auth.signOut();
		qc.clear();
		const where = roles.includes("tenant") ? "tenant" : roles.includes("caretaker") ? "caretaker" : "landlord";
		toast.error(roles.length === 0 ? "This account isn't linked yet. Ask your caretaker to add your email." : `This is a ${where} account. Please use the ${where} sign-in.`);
	}, [
		navigate,
		portal,
		qc
	]);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) proceed(true);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
			if (ev === "PASSWORD_RECOVERY") {
				setMode("reset");
				setBusy(false);
				return;
			}
			if (ev === "SIGNED_IN") setTimeout(() => proceed(), 0);
		});
		return () => sub.subscription.unsubscribe();
	}, [proceed]);
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		if (mode === "reset") {
			const { error } = await supabase.auth.updateUser({ password });
			setBusy(false);
			if (error) return void toast.error(error.message);
			toast.success("Your password has been updated.");
			navigate({ to: portalHome(portal) });
			return;
		}
		if (mode === "up") {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: window.location.origin,
					data: {
						full_name: name,
						portal
					}
				}
			});
			setBusy(false);
			if (error) return void toast.error(error.message);
			toast.success("Check your email to confirm your account.");
			setMode("in");
		} else {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			setBusy(false);
			if (error) toast.error(error.message);
		}
	};
	const google = async () => {
		setBusy(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${window.location.origin}/auth/callback` }
		});
		if (error) {
			setBusy(false);
			toast.error("Google sign-in failed: " + error.message);
		}
	};
	const resetPassword = async () => {
		if (!email.trim()) {
			toast.error("Enter your email address first.");
			return;
		}
		setBusy(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
		setBusy(false);
		if (error) return void toast.error(error.message);
		toast.success("If an account exists for that email, a password reset link is on its way.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-[#f7f4eb] px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[360px] rounded-[18px] border border-[#e7e1d6] bg-[#fffefa] p-6 shadow-[0_6px_18px_rgba(27,42,30,0.07)] sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-full bg-[#145632] text-[#fffefa]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(portal === "caretaker" ? HardHat : House, {
							"aria-hidden": "true",
							className: "h-[18px] w-[18px]"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-base font-semibold leading-tight text-[#17261c]",
						children: "RentDesk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-[#69746c]",
						children: c.badge
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-[22px] font-semibold tracking-tight text-[#17261c]",
					children: mode === "reset" ? "Set a new password" : mode === "in" ? portal === "caretaker" ? "Caretaker portal" : "Welcome back" : portal === "caretaker" ? "Activate caretaker account" : "Create your account"
				}),
				mode === "up" && portal === "caretaker" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Use the email your landlord added for you."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-4 space-y-3",
					children: [
						mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "signup-name",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "signup-name",
								autoComplete: "name",
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "login-email",
								className: "text-xs font-medium text-[#36463a]",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "login-email",
								type: "email",
								autoComplete: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "h-10 rounded-lg border-[#ded8cd] bg-[#fffefa] text-sm focus-visible:ring-[#145632]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "login-password",
								className: "text-xs font-medium text-[#36463a]",
								children: mode === "reset" ? "New password" : "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "login-password",
									type: showPassword ? "text" : "password",
									autoComplete: mode === "in" ? "current-password" : "new-password",
									required: true,
									minLength: 6,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: "h-10 rounded-lg border-[#ded8cd] bg-[#fffefa] pr-10 text-sm focus-visible:ring-[#145632]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPassword(!showPassword),
									"aria-label": showPassword ? "Hide password" : "Show password",
									className: "absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-[#69746c] hover:text-[#145632] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]",
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "h-10 w-full rounded-lg bg-[#145632] text-sm font-semibold text-white shadow-none hover:bg-[#104728] focus-visible:ring-[#145632]",
							disabled: busy,
							children: busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "reset" ? "Update password" : "Create account"
						})
					]
				}),
				mode === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 w-full rounded py-1 text-center text-xs font-medium text-[#145632] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632] disabled:opacity-50",
					onClick: resetPassword,
					disabled: busy,
					children: "Forgot your password?"
				}),
				mode === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-2 h-10 w-full rounded-lg border-[#e4ded2] bg-[#f9f6ef] text-xs font-medium text-[#25382b] shadow-none hover:bg-[#f1ece2]",
						onClick: google,
						disabled: busy,
						children: "Continue with Google"
					}),
					c.others.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: o.to,
						className: "mt-2 block rounded text-center text-[11px] font-medium text-[#145632] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]",
						children: o.text
					}, o.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 w-full rounded text-center text-[11px] font-medium text-[#69746c] hover:text-[#145632] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]",
						onClick: () => setMode("up"),
						children: portal === "caretaker" ? "First time? Activate your account" : "Create an account"
					})
				] }),
				mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 w-full rounded text-center text-[11px] font-medium text-[#69746c] hover:text-[#145632] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]",
					onClick: () => setMode("in"),
					children: "Have an account? Sign in"
				})
			]
		})
	});
}
//#endregion
export { LoginCard as t };
