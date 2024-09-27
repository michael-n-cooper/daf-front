import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent } from '../../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DZ1qsoS-.mjs';
import { l as loadStaticPaths } from '../../chunks/load-static-paths_CjFPet2l.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
async function getStaticPaths() {
  const section = "tags";
  const paths = await loadStaticPaths(section);
  return paths;
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "type": "Tag", "section": "tags" }, { "default": ($$result2) => renderTemplate`
Fix Tags
` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/tags/[id].astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/tags/[id].astro";
const $$url = "/daf-front/tags/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	getStaticPaths,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
