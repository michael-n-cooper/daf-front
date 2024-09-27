import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute } from './astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_DZ1qsoS-.mjs';
import { b as baseUri } from './util_4wpGfNoh.mjs';
import { a as apiGet, i as idFrag } from './util-base_RWCnFOo0.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
const $$IdGroupMembers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$IdGroupMembers;
  const { id, section, subsection, title } = Astro2.props;
  const json = await apiGet(section + "/" + idFrag(id));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title + ": " + json[0].label }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>This group includes the following items:</p> <ul> ${json[0].members.map((item) => renderTemplate`<li><a${addAttribute(baseUri + subsection + "/" + idFrag(item.id), "href")}>${item.label}</a></li>`)} </ul> ` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/components/IdGroupMembers.astro", void 0);

export { $$IdGroupMembers as $ };
