import { writeFile } from 'node:fs/promises';
import { apiGet, idFrag } from './util-base.js';

async function lookupIds(type) {
	console.log(type);
	const ids = await apiGet(type);
	var val = new Array();
	ids.forEach(function(obj) {
		val.push({ params: { id: idFrag(obj.id) } });
	});
	return val;
}

async function process(section) {
	const ids = await lookupIds(section.path);
	writeFile("../pages/" + section.localpath + "/ids.js", JSON.stringify(ids));
	console.log(section.path);
}

let paths = new Array();
paths.push({"path": "accessibility-characteristic-groups", "localpath": "accessibility-characteristic-groups"});
paths.push({"path": "accessibility-characteristics", "localpath": "accessibility-characteristics"});
paths.push({"path": "accommodation-types", "localpath": "accommodation-types"});
paths.push({"path": "functional-abilities", "localpath": "functional-abilities"});
paths.push({"path": "functional-ability-groups", "localpath": "functional-ability-groups"});
paths.push({"path": "functional-need-categories", "localpath": "functional-need-categories"});
paths.push({"path": "functional-needs", "localpath": "functional-needs"});
paths.push({"path": "intersection-needs", "localpath": "intersection-needs"});
paths.push({"path": "statements", "localpath": "guidance-statements"});
paths.push({"path": "references", "localpath": "references"});
paths.push({"path": "tags", "localpath": "tags"});
paths.push({"path": "user-need-contexts", "localpath": "user-need-contexts"});
paths.push({"path": "user-needs", "localpath": "user-needs"});

let promises = new Array();
paths.forEach(function(section) {
	promises.push(process(section));
});

Promise.all(promises);