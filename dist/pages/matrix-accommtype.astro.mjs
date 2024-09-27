import { a as createComponent, r as renderTemplate, b as renderComponent } from '../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Matrix } from '../chunks/Matrix_B5UJCv5C.mjs';
import { g as getTable } from '../chunks/build-matrix_BlG8Fr-W.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let table = await getTable();
  return renderTemplate`${renderComponent($$result, "Matrix", $$Matrix, { "title": "Accommodation types matrix", "table": table })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/matrix-accommtype/index.astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/matrix-accommtype/index.astro";
const $$url = "/daf-front/matrix-accommtype";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
