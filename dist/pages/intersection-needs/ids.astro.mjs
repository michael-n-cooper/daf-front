export { renderers } from '../../renderers.mjs';

const page = () => import('../../chunks/prerender_CoHF_L2t.mjs').then(n => n.j);

export { page };
