import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DXkrivVP.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invite-DxEmLzXp.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
var inviteStaff_createServerFn_handler = createServerRpc({
	id: "aed6fd5241e0ed9fd83a66b0812c9cd3bc6359c089652e11df0c010501c79ab1",
	name: "inviteStaff",
	filename: "src/server/invite.ts"
}, (opts) => inviteStaff.__executeServer(opts));
var inviteStaff = createServerFn({ method: "POST" }).validator(inviteInput).handler(inviteStaff_createServerFn_handler, async ({ data }) => {
	const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
	const secretKey = process.env.SUPABASE_SECRET_KEY;
	if (!url || !secretKey) throw new Error("Missing Supabase URL or Secret Key in .env file.");
	const supabaseAdmin = createClient(url, secretKey, { auth: {
		autoRefreshToken: false,
		persistSession: false
	} });
	const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, { redirectTo: "http://localhost:3000/auth" });
	if (inviteError) throw new Error(inviteError.message);
	if (!inviteData.user) throw new Error("Failed to create user.");
	const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
		user_id: inviteData.user.id,
		role: data.role
	});
	if (roleError) throw new Error(roleError.message);
	if (data.role === "caretaker" && data.propertyId) {
		const { error: staffError } = await supabaseAdmin.from("property_staff").insert({
			property_id: data.propertyId,
			staff_email: data.email
		});
		if (staffError) throw new Error(staffError.message);
	}
	return { success: true };
});
//#endregion
export { inviteStaff_createServerFn_handler };
