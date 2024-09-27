import { a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DZ1qsoS-.mjs';
import { b as baseUri } from '../chunks/util_4wpGfNoh.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Digital Accessibility Framework" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p><a${addAttribute(baseUri + "matrix-accommtype", "href")}>Matrix</a> | <a${addAttribute(baseUri + "docs", "href")}>Documentation</a></p> <p>This resource accesses a database of accessibility statements generated in the <a href="https://github.com/accessiblecommunity/Digital-Accessibility-Framework">Digital Accessibility Framework</a> project and presents it in a <a${addAttribute(baseUri + "matrix-accommtype", "href")}>matrix</a> showing intersections of related aspects of the digital accessibility space.</p> <ul> <li><a${addAttribute(baseUri + "guidance-statements", "href")}>Accessibility statements</a> <ul> <li><a${addAttribute(baseUri + "notes", "href")}>Notes</a></li> <li><a${addAttribute(baseUri + "references", "href")}>References</a></li> <li><a${addAttribute(baseUri + "tags", "href")}>Tags</a></li> </ul> </li> </ul> <section id="accommodation-type-mappings"> <h2>Accommodation type mappings</h2> <p>This approach maps guidance statements to functional abilities, accommodation types, and accessibility characteristics.</p> <ul> <li><a${addAttribute(baseUri + "functional-ability-groups", "href")}>Functional ability groups</a><a></a><ul><a></a><li><a></a><a${addAttribute(baseUri + "functional-abilities", "href")}>Functional abilities</a></li> </ul> </li> <li><a${addAttribute(baseUri + "accommodation-types", "href")}>Accommodation types</a></li> <li><a${addAttribute(baseUri + "accessibility-characteristic-groups", "href")}>Accessibility characteristic groups</a> <ul> <li><a${addAttribute(baseUri + "accessibility-characteristics", "href")}>Accessibility characteristics</a></li> </ul> </li> <li><a${addAttribute(baseUri + "matrix-accommtype", "href")}>Accommodation types matrix</a></li> </ul> </section> <section id="functional-ability-mappings"> <h2>Functional ability mappings:</h2> <p>This approach maps guidance statements to functional needs, user needs, and user need contexts. Currently, we do not think we will keep this approach.</p> <ul> <li><a${addAttribute(baseUri + "functional-need-categories", "href")}>Functional need categories</a> <ul> <li><a${addAttribute(baseUri + "functional-needs", "href")}>Functional needs</a></li> <li><a${addAttribute(baseUri + "intersection-needs", "href")}>Intersection needs</a></li> </ul> </li> <li><a${addAttribute(baseUri + "user-needs", "href")}>User needs</a> <ul> <li><a${addAttribute(baseUri + "user-need-contexts", "href")}>User need contexts</a></li> </ul> </li> <li><a${addAttribute(baseUri + "matrix-functional-needs", "href")}>Matrix</a></li> </ul> </section> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/index.astro";
const $$url = "/daf-front";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
