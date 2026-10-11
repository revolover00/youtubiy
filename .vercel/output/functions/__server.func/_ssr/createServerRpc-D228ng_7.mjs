import { a as TSS_SERVER_FUNCTION } from "./createServerFn-yTfeHp1H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerRpc-D228ng_7.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
