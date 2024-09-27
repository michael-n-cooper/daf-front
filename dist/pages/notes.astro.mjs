import { a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute, F as Fragment, u as unescapeHTML } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DZ1qsoS-.mjs';
import { b as baseUri } from '../chunks/util_4wpGfNoh.mjs';
/* empty css                                 */
import { a as apiGet, i as idFrag, m as mdToHtml } from '../chunks/util-base_RWCnFOo0.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const section = "statements";
  const json = await apiGet(section);
  const notes = json.filter((stmt) => stmt.note != null);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Guidance statements" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<p>${notes.length} notes in guidance statements:</p>${notes.map((statement) => renderTemplate`<div><p class="stmtlink"><a${addAttribute(baseUri + "guidance-statements/" + idFrag(statement.id), "href")}>${statement.label}</a></p>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(mdToHtml(statement.note))}` })}</div>`)}` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/notes/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/notes/index.astro";
const $$url = "/daf-front/notes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
