import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-C382HBve.js
var SUPABASE_URL = "https://hokrlhvomhggckqbbzmo.supabase.co";
var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mVzcT2sJ2XaaVIc2DipxJA_O2H1fQxo";
function createSupabaseFetch(publishableKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (publishableKey.startsWith("sb_publishable_") && headers.get("Authorization") === `Bearer ${publishableKey}`) headers.delete("Authorization");
		headers.set("apikey", publishableKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
var supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
	global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true
	}
});
//#endregion
export { supabase as t };
