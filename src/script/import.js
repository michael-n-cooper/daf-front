import { readFile, writeFile, open } from 'node:fs/promises';
import parseMD from 'parse-md';
import dbquery from './dbquery.js';

const testFilePath = '../../../../accessiblecommunity/Digital-Accessibility-Framework/sensory-intersection-instruction-references.md';
const typosPath = 'typos.json';

const data = await getFileData(testFilePath);
const knownMatrix = await getKnownMatrix();
const typos = await getTypos();

const { metadata, content } = parseMD(data);
//console.log(JSON.stringify(metadata));

// work out the full set of mappings
const mappings = expandMappings(metadata);
//console.log(mappings);

// retrieve the ids for those mappings from the db
const mappingIds = getMappingIds(mappings);

// retrieve references, divide into research and guidelines
const references = retrieveReferences(metadata);

// retrieve tags
const tags = metadata.tags;

// retrieve title and statement
const { title, statement } = retrieveContent(content);
// title goes to rdfs:label
// statement goes to a11y:stmtGuidance

// construct the sparql statement

async function getFileData(path) {
	try {
	  const contents = await readFile(path, { encoding: 'utf8' });
	  return (contents);
	} catch (err) {
	  console.error(err.message);
	  return null;
	}
}

async function getKnownMatrix() {
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
		const promise = writeFile(typosPath, JSON.stringify(typos), { encoding: 'utf8' });
		await promise;
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

async function getMatrixDimId(label) {
	// check against list of known typos, correct
	label = checkTypo(label);
	
	// look for mapping idd where { ?id a a11y:MatrixDimension ; rdfs:label "' + label + '"@en }');
	var matrixDimId = await lookupMatrixDimId(label);
	var matrixDimId = await lookupMatrixDimId(label);
	
}

async function lookupMatrixDimId(label) {
	const sparql = 'select ?id where { ?id a a11y:MatrixDimension ; rdfs:label ?uc filter(lcase(str(?uc)) = "' + label.toLowerCase() + '") }';
	var res = await dbquery.selectQuery(sparql);
	// if not found, ask for typo correction, store
	if (res.results.bindings.length == 0) {


	// repeat look for mapping id
	}
	return idFrag(res.results.bindings[0].id.value);
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
			userNeeds.forEach(function(userNeed) {
				userNeedRelevances.forEach(function(userNeedRelevance) {
					const functionalNeedId = getMatrixDimId(functionalNeed);
					const userNeedId = getMatrixDimId(userNeed);
					const userNeedRelevanceId = getMatrixDimId(userNeedRelevance);
					expandedMappings.push([functionalNeedId, userNeedId, userNeedRelevanceId]);
				});
			});
		});
	});
	return (expandedMappings);

}

function getMappingIds(mappings) {
	var mappingIds = new Array();
	mappings.forEach(function(mapping) {
		var mId;
		


		// select id for that mapping
		/* 
		var sparql = "select ?id where { ?id a a11y:Mapping . ";
		if (typeof mapping[0] === 'object') sparql += "?id a a11y:Mapping ; a11y:supports ?in . ?in a a11y:IntersectionNeed ; a11y:supports ?fn1 ; a11y:supports ?fn2 . ?fn1 rdfs:label ?fn1l filter (lcase(str(?fn1l)) = '" + mapping[0].intersection[0].toLowerCase() + "') . ?fn2 rdfs:label ?fn2l filter (lcase(str(?fn2l)) = '" + mapping[0].intersection[1].toLowerCase() + "')";
		else sparql += "?id a11y:supports ?fn . ?fn a a11y:FunctionalNeed ; rdfs:label ?fnl filter (lcase(str(?fnl)) = '" + mapping[0].toLowerCase() + "') . ";
		sparql += "?id a11y:supports ?un . ?un a a11y:UserNeed ; rdfs:label ?unl filter (lcase(str(?unl)) = '" + mapping[1].toLowerCase() + "') . ";
		sparql += "?id a11y:supports ?unr . ?unr a a11y:UserNeedRelevance ; rdfs:label ?unrl filter (lcase(str(?unrl)) = '" + mapping[2].toLowerCase() + "')";
		sparql += "}";
		 *  */
		//console.log(sparql);
		
		//run query and get value from the JSON
		// TODO
		// if null, add mapping
		/* 
			mId = dbquery.uuid();
			sparql = "insert {:" + mId + " a owl:NamedIndividual ; a a11y:MatrixMapping ; a11y:supports ?fn ; a11y:supports ?un ; a11y:supports ?unr } where {";
			if (typeof mapping[0] === 'object') sparql += "?fn a a11y:IntersectionNeed ; a11y:supports ?fn1 ; a11y:supports ?fn2 . ?fn1 rdfs:label ?fn1l filter (lcase(str(?fn1l)) = '" + mapping[0].intersection[0].toLowerCase() + "') . ?fn2 rdfs:label ?fn2l filter (lcase(str(?fn2l)) = '" + mapping[0].intersection[1].toLowerCase() + "') .";
			else sparql += "?fn a a11y:FunctionalNeed ; rdfs:label ?fnl filter (lcase(str(?fnl)) = '" + mapping[0].toLowerCase() + "') . ";
			sparql += "?un a a11y:UserNeed ; rdfs:label ?unl filter (lcase(str(?unl)) = '" + mapping[1].toLowerCase() + "') . ";
			sparql += "?unr a a11y:UserNeedRelevance ; rdfs:label ?unrl filter (lcase(str(?unrl)) = '" + mapping[2].toLowerCase() + "')";
			sparql += "}";
			console.log(sparql);
		
		
		//mappingIds.push(mId);
		 *  */
	});
	return mappingIds;
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