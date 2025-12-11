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
		client: {start:"_app/immutable/entry/start.Ck2xxzSP.js",app:"_app/immutable/entry/app.CrR02Ed9.js",imports:["_app/immutable/entry/start.Ck2xxzSP.js","_app/immutable/chunks/Dq0Mk-ag.js","_app/immutable/chunks/DEK3Obex.js","_app/immutable/chunks/DLgJyP2S.js","_app/immutable/entry/app.CrR02Ed9.js","_app/immutable/chunks/DEK3Obex.js","_app/immutable/chunks/BpwXMZT0.js","_app/immutable/chunks/7dkRvVKL.js","_app/immutable/chunks/BhSLElx-.js","_app/immutable/chunks/DLgJyP2S.js","_app/immutable/chunks/wDR7ps1p.js","_app/immutable/chunks/xPy7J-55.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BKpfXNvN.js')),
			__memo(() => import('./chunks/1-DBO7eQRE.js')),
			__memo(() => import('./chunks/2-ClnTgmqw.js')),
			__memo(() => import('./chunks/3-D_0Kb2YN.js')),
			__memo(() => import('./chunks/4-CWX6N70H.js'))
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
