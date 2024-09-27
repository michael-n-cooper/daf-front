import { c as createAstro, a as createComponent, r as renderTemplate, d as addAttribute, e as renderHead, f as renderSlot } from './astro/server_D2pDC31e.mjs';
import 'kleur/colors';
import 'clsx';
import { b as baseUri } from './util_4wpGfNoh.mjs';

const $$Astro = createAstro("https://michael-n-cooper.github.io");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props.frontmatter || Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"${addAttribute(baseUri + "favicon.svg", "href")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css"${addAttribute(baseUri + "daf.css", "href")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> <header> <h1>${title}</h1> </header> <main>${renderSlot($$result, $$slots["default"])}</main> <footer> <p><a${addAttribute(baseUri, "href")}>Overview</a> | <a${addAttribute(baseUri + "docs", "href")}>Documentation</a> | <a${addAttribute(baseUri + "matrix-accommtype", "href")}>Accommodation types matrix</a></p> <p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">Digital Accessibility Framework database</span> by <span property="cc:attributionName">Michael Cooper</span> is licensed under <a href="http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution-NonCommercial 4.0 International<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"></a></p> </footer> </body></html>`;
}, "C:/Documents/code/GitHub/michael-n-cooper/daf-front/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
