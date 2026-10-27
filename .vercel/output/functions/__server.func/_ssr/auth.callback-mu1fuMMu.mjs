import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C382HBve.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-mu1fuMMu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallback() {
	const navigate = useNavigate();
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const handleCallback = async () => {
			try {
				const code = new URLSearchParams(window.location.search).get("code");
				if (!code) {
					setError("No authorization code found in the URL.");
					return;
				}
				const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
				if (exchangeError) {
					setError(`Exchange Error: ${exchangeError.message}`);
					return;
				}
				if (data.session) navigate({
					to: "/auth",
					replace: true
				});
				else setError("Code exchanged, but no session was returned.");
			} catch (err) {
				setError(`Unexpected Error: ${err.message}`);
			}
		};
		handleCallback();
	}, [navigate]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen flex-col items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-red-50 border border-red-200 p-6 rounded-lg max-w-lg w-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-red-700 font-bold mb-2 text-lg",
				children: "Authentication Failed"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-red-600 font-mono text-sm",
				children: error
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => window.location.href = "/auth",
			className: "mt-6 text-primary underline",
			children: "Return to Login"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen flex-col items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-muted-foreground",
			children: "Exchanging code for session..."
		})]
	});
}
//#endregion
export { AuthCallback as component };
