import { a as apiGet } from './util-base_RWCnFOo0.mjs';
import { b as buildMatrix } from './build-matrix_DW4ydoMS.mjs';

async function fetchData() {
	return new Promise((resolve) => {
		var promises = new Array();

		promises.push(apiGet("functional-need-categories"));
		promises.push(apiGet("functional-needs"));
		promises.push(apiGet("user-needs"));
		promises.push(apiGet("user-need-contexts"));
		promises.push(apiGet("mappings"));
		promises.push(apiGet("statements"));
		
		Promise.all(promises).then((values) => {
			const functionalNeedCategories = values[0];
			const functionalNeeds = values[1];
			const userNeeds = values[2];
			const userNeedContexts = values[3];
			const mappings = values[4];
			const statements = values[5];

			let data = {"functionalNeedCategories": functionalNeedCategories, "functionalNeeds": functionalNeeds, "userNeeds": userNeeds, "userNeedContexts": userNeedContexts, "mappings": mappings, "statements": statements};
			//console.log(data);
			resolve(JSON.stringify(data));
		});
	});
}

async function getTable() {
    const data = await fetchData();
	let scrPath = "./src/pages/matrix-functional-needs/build-matrix-script.js";
	let table = await buildMatrix(scrPath, data);
	return table;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getTable
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, getTable as g };
