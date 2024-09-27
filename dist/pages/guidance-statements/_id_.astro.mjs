import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, F as Fragment, u as unescapeHTML, d as addAttribute } from '../../chunks/astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DZ1qsoS-.mjs';
import { b as baseUri } from '../../chunks/util_4wpGfNoh.mjs';
import { l as loadStaticPaths } from '../../chunks/load-static-paths_CjFPet2l.mjs';
import { scheduler } from 'node:timers/promises';
/* empty css                                   */
import { a as apiGet, i as idFrag, f as findObjectByProperties, m as mdToHtml } from '../../chunks/util-base_RWCnFOo0.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
async function getStaticPaths() {
  const section = "guidance-statements";
  const paths = await loadStaticPaths(section);
  return paths;
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const json = await apiGet("statements/" + id);
  function cleanMappings(mappingsResult) {
    var res = new Array();
    mappingsResult.forEach(function(mapping) {
      if (mapping.id != "" && !findObjectByProperties(res, { "id": mapping.id })) res.push(mapping);
    });
    return res;
  }
  async function getMappings(id2) {
    await scheduler.wait(100);
    console.log(id2);
    let maps = await apiGet(id2);
    return maps;
  }
  var rmPromises = new Array();
  json[0].mappings.forEach((mapping) => rmPromises.push(getMappings("mappings/" + idFrag(mapping.id))));
  let rm = [];
  await Promise.all(rmPromises).then(function(results) {
    results.forEach((result) => rm = rm.concat(result));
  });
  const richerMappings = cleanMappings(rm);
  var actmPromises = new Array();
  json[0]["simple-curve-maps"].forEach((mapping) => actmPromises.push(getMappings("simple-curve-maps/", idFrag(mapping.id))));
  let actm = [];
  await Promise.all(actmPromises).then(function(results) {
    results.forEach((result) => actm = actm.concat(result));
  });
  const accommTypeMappings = cleanMappings(actm);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": json[0].label }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div><p class="stmt">${json[0].stmt}</p>${typeof json[0].note !== "undefined" && json[0].note != null ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML("<h2>Notes</h2>" + mdToHtml(json[0].note))}` })}` : ""}<h2>Accommodation type mappings</h2><table><thead><tr><th>Functional ability</th><th>Accommodation type</th><th>Accessibility characteristic</th></tr></thead><tbody>${accommTypeMappings.map((item) => renderTemplate`<tr><td><a${addAttribute(baseUri + "functional-abilities/" + idFrag(item.abilityId), "href")}>${item.abilityLabel}</a></td><td><a${addAttribute(baseUri + "accommodation-types/" + idFrag(item.accommId), "href")}>${item.accommLabel}</a></td><td><a${addAttribute(baseUri + "accessibility-characteristics/" + idFrag(item.charId), "href")}>${item.charLabel}</a></td></tr>`)}</tbody></table><h2>Functional need mappings</h2><table><thead><tr><th>Functional need</th><th>User need</th><th>Context</th></tr></thead><tbody>${richerMappings.map((item) => renderTemplate`<tr><td><a${addAttribute(baseUri + (typeof item.functionalNeed === "undefined" ? "intersection-needs/" : "functional-needs/") + idFrag(typeof item.functionalNeed === "undefined" ? item.intersectionNeed.id : item.functionalNeed.id), "href")}>${typeof item.functionalNeed === "undefined" ? item.intersectionNeed.label : item.functionalNeed.label}</a></td><td><a${addAttribute(baseUri + "user-needs/" + idFrag(item.userNeed.id), "href")}>${item.userNeed.label}</a></td><td><a${addAttribute(baseUri + "user-need-contexts/" + idFrag(item.userNeedRelevance.id), "href")}>${item.userNeedRelevance.label}</a></td></tr>`)}</tbody></table><h2>References</h2><ul>${json[0].references.map((item) => renderTemplate`<li>${idFrag(item.type)}: <a${addAttribute(item.refIRI, "href")}>${item.refNote}</a></li>`)}</ul><h2>Tags</h2><ul>${json[0].tags.map((item) => renderTemplate`<li><a${addAttribute(baseUri + "tags/" + idFrag(item.id), "href")}>${item.label}</a></li>`)}</ul><p>Imported from <a${addAttribute(json[0].contentIRI, "href")}>${json[0].contentIRI}</a></p></div>` })}`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/guidance-statements/[id].astro", void 0);

const $$file = "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/pages/guidance-statements/[id].astro";
const $$url = "/daf-front/guidance-statements/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	getStaticPaths,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
