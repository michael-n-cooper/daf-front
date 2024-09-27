import { a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Matrix } from '../chunks/Matrix_B5UJCv5C.mjs';
import { g as getTable } from '../chunks/build-matrix_CxJhk0k3.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let table = await getTable();
  return renderTemplate`${renderComponent($$result, "Matrix", $$Matrix, { "title": "Functional needs matrix", "table": table }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="disclaimer"> <p>Out of date draft</p> <p>Not for distribution</p> </div> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/matrix-functional-needs/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/matrix-functional-needs/index.astro";
const $$url = "/daf-front/matrix-functional-needs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
