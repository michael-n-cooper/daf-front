import { readFile, writeFile, open } from 'node:fs/promises';
import parseMD from 'parse-md';
import * as dbquery from './dbquery.js';
import {findObjectByProperties, filterObjectByProperties} from '../script/util.js';
import inquirer from 'inquirer';

const testFilePath = '../../../../accessiblecommunity/Digital-Accessibility-Framework/no-vision-interactive-equivalent.md';
const typosPath = './typos.json';

const data = await getFileData(testFilePath);

const { metadata, content } = parseMD(data);

const knownMatrix = await getKnownMatrix();

const typos = await getTypos(); console.log(JSON.stringify(typos));
await findMatrixTypos();



const mappings = expandMappings(metadata);
const mappingIds = await getMappingIds(mappings); // ids of the mapping objects corresponding to the above
const referenceTypes = await lookupIdLabels("ReferenceType");
const tags = await lookupIdLabels("Tag");
const tagsArr = metadata.tags ? metadata.tags : new Array(); // retrieve tags
const { research, guidelines } = retrieveReferences(metadata); // retrieve references, divide into research and guidelines
const { title, statement } = retrieveContent(content); // retrieve title and statement

// construct the sparql statement
const stmtId = dbquery.uuid();
var sparql = 'insert data { :' + stmtId + ' a a11y:AccessibilityStatement ; a owl:NamedIndividual ';
sparql += ' ; a11y:stmtGuidance "' + statement + '"@en';
sparql += ' ; rdfs:label "' + title + '"@en';
mappingIds.forEach(function(mapping) {
	sparql += ' ; a11y:supports :' + mapping;
});
tagsArr.forEach(function(tag) {
	sparql += ' ; a11y:tags :' + getIdByLabel(tags, tag, 'Tag');
});
if (research.length > 0) {
	research.forEach(function(link) {
		const linkId = dbquery.uuid();
		sparql += ' . :' + linkId + ' a a11y:Reference ; a11y:refIRI <' + link.uri + '> ; a11y:refNote "' + link.note + '"@en ; a11y:refType :' + getIdByLabel(referenceTypes, 'research', 'ReferenceType');
		sparql += ' . :' + stmtId + ' a11y:references :' + linkId;
	});
}
if (guidelines.length > 0) {
	guidelines.forEach(function(link) {
		const linkId = dbquery.uuid();
		sparql += ' . :' + linkId + ' a a11y:Reference ; a11y:refIRI <' + link.uri + '> ; a11y:refNote "' + link.note + '"@en ; a11y:refType :' + getIdByLabel(referenceTypes, 'guidelines', 'ReferenceType');
		sparql += ' . :' + stmtId + ' a11y:references :' + linkId;
	});
}
sparql += ' }';
console.log(sparql);
//const importResult = await dbquery.updateQuery(sparql);
console.log(JSON.stringify(importResult));

async function getFileData(path) {
	try {
	  const contents = await readFile(path, { encoding: 'utf8' });
	  return (contents);
	} catch (err) {
	  console.error(err.message);
	  return null;
	}
}

async function getKnownMatrix() { // add intersections
	var matrix = new Array();	
	const fromDb = await dbquery.selectQuery('select ?id ?label where { ?id a a11y:MatrixDimension ; rdfs:label ?label } order by ?label'); // should split into one for each type to avoid same-label issues
	fromDb.results.bindings.forEach(function(item) {
		matrix.push({id: idFrag(item.id.value), label: item.label.value});
	});
	return matrix;
}

async function getTypos() {
	try {
	  const contents = await readFile(typosPath, { encoding: 'utf8' });
	  const json = JSON.parse(contents);
	  return (json);
	} catch (err) {
	  console.error(err.message);
	}
}

function storeTypo(inc, cor) {
	typos.push({incorrect: inc, correct: cor});
}

async function saveTypos() {
	try {
		await writeFile(typosPath, JSON.stringify(typos), { encoding: 'utf8' });
	} catch (err) {
	  console.error(err);
	} 
}

function checkTypo(value) {
	var typoObj = findObjectByProperties(typos, {"incorrect": value});
	if (typeof typoObj !== 'undefined') return typoObj.correct;
	else return value;
}

function idFrag(uri) {
	return uri.substring(uri.indexOf("#") + 1)
}

async function getMatrixDimId(label) {
	var returnval = null;
	
	// check against list of known typos, correct
	label = checkTypo(label);
	
	var matrixDimId = findObjectByProperties(knownMatrix, {"label": label});
	return matrixDimId
}

function getIdByLabel(arr, label, addClass) {
	var id = null;
	
	arr.forEach(function(item) {
		if (compareStr(item.label, label)) {
			id = item.id;
		}
	});
	
	
	if (id == null && addClass !== undefined) {
		id = dbquery.uuid();
		const updateSparql = 'insert data { :' + id + ' a a11y:' + addClass + ' ; rdfs:label "' + label + '"@en }';
		dbquery.updateQuery(updateSparql);
	}
	
	return id;
}

async function findMatrixTypos() {
	var promises = new Array();

	const mp = metadata.mappings;
	mp.forEach(function(mapping) {
	//check for arrays Array.isArray(obj)
	//handle intersection objects
		const functionalNeeds = (typeof mapping['functional-need'] === 'string') ? [mapping['functional-need']] : mapping['functional-need'];
		const userNeeds = (typeof mapping['user-need'] === 'string') ? [mapping['user-need']] : mapping['user-need'];
		const userNeedRelevances = (typeof mapping['user-need-relevance'] === 'string') ? [mapping['user-need-relevance']] : mapping['user-need-relevance'];
		
		functionalNeeds.forEach(function(functionalNeed) {
			if (!findObjectByProperties(knownMatrix, {"label": functionalNeed.label})) promises.push (promptTypoCorrection(functionalNeed.label, knownMatrix));
			userNeeds.forEach(function(userNeed) {
				if (!findObjectByProperties(knownMatrix, {"label": userNeed.label})) promises.push (promptTypoCorrection(userNeed.label, knownMatrix));
				userNeedRelevances.forEach(function(userNeedRelevance) {
					if (!findObjectByProperties(knownMatrix, {"label": userNeedRelevance.label})) promises.push (promptTypoCorrection(userNeedRelevance.label, knownMatrix));
				});
			});
		});
	});
	
	await Promise.all(promises);
}

