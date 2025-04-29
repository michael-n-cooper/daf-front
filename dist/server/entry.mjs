import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CsuUM6YZ.mjs';
import { manifest } from './manifest_Hubt0gXW.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/accessibility-characteristic-groups/ids.astro.mjs');
const _page1 = () => import('./pages/accessibility-characteristic-groups/_id_.astro.mjs');
const _page2 = () => import('./pages/accessibility-characteristic-groups.astro.mjs');
const _page3 = () => import('./pages/accessibility-characteristics/ids.astro.mjs');
const _page4 = () => import('./pages/accessibility-characteristics/_id_.astro.mjs');
const _page5 = () => import('./pages/accessibility-characteristics.astro.mjs');
const _page6 = () => import('./pages/accommodation-types/ids.astro.mjs');
const _page7 = () => import('./pages/accommodation-types/_id_.astro.mjs');
const _page8 = () => import('./pages/accommodation-types.astro.mjs');
const _page9 = () => import('./pages/docs.astro.mjs');
const _page10 = () => import('./pages/functional-abilities/ids.astro.mjs');
const _page11 = () => import('./pages/functional-abilities/_id_.astro.mjs');
const _page12 = () => import('./pages/functional-abilities.astro.mjs');
const _page13 = () => import('./pages/functional-ability-groups/ids.astro.mjs');
const _page14 = () => import('./pages/functional-ability-groups/_id_.astro.mjs');
const _page15 = () => import('./pages/functional-ability-groups.astro.mjs');
const _page16 = () => import('./pages/functional-need-categories/ids.astro.mjs');
const _page17 = () => import('./pages/functional-need-categories/_id_.astro.mjs');
const _page18 = () => import('./pages/functional-need-categories.astro.mjs');
const _page19 = () => import('./pages/functional-needs/ids.astro.mjs');
const _page20 = () => import('./pages/functional-needs/_id_.astro.mjs');
const _page21 = () => import('./pages/functional-needs.astro.mjs');
const _page22 = () => import('./pages/guidance-statements/ids.astro.mjs');
const _page23 = () => import('./pages/guidance-statements/_id_.astro.mjs');
const _page24 = () => import('./pages/guidance-statements.astro.mjs');
const _page25 = () => import('./pages/intersection-needs/ids.astro.mjs');
const _page26 = () => import('./pages/intersection-needs/_id_.astro.mjs');
const _page27 = () => import('./pages/intersection-needs.astro.mjs');
const _page28 = () => import('./pages/matrix-accommtype/build-matrix.astro.mjs');
const _page29 = () => import('./pages/matrix-accommtype/build-matrix-script.astro.mjs');
const _page30 = () => import('./pages/matrix-accommtype.astro.mjs');
const _page31 = () => import('./pages/matrix-functional-needs/build-matrix.astro.mjs');
const _page32 = () => import('./pages/matrix-functional-needs/build-matrix-script.astro.mjs');
const _page33 = () => import('./pages/matrix-functional-needs.astro.mjs');
const _page34 = () => import('./pages/notes.astro.mjs');
const _page35 = () => import('./pages/references/ids.astro.mjs');
const _page36 = () => import('./pages/references/_id_.astro.mjs');
const _page37 = () => import('./pages/references.astro.mjs');
const _page38 = () => import('./pages/tags/ids.astro.mjs');
const _page39 = () => import('./pages/tags/_id_.astro.mjs');
const _page40 = () => import('./pages/tags.astro.mjs');
const _page41 = () => import('./pages/user-need-contexts/ids.astro.mjs');
const _page42 = () => import('./pages/user-need-contexts/_id_.astro.mjs');
const _page43 = () => import('./pages/user-need-contexts.astro.mjs');
const _page44 = () => import('./pages/user-needs/ids.astro.mjs');
const _page45 = () => import('./pages/user-needs/_id_.astro.mjs');
const _page46 = () => import('./pages/user-needs.astro.mjs');
const _page47 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["src/pages/accessibility-characteristic-groups/ids.js", _page0],
    ["src/pages/accessibility-characteristic-groups/[id].astro", _page1],
    ["src/pages/accessibility-characteristic-groups/index.astro", _page2],
    ["src/pages/accessibility-characteristics/ids.js", _page3],
    ["src/pages/accessibility-characteristics/[id].astro", _page4],
    ["src/pages/accessibility-characteristics/index.astro", _page5],
    ["src/pages/accommodation-types/ids.js", _page6],
    ["src/pages/accommodation-types/[id].astro", _page7],
    ["src/pages/accommodation-types/index.astro", _page8],
    ["src/pages/docs/index.md", _page9],
    ["src/pages/functional-abilities/ids.js", _page10],
    ["src/pages/functional-abilities/[id].astro", _page11],
    ["src/pages/functional-abilities/index.astro", _page12],
    ["src/pages/functional-ability-groups/ids.js", _page13],
    ["src/pages/functional-ability-groups/[id].astro", _page14],
    ["src/pages/functional-ability-groups/index.astro", _page15],
    ["src/pages/functional-need-categories/ids.js", _page16],
    ["src/pages/functional-need-categories/[id].astro", _page17],
    ["src/pages/functional-need-categories/index.astro", _page18],
    ["src/pages/functional-needs/ids.js", _page19],
    ["src/pages/functional-needs/[id].astro", _page20],
    ["src/pages/functional-needs/index.astro", _page21],
    ["src/pages/guidance-statements/ids.js", _page22],
    ["src/pages/guidance-statements/[id].astro", _page23],
    ["src/pages/guidance-statements/index.astro", _page24],
    ["src/pages/intersection-needs/ids.js", _page25],
    ["src/pages/intersection-needs/[id].astro", _page26],
    ["src/pages/intersection-needs/index.astro", _page27],
    ["src/pages/matrix-accommtype/build-matrix.js", _page28],
    ["src/pages/matrix-accommtype/build-matrix-script.js", _page29],
    ["src/pages/matrix-accommtype/index.astro", _page30],
    ["src/pages/matrix-functional-needs/build-matrix.js", _page31],
    ["src/pages/matrix-functional-needs/build-matrix-script.js", _page32],
    ["src/pages/matrix-functional-needs/index.astro", _page33],
    ["src/pages/notes/index.astro", _page34],
    ["src/pages/references/ids.js", _page35],
    ["src/pages/references/[id].astro", _page36],
    ["src/pages/references/index.astro", _page37],
    ["src/pages/tags/ids.js", _page38],
    ["src/pages/tags/[id].astro", _page39],
    ["src/pages/tags/index.astro", _page40],
    ["src/pages/user-need-contexts/ids.js", _page41],
    ["src/pages/user-need-contexts/[id].astro", _page42],
    ["src/pages/user-need-contexts/index.astro", _page43],
    ["src/pages/user-needs/ids.js", _page44],
    ["src/pages/user-needs/[id].astro", _page45],
    ["src/pages/user-needs/index.astro", _page46],
    ["src/pages/index.astro", _page47]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Documents/code/GitHub/michael-n-cooper/daf-front/dist/client/",
    "server": "file:///C:/Documents/code/GitHub/michael-n-cooper/daf-front/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
