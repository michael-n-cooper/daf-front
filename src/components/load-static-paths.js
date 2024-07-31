import { readFile } from 'node:fs/promises';

export async function loadStaticPaths(section) {
    const idsPath = "./src/pages/" + section + "/ids.js";
    const ids = await readFile(idsPath, 'utf8');
    return (JSON.parse(ids));
}