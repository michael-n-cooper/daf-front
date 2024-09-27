import { a as createComponent, r as renderTemplate, b as renderComponent } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { a as apiGet } from '../chunks/util-base_RWCnFOo0.mjs';
import { $ as $$IdLabel } from '../chunks/IdLabel_rDZ7N4TC.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const section = "intersection-needs";
  const json = await apiGet(section);
  new Array();
  json.forEach(function(item) {
    item.id;
  });
  return renderTemplate`${renderComponent($$result, "IdLabel", $$IdLabel, { "section": "intersection-needs" })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/intersection-needs/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/intersection-needs/index.astro";
const $$url = "/daf-front/intersection-needs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
