import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, u as unescapeHTML, m as maybeRenderHead, f as renderSlot, d as addAttribute } from './astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_DZ1qsoS-.mjs';
import { b as baseUri } from './util_4wpGfNoh.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://michael-n-cooper.github.io");
const $$Matrix = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Matrix;
  const { table, title } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <link rel="stylesheet" type="text/css"', "> <script", "><\/script>  ", " ", '<p> <input type="checkbox" id="highlightSameStmtControl"> <label for="highlightSameStmtControl">Show same statements</label> <input type="checkbox" id="highlightCellPosControl"> <label for="highlightCellPosControl">Show cell position</label> <input type="checkbox" id="shrinkMatrixControl"> <label for="shrinkMatrixControl">Fit matrix</label> <input type="checkbox" id="showPopupsControl" disabled="true/"> <label for="showPopupsControl">Show enlarged popups</label> </p> <div id="matrix">', "</div> "])), addAttribute(baseUri + "matrix.css", "href"), addAttribute(baseUri + "matrix.js", "src"), renderSlot($$result2, $$slots["default"]), maybeRenderHead(), unescapeHTML(table)) })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/layouts/Matrix.astro", void 0);

export { $$Matrix as $ };
