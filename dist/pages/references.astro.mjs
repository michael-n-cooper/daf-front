import { a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DZ1qsoS-.mjs';
import { b as baseUri } from '../chunks/util_4wpGfNoh.mjs';
import { a as apiGet, i as idFrag } from '../chunks/util-base_RWCnFOo0.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const json = await apiGet("references");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "References" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p><a href="#guidelines">Guidelines</a> | <a href="#research">Research</a></p> <section id="guidelines"> <h2>Guidelines</h2> <table> <thead> <tr><th scope="col">Reference URI</th><th scope="col">Note</th><th scope="col">Used in</th></tr> </thead> <tbody> ${json.map((reference) => reference.refType == "guidelines" ? renderTemplate`<tr><td><a${addAttribute(reference.refIRI, "href")}>${reference.refIRI}</a></td><td>${reference.refNote}</td><td><a${addAttribute(baseUri + "guidance-statements/" + idFrag(reference.stmtId), "href")}>${reference.stmtLabel}</a></td></tr>` : "")} </tbody> </table> </section> <section id="research"> <h2>Research</h2> </section> <table> <thead> <tr><th scope="col">Reference URI</th><th scope="col">Note</th><th scope="col">Used in</th></tr> </thead> <tbody> ${json.map((reference) => reference.refType == "research" ? renderTemplate`<tr><td><a${addAttribute(reference.refIRI, "href")}>${reference.refIRI}</a></td><td>${reference.refNote}</td><td><a${addAttribute(baseUri + "guidance-statements/" + idFrag(reference.stmtId), "href")}>${reference.stmtLabel}</a></td></tr>` : "")} </tbody> </table> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/references/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/references/index.astro";
const $$url = "/daf-front/references";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
