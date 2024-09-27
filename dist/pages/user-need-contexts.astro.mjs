import { a as createComponent, r as renderTemplate, b as renderComponent } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$IdLabel } from '../chunks/IdLabel_rDZ7N4TC.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "IdLabel", $$IdLabel, { "section": "user-need-contexts", "title": "User need contexts" })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/user-need-contexts/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/user-need-contexts/index.astro";
const $$url = "/daf-front/user-need-contexts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
