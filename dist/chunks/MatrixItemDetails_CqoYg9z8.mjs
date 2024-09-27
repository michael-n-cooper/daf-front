import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute } from './astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_DZ1qsoS-.mjs';
import { b as baseUri } from './util_4wpGfNoh.mjs';
import { a as apiGet, i as idFrag } from './util-base_RWCnFOo0.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
const $$MatrixItemDetails = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MatrixItemDetails;
  const { section, id, type } = Astro2.props;
  const json = await apiGet(section + "/" + id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": type + ": " + json[0].label }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>${json[0].statements.length} guidance statements support this ${type.toLowerCase()}:</p> <ul> ${json[0].statements.map((statement) => renderTemplate`<li><a${addAttribute(baseUri + "guidance-statements/" + idFrag(statement.id), "href")}>${statement.label}</a> - ${statement.stmt}</li>`)} </ul> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/components/MatrixItemDetails.astro", void 0);

export { $$MatrixItemDetails as $ };
