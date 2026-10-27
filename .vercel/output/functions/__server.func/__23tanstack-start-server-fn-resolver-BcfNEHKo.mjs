//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BcfNEHKo.js
var manifest = { "aed6fd5241e0ed9fd83a66b0812c9cd3bc6359c089652e11df0c010501c79ab1": {
	functionName: "inviteStaff_createServerFn_handler",
	importer: () => import("./_ssr/invite-DxEmLzXp.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
