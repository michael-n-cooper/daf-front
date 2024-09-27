import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent } from '../../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$MatrixItemDetails } from '../../chunks/MatrixItemDetails_CqoYg9z8.mjs';
import { l as loadStaticPaths } from '../../chunks/load-static-paths_CjFPet2l.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
async function getStaticPaths() {
  const section = "accessibility-characteristics";
  const paths = await loadStaticPaths(section);
  return paths;
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "MatrixItemDetails", $$MatrixItemDetails, { "id": id, "section": "accessibility-characteristics", "type": "Accessibility Characteristic" })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/accessibility-characteristics/[id].astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/accessibility-characteristics/[id].astro";
const $$url = "/daf-front/accessibility-characteristics/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	getStaticPaths,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
