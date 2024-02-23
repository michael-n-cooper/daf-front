import { readFile, writeFile, open } from 'node:fs/promises';
import parseMD from 'parse-md';
import dbquery from './dbquery.js';
import inquirer from 'inquirer';

const testFilePath = '../../../../accessiblecommunity/Digital-Accessibility-Framework/wayfinding-accessible-route.md';
const typosPath = 'typos.json';

const data = await getFileData(testFilePath);
const { knownMatrix, knownMatrixLabels } = await getKnownMatrix();
//console.log(JSON.stringify(knownMatrix));
//const typos = await getTypos();


const { metadata, content } = parseMD(data);
//console.log(JSON.stringify(metadata));

// work out the full set of mappings
const mappings = expandMappings(metadata);
//console.log(JSON.stringify(mappings));

var mappingIds = await getMappingIds(mappings);
console.log("IDs: " + JSON.stringify(mappingIds));

// retrieve references, divide into research and guidelines
const references = retrieveReferences(metadata);

// retrieve tags
const tags = metadata.tags;

// retrieve title and statement
const { title, statement } = retrieveContent(content);
// title goes to rdfs:label
// statement goes to a11y:stmtGuidance

// construct the sparql statement
var sparql = 'insert data :' + dbquery.uuid() + ' a a11y:AccessibilityStatement ; a owl:NamedIndividual ';
mappings.forEach(function(mapping) {
console.log (JSON.stringify(mapping));
	sparql += ' ; a11y: supports ' + mapping.id;
});
sparql += ' ; rdfs:label "' + title + '"';
sparql += ' ; a11y:stmtGuidance "' + statement + '"';
sparql += ' }';
console.log (sparql);

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
	var knownMLs = new Array();
	const fromDb = await dbquery.selectQuery('select ?id ?label where { ?id a a11y:MatrixDimension ; rdfs:label ?label } order by ?label'); // should split into one for each type to avoid same-label issues
	fromDb.results.bindings.forEach(function(item) {
		matrix.push({id: idFrag(item.id.value), label: item.label.value});
		knownMLs.push(item.label.value);
	});
	return { knownMatrix: matrix, knownMatrixLabels: knownMLs };
}

function lookupIntersectionFromLabel () {
	
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
	typos.forEach(function (typo) {
		if (value.toLowerCase() === typo.incorrect.toLowerCase()) return typo.correct;
	});
	return value;
}

function idFrag(uri) {
	return uri.substring(uri.indexOf("#") + 1)
}

function getMatrixDimId(label) {
	var returnval = null;
	
	// check against list of known typos, correct
	//label = checkTypo(label);
	
	var matrixDimId = knownMatrix.forEach(function(matrixDim) {
		if (matrixDim.label.toLowerCase() === label.toLowerCase()) {
			returnval = matrixDim.id;
		}
	});
	return returnval;
	// if not found, ask for typo correction, store
	//const answer = await promptTypoCorrection(label);
	
	// look for mapping idd where { ?id a a11y:MatrixDimension ; rdfs:label "' + label + '"@en }');
	
}

async function promptTypoCorrection(label) {
	inquirer.prompt([
    {
    		type: "rawlist",
    		name: "corLabel",
    		message: "Unable to find '" + label + "'. Please select the correct item from the list.",
    		choices: ["choice 1", "choice 2", "testing"],
    		waitUserInput: true,
    		loop: false
    }
	  	]).then((answer) => {
	  		console.log(JSON.stringify(answer));
			return answer;
	  	});
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
	console.log(expandedMappings);
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
	console.log ("mappingidsparql: " + sparql);
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

function retrieveReferences(mappings) {
	var research, guidelines = new Array();
	if (mappings.references) {
		const references = mappings.references;
		
		if (references.research) {
			if (Array.isArray(references.research)) {
				references.research.forEach(function(link) {
					research.push({"uri": link[0], "note": link[1]});
				});
			}
		}
		
		if (references.guidelines) {
			if (Array.isArray(references.guidelines)) {
				references.guidelines.forEach(function(link) {
					guidelines.push({"uri": link[0], "note": link[1]});
				});
			}
		}
	}
	//references.research.forEach(function(link) {
		
	//});
	//console.log(guidelines);
	
	return {"research": research, "guidelines": guidelines};
}

function retrieveContent(content) {
	const title = content.match(/(?<=#\s).*/)[0];
	const statement = content.match(/^\w.*$/m)[0];
	return {"title": title, "statement": statement};
}

function locateMapping() {
	
}

function uploadData() {
/* 
const body = {a: 1};

const response = await fetch('https://httpbin.org/post', {
	method: 'post',
	body: JSON.stringify(body),
	headers: {'Content-Type': 'application/json'}
});
const data = await response.json();

console.log(data);
 */
}