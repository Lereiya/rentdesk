import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-D7nZPV-y.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	role: "alert",
	className: "m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800",
	children: ["The portfolio overview could not be loaded: ", error.message]
});
//#endregion
export { SplitErrorComponent as errorComponent };