async function promptTypoCorrection(label, arr) { //candidateArr contains candidate typo, referenceArr is the array of known values as obj.label
		inquirer.prompt([
    {
    		type: "rawlist",
    		name: "corLabel",
    		message: "Unable to find '" + label + "'. Please select the correct item from the list.",
    		choices: getOneProp(arr, 'label'),
    		waitUserInput: true,
    		loop: false
    }
	  	]).then((answer) => {
	  		console.log(JSON.stringify(answer));
			return answer;
	  	});
}

function getOneProp(arr, prop) {
	var returnval = new Array();
	arr.forEach((item) => returnval.push(item[prop]));
	return returnval;
}

function expandMappings(metadata) {
	var expandedMappings = new Array();
	const mappings = metadata.mappings;
	
	mappings.forEach(function(mapping) {
	//check for arrays Array.isArray(obj)
	//handle intersection objects
		const functionalNeeds = (typeof mapping['functional-need'] === 'string') ? [mapping['functional-need']] : mapping['functional-need'];
		const userNeeds = (typeof mapping['user-need'] === 'string') ? [mapping['user-need']] : mapping['user-need'];
		const userNeedRelevances = (typeof mapping['user-need-relevance'] === 'string') ? [mapping['user-need-relevance']] : mapping['user-need-relevance'];
		
		//console.log(functionalNeeds);
		//console.log(userNeeds);
		//console.log(userNeedRelevances);
		
		// expand out arrays of mapped items
		functionalNeeds.forEach(function(functionalNeed) {
			const functionalNeedId = getMatrixDimId(functionalNeed);
			userNeeds.forEach(function(userNeed) {
				const userNeedId = getMatrixDimId(userNeed);
				userNeedRelevances.forEach(function(userNeedRelevance) {
					const userNeedRelevanceId = getMatrixDimId(userNeedRelevance);
					expandedMappings.push([functionalNeedId, userNeedId, userNeedRelevanceId]);
				});
			});
		});
	});
	//console.log(expandedMappings);
	return (expandedMappings);
}

async function getMappingIds(mappings) {
	async function collect() {
		let promises = new Array();
		var result = new Array();
		mappings.forEach(function(mapping) {
			promises.push(getMappingId(mapping[0], mapping[1], mapping[2]));
		});
		return Promise.all(promises);
	}
	var results = await collect();
	return results;
}

async function getMappingId(functionalNeedId, userNeedId, userNeedRelevanceId) {
	const sparql = 'select ?id where { ?id a a11y:MatrixMapping ; a11y:supports :' + functionalNeedId + ' ; a11y:supports :' + userNeedId + ' ; a11y:supports :' + userNeedRelevanceId + '}';
	//console.log ("mappingidsparql: " + sparql);
	var results = await dbquery.selectQuery(sparql);
	if (results.results.bindings.length == 0) {
		const uuid = dbquery.uuid();
		const update = 'insert data { :' + uuid + ' a a11y:MatrixMapping ; a owl:NamedIndividual ; a11y:supports :' + functionalNeedId + ' ; a11y:supports :' + userNeedId + ' ; a11y:supports :' + userNeedRelevanceId + '}';
		await dbquery.updateQuery(update);
		return (uuid);
	} else {
		return idFrag(results.results.bindings[0].id.value);
	}
}

function retrieveReferences(metadata) {
	var research = new Array();
	var guidelines = new Array();
	if (metadata.references) {
		const references = metadata.references;
		
		references.forEach(function(referenceType) {
			if (referenceType.research !== undefined && Array.isArray(referenceType.research)) {
				referenceType.research.forEach(function(ref) {
					if (Array.isArray(ref) && isValidUrl(ref[0])) research.push({"uri": ref[0], "note": ref.slice(1).join(", ")});
				});
			}
			if (referenceType.guidelines !== undefined && Array.isArray(referenceType.guidelines)) {
				referenceType.guidelines.forEach(function(ref) {
					if (Array.isArray(ref) && isValidUrl(ref[0])) guidelines.push({"uri": ref[0], "note": ref.slice(1).join(", ")});
				});
			}
		});
		
	}
	
	return {"research": research, "guidelines": guidelines};
}

function retrieveContent(content) {
	const title = content.match(/(?<=#\s).*/)[0];
	const statement = content.match(/^\w.*$/m)[0];
	return {"title": title, "statement": statement};
}

// from https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
function isValidUrl(urlString) {
  	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

function compareStr(str1, str2) {
	if (str1.trim().replace(/\s+/g, ' ').toLowerCase() == str2.trim().replace(/\s+/g, ' ').toLowerCase()) return true;
	else return false;
}

async function lookupIdLabels(type) {
	var returnval = new Array();
	const sparql = 'select ?id ?label where { ?id a a11y:' + type + ' ; rdfs:label ?label } order by ?label';
	const results = await dbquery.selectQuery(sparql);
	if (results.results.bindings.length > 0) {
		results.results.bindings.forEach(function(result) {
			returnval.push({id: idFrag(result.id.value), label: result.label.value});
		});
	}
	return returnval;
}