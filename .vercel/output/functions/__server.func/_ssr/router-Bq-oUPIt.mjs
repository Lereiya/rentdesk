import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as issuesQuery, f as profileQuery, g as tenantsQuery, h as rolesQuery, i as homeFor, l as myTenancyQuery, m as requireRole, n as announcementsQuery, p as propertiesQuery, r as documentsQuery, u as paymentsQuery } from "./data-BeWW2Avz.mjs";
import { K as redirect, S as useRouter, _ as lazyRouteComponent, b as Link, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bq-oUPIt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-D_D_ZASh.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "RentDesk" },
			{
				name: "description",
				content: "Property Management, Without the Complexity."
			},
			{
				property: "og:title",
				content: "RentDesk"
			},
			{
				property: "og:description",
				content: "Property Management, Without the Complexity."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.svg?v=2",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { richColors: true })]
	});
}
var $$splitComponentImporter$13 = () => import("./routes-QCbAfwDn.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "RentDesk — Property management" }, {
		name: "description",
		content: "Property management, rent collection and tenant support in one place."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./route-Di7iQBCH.mjs");
var Route$12 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: location.pathname.startsWith("/caretaker") ? "/caretaker-login" : location.pathname.startsWith("/portal") ? "/tenant-login" : "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./auth-CMn4mlyZ.mjs");
var Route$11 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in | RentDesk" },
		{
			name: "description",
			content: "Sign in to your RentDesk landlord or tenant account."
		},
		{
			property: "og:title",
			content: "Sign in | RentDesk"
		},
		{
			property: "og:description",
			content: "Landlord and tenant sign-in."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./caretaker-login-BvzojiLH.mjs");
var Route$10 = createFileRoute("/caretaker-login")({
	head: () => ({ meta: [
		{ title: "Caretaker sign-in | RentDesk" },
		{
			name: "description",
			content: "Sign in to the RentDesk caretaker portal."
		},
		{
			property: "og:title",
			content: "Caretaker sign-in | RentDesk"
		},
		{
			property: "og:description",
			content: "Separate sign-in for property caretakers and agents."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./tenant-login-ZalUdmee.mjs");
var Route$9 = createFileRoute("/tenant-login")({
	head: () => ({ meta: [
		{ title: "Tenant sign-in | RentDesk" },
		{
			name: "description",
			content: "Sign in to see your rent and water arrears, payments, documents and notices."
		},
		{
			property: "og:title",
			content: "Tenant sign-in | RentDesk"
		},
		{
			property: "og:description",
			content: "Separate sign-in for tenants."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./caretaker-B5p240th.mjs");
var Route$8 = createFileRoute("/_authenticated/caretaker")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./dashboard-CnzhBX7t.mjs");
var $$splitErrorComponentImporter$3 = () => import("./dashboard-D7nZPV-y.mjs");
var Route$7 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Overview | RentDesk" }, {
		name: "description",
		content: "Rent collection, occupancy and arrears across your properties."
	}] }),
	beforeLoad: async ({ context }) => {
		const home = homeFor(await context.queryClient.ensureQueryData(rolesQuery));
		if (home !== "/dashboard") throw redirect({ to: home });
		await requireRole(context.queryClient, "landlord");
	},
	loader: ({ context: { queryClient } }) => Promise.all([
		queryClient.ensureQueryData(profileQuery),
		queryClient.ensureQueryData(propertiesQuery),
		queryClient.ensureQueryData(tenantsQuery),
		queryClient.ensureQueryData(paymentsQuery)
	]).then(() => void 0),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./payments-DVoAwm17.mjs");
var $$splitErrorComponentImporter$2 = () => import("./payments-DtJkN1OZ.mjs");
var Route$6 = createFileRoute("/_authenticated/payments")({
	head: () => ({ meta: [
		{ title: "Payments | RentDesk" },
		{
			name: "description",
			content: "M-Pesa, Co-op Bank and cash payments received from tenants."
		},
		{
			property: "og:title",
			content: "Payments | RentDesk"
		},
		{
			property: "og:description",
			content: "Track and record tenant payments."
		}
	] }),
	beforeLoad: ({ context }) => requireRole(context.queryClient, "landlord"),
	loader: ({ context: { queryClient: q } }) => Promise.all([q.ensureQueryData(paymentsQuery), q.ensureQueryData(tenantsQuery)]).then(() => void 0),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./portal-Cgxs2pCk.mjs");
var $$splitErrorComponentImporter$1 = () => import("./portal-Dj7vWEg2.mjs");
var Route$5 = createFileRoute("/_authenticated/portal")({
	head: () => ({ meta: [
		{ title: "Tenant portal | RentDesk" },
		{
			name: "description",
			content: "Your rent and water arrears, payments, documents, notifications and repair requests."
		},
		{
			property: "og:title",
			content: "Tenant portal | RentDesk"
		},
		{
			property: "og:description",
			content: "Your bills, notices and repair requests."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	beforeLoad: ({ context }) => requireRole(context.queryClient, "tenant"),
	loader: ({ context: { queryClient: q } }) => Promise.all([
		myTenancyQuery,
		announcementsQuery,
		issuesQuery,
		paymentsQuery,
		documentsQuery
	].map((o) => q.ensureQueryData(o))).then(() => void 0),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./properties-DGYxeRGu.mjs");
var Route$4 = createFileRoute("/_authenticated/properties")({
	head: () => ({ meta: [{ title: "Properties | RentDesk" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./tenants-Cxa4HDFe.mjs");
var $$splitErrorComponentImporter = () => import("./tenants-DFOtkT8N.mjs");
var Route$3 = createFileRoute("/_authenticated/tenants")({
	head: () => ({ meta: [
		{ title: "Tenants | RentDesk" },
		{
			name: "description",
			content: "Tenant list with rent, water and garbage charges and balances."
		},
		{
			property: "og:title",
			content: "Tenants | RentDesk"
		},
		{
			property: "og:description",
			content: "Every tenant's monthly charges and balance."
		}
	] }),
	beforeLoad: ({ context }) => requireRole(context.queryClient, "landlord"),
	loader: ({ context }) => context.queryClient.ensureQueryData(tenantsQuery).then(() => void 0),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./auth.callback-mu1fuMMu.mjs");
var Route$2 = createFileRoute("/auth/callback")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./caretaker.dashboard-BnqwsD5E.mjs");
var Route$1 = createFileRoute("/caretaker/dashboard")({
	head: () => ({ meta: [{ title: "Caretaker dashboard | RentDesk" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./tenant.dashboard-Dh8UjJL5.mjs");
var Route = createFileRoute("/tenant/dashboard")({
	head: () => ({ meta: [{ title: "Tenant dashboard | RentDesk" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AuthenticatedRouteRoute = Route$12.update({
	id: "/_authenticated",
	getParentRoute: () => Route$14
});
var AuthRoute = Route$11.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$14
});
var CaretakerLoginRoute = Route$10.update({
	id: "/caretaker-login",
	path: "/caretaker-login",
	getParentRoute: () => Route$14
});
var TenantLoginRoute = Route$9.update({
	id: "/tenant-login",
	path: "/tenant-login",
	getParentRoute: () => Route$14
});
var AuthenticatedCaretakerRoute = Route$8.update({
	id: "/caretaker",
	path: "/caretaker",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$7.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPaymentsRoute = Route$6.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalRoute = Route$5.update({
	id: "/portal",
	path: "/portal",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPropertiesRoute = Route$4.update({
	id: "/properties",
	path: "/properties",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTenantsRoute = Route$3.update({
	id: "/tenants",
	path: "/tenants",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthCallbackRoute = Route$2.update({
	id: "/callback",
	path: "/callback",
	getParentRoute: () => AuthRoute
});
var CaretakerDashboardRoute = Route$1.update({
	id: "/caretaker/dashboard",
	path: "/caretaker/dashboard",
	getParentRoute: () => Route$14
});
var TenantDashboardRoute = Route.update({
	id: "/tenant/dashboard",
	path: "/tenant/dashboard",
	getParentRoute: () => Route$14
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedCaretakerRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedPaymentsRoute,
	AuthenticatedPortalRoute,
	AuthenticatedPropertiesRoute,
	AuthenticatedTenantsRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var AuthRouteChildren = { AuthCallbackRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AuthRoute: AuthRoute._addFileChildren(AuthRouteChildren),
	CaretakerLoginRoute,
	TenantLoginRoute,
	CaretakerDashboardRoute,
	TenantDashboardRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
