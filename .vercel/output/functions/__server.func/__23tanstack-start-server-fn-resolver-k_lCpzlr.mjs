//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-k_lCpzlr.js
var manifest = {
	"082f69d107aea7952728f6125376cb9f1571a57f603de01dfdbce54d2d68c0aa": {
		functionName: "homeCandidatesFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"5b0b18d8b92aa7dae9f22a3451e9df74637d6be54115a44f4b7f3156d077d1d9": {
		functionName: "browsePageFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"69e1a95792478bc6fde948266d0d4d0e0d3d946e7caf22f789f7bdf208af433a": {
		functionName: "aiTuneFn_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BvJEW5XE.mjs")
	},
	"6c107fbeddfebecfade5757810a2c71586eab58b0aa58408eb40e323cba31003": {
		functionName: "searchVideosFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"6ea08d0d84b44bcea33a8849ef5f29f447e191f3cfa5f45718053b4853f67a62": {
		functionName: "commentsPageFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"6ed3ca6507a5b00906856c4ba982ac97251ddfce084aa658a1c12d6d8b8aa5bc": {
		functionName: "playlistFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"7de321903635e9457261e7fd09127551080505b7a86bd3deb5bbb7a8b6f8c9c7": {
		functionName: "channelFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"81f6ffa4e0e71a805c26ed520123cfdb43e38ed55594fd0fe73a596c6ecd7607": {
		functionName: "trendingPageFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"a49e691b622c5fe29a55a052c2f795cd5b21b11101f470cdc26a4fb38d9c31f8": {
		functionName: "trendingFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"c179f018c7afafe2d17f332193a04e4ae0a6dc223c7e4b391482e17f731c50de": {
		functionName: "suggestionsFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"c9755b0ba7ae84fedf1201a6643d79941fd9b5d6cdd28f9021338065c7ce159b": {
		functionName: "aiRerankFn_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-BvJEW5XE.mjs")
	},
	"d3e053beb9baef7858aa8ff1a9c0b9ff4c6ae59e8d67b8421f3e266406ed231a": {
		functionName: "searchPageFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"d95940ea77e4afe8ab6f56da31d5c1c8d5dc6bc8bfa475fbbd764e56630f7cc9": {
		functionName: "channelFeedFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	},
	"e58a257fcd97eda44ff2fb91258575a7acdae5d28eae84cb918f8133a8eb8d8e": {
		functionName: "videoDetailsFn_createServerFn_handler",
		importer: () => import("./_ssr/youtube.functions-tDJgby4e.mjs")
	}
};
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
