import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DZ1qsoS-.mjs';
import { b as baseUri } from '../../chunks/util_4wpGfNoh.mjs';
import { l as loadStaticPaths } from '../../chunks/load-static-paths_CjFPet2l.mjs';
import { a as apiGet, i as idFrag } from '../../chunks/util-base_RWCnFOo0.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
async function getStaticPaths() {
  const section = "functional-need-categories";
  const paths = await loadStaticPaths(section);
  return paths;
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const json = await apiGet("functional-need-categories/" + id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Functional Need Category: " + json[0].label }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>${json[0].functionalNeeds.length} functional needs:</p> <ul> ${json[0].functionalNeeds.map((item) => renderTemplate`<li><a${addAttribute(baseUri + "functional-needs/" + idFrag(item.id), "href")}>${item.label}</a></li>`)} </ul> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/functional-need-categories/[id].astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/functional-need-categories/[id].astro";
const $$url = "/daf-front/functional-need-categories/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	getStaticPaths,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
