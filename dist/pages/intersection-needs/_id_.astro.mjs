import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DZ1qsoS-.mjs';
import { b as baseUri } from '../../chunks/util_4wpGfNoh.mjs';
import { l as loadStaticPaths } from '../../chunks/load-static-paths_CjFPet2l.mjs';
import { a as apiGet, i as idFrag } from '../../chunks/util-base_RWCnFOo0.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
async function getStaticPaths() {
  const section = "intersection-needs";
  const paths = await loadStaticPaths(section);
  return paths;
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const json = await apiGet("intersection-needs/" + id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Intersection need: " + json[0].label }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>This is an intersection of the functional needs <a${addAttribute(baseUri + "functional-needs/" + idFrag(json[0].functionalNeeds[0].id), "href")}>${json[0].functionalNeeds[0].label}</a> and <a${addAttribute(baseUri + "functional-needs/" + idFrag(json[0].functionalNeeds[1].id), "href")}>${json[0].functionalNeeds[1].label}</a>.</p> <p>There are ${json[0].statements.length} guidance statements that support this intersection need:</p> <ul> ${json[0].statements.map((statement) => renderTemplate`<li><a${addAttribute(baseUri + "guidance-statements/" + idFrag(statement.id), "href")}${addAttribute(statement.stmt, "title")}>${statement.label}</a></li>`)} </ul> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/intersection-needs/[id].astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/intersection-needs/[id].astro";
const $$url = "/daf-front/intersection-needs/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	getStaticPaths,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
