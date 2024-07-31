import { JSDOM } from 'jsdom';
import { Script } from "node:vm";
import { readFile } from 'node:fs/promises';

export async function buildMatrix(scrPath, data) {
    const jsdomOptions = {runScripts: "dangerously", resources: "usable"};
    const dom = new JSDOM('', jsdomOptions);
    const vmContext = dom.getInternalVMContext();

    const scrData = "\nlet data = " + data + ";\ngenerateMatrix(data);\n"
    const scr = await readFile(scrPath, 'utf8');
    const scrCombined = scr + scrData;
    const script = new Script(scrCombined);

    let table = await new Promise((resolve) => {
        dom.window.document.addEventListener("MatrixTableCreated", (e) => {
            let result = dom.window.document.getElementById("matrixTable").outerHTML;
            //console.log(result);
            resolve(result);
        });
        script.runInContext(vmContext);
    });
    return table;
}
