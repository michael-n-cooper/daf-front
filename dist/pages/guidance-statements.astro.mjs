import { a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DZ1qsoS-.mjs';
import { b as baseUri } from '../chunks/util_4wpGfNoh.mjs';
import { a as apiGet, i as idFrag } from '../chunks/util-base_RWCnFOo0.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const section = "statements";
  const json = await apiGet(section);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Guidance statements" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>${json.length} guidance statements:</p> <ul> ${json.map((statement) => renderTemplate`<li><a${addAttribute(baseUri + "guidance-statements/" + idFrag(statement.id), "href")}>${statement.label}</a> - ${statement.stmt}</li>`)} </ul> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/guidance-statements/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/guidance-statements/index.astro";
const $$url = "/daf-front/guidance-statements";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
