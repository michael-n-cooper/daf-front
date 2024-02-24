import { readFile, writeFile, open } from 'node:fs/promises';
import parseMD from 'parse-md';
import dbquery from './dbquery.js';
import inquirer from 'inquirer';

const testFilePath = '../../../../accessiblecommunity/Digital-Accessibility-Framework/sensory-intersection-instruction-references.md';
const typosPath = 'typos.json';

const data = await getFileData(testFilePath);

const { metadata, content } = parseMD(data);
//console.log(JSON.stringify(metadata));

const { knownMatrix, knownMatrixLabels } = await getKnownMatrix();
//console.log(JSON.stringify(knownMatrix));

//const typos = await getTypos();

// work out the full set of mappings
const mappings = expandMappings(metadata);
//console.log(JSON.stringify(mappings));

// ids of the mapping objects corresponding to the above
const mappingIds = await getMappingIds(mappings);
//console.log("IDs: " + JSON.stringify(mappingIds));

const referenceTypes = await lookupIdLabels("ReferenceType");
console.log(referenceTypes);
const tags = await lookupIdLabels("Tag");

// retrieve references, divide into research and guidelines
const { research, guidelines } = retrieveReferences(metadata);

// retrieve tags
const tagsArr = metadata.tags ? metadata.tags : new Array();

// retrieve title and statement
const { title, statement } = retrieveContent(content);
// title goes to rdfs:label
// statement goes to a11y:stmtGuidance

// construct the sparql statement
const stmtId = dbquery.uuid();
var sparql = 'insert data :' + stmtId + ' a a11y:AccessibilityStatement ; a owl:NamedIndividual ';
sparql += ' ; a11y:stmtGuidance "' + statement + '"';
sparql += ' ; rdfs:label "' + title + '"';
mappingIds.forEach(function(mapping) {
	sparql += ' ; a11y:supports :' + mapping;
});
//console.log("research " + JSON.stringify(research));
if (research.length > 0) {
	research.forEach(function(link) {
		const linkId = dbquery.uuid();
		sparql += ' . :' + linkId + ' a a11y:Reference ; a11y:refIRI = <' + link.uri + '> ; a11y:refNote = "' + link.note + '"@en ; a11y:refType :' + getIdByLabel(referenceTypes, 'research', 'ReferenceType');
		sparql += ' . :' + stmtId + ' a11y:reference :' + linkId;
	});
}
sparql += ' }';
console.log(sparql);

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
		if (compareStr(value, typo.incorrect)) return typo.correct;
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
		if (compareStr(matrixDim.label, label)) {
			returnval = matrixDim.id;
		}
	});
	return returnval;
	// if not found, ask for typo correction, store
	//const answer = await promptTypoCorrection(label);
	
	// look for mapping idd where { ?id a a11y:MatrixDimension ; rdfs:label "' + label + '"@en }');
	
}

function getIdByLabel(arr, label, addClass) {
	var id = null;
	
	arr.forEach(function(item) {
		if (compareStr(item.label, label)) {
			id = item.id;
		}
	});
	
	console.log(label);
	console.log(addClass);
	
	if (id == null && addClass !== undefined) {
	console.log("2");
		id = dbquery.uuid();
		const updateSparql = 'insert data { :' + id + ' a a11y:' + addClass + ' ; rdfs:label "' + label + '"@en }';
		dbquery.updateQuery(updateSparql);
		console.log(updateSparql);
	}
	
	return id;
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
		//console.log(referenceType);
			if (referenceType.research !== undefined && Array.isArray(referenceType.research)) {
				referenceType.research.forEach(function(ref) {
					if (Array.isArray(ref)) research.push({"uri": ref[0], "note": ref[1]});
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

function compareStr(str1, str2) {
	if (str1.trim().replace(/\s+/g, ' ').toLowerCase() == str2.trim().replace(/\s+/g, ' ').toLowerCase()) return true;
	else return false;
}

async function lookupIdLabels(type) {
	var returnval = new Array();
	const results = await dbquery.selectQuery('select ?id ?label where { ?id a a11y:' + type + ' } order by ?label');
	if (results.results.bindings.length > 0) {
		results.results.bindings.forEach(function(result) {
			returnval.push({id: result.id, label: result.label});
		});
	}
	return returnval;
}