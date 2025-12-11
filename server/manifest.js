const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.zGxUQb_4.js",app:"_app/immutable/entry/app.DhzffPyt.js",imports:["_app/immutable/entry/start.zGxUQb_4.js","_app/immutable/chunks/DIM-6WBn.js","_app/immutable/chunks/B5bnNgZt.js","_app/immutable/chunks/GzCuSgOG.js","_app/immutable/entry/app.DhzffPyt.js","_app/immutable/chunks/B5bnNgZt.js","_app/immutable/chunks/BD65klO0.js","_app/immutable/chunks/CU-7G8uS.js","_app/immutable/chunks/GzCuSgOG.js","_app/immutable/chunks/RA2-kGBT.js","_app/immutable/chunks/CYi66ufP.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-VDHhi5Xf.js')),
			__memo(() => import('./chunks/1-DciCsXFG.js')),
			__memo(() => import('./chunks/2-3gezy-_3.js')),
			__memo(() => import('./chunks/3-1BaN9euO.js')),
			__memo(() => import('./chunks/4-DnTfcSZs.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/clusters",
				pattern: /^\/api\/clusters\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B7aPuDZv.js'))
			},
			{
				id: "/api/reports",
				pattern: /^\/api\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BhRFo0hY.js'))
			},
			{
				id: "/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/reports",
				pattern: /^\/reports\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
