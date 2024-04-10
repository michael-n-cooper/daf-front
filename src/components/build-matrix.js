import * as dbquery from '../script/dbquery.js';
import {findObjectByProperties, filterObjectByProperties, baseUri, idFrag} from '../script/util.js';

var debug = new Array();
// Get the matrix data, including mapping info etc.

// Get the FunctionalNeedCategory, FunctionalNeed, UserNeed, UserNeedRelevance into arrays (FN grouped into FNC)
const functionalNeedCategories = await lookupFunctionalNeedCategories();
const userNeeds = await lookupUserNeeds();

// Get the set of matrix items
const mappings = await lookupMappings();

export const table = buildTable();

// generate a class attribute for row and column number
function rc(row, col) {
	return "row" + row + " col" + col;
}

// Go through the UN/UNR/FN arrays and put in appropriate content from the matrix data, or empty cell if not present
function buildTable() {
	var rowNum = 1; var colNum = 1;
	var table = "<table id='table'>";
	
	//table += "<caption>Matrix</caption>"
	table += "<col /><col />";
	functionalNeedCategories.forEach(function(fnc) {
		table += "<colgroup span='" + fnc.functionalNeeds.length + "' />";
	});
	table += "<col /><col />";
	table += "<thead>";
	
	// row 1
	table += "<tr><td></td><td></td>"; 
	functionalNeedCategories.forEach(function(fnc) {
		table += "<th scope='colgroup' colspan='" + fnc.functionalNeeds.length + "'>" + fnc.label + "</th>"; 
	});
	table += "</tr>"
	
	// row 2
	rowNum++;
	table += "<tr><td></td><td></td>"; colNum = 3;
	functionalNeedCategories.forEach(function(fnc) {
		fnc.functionalNeeds.forEach(function(fn) {
			const section = fnc.label == 'Intersections' ? "intersection-needs/" : "functional-needs/";
			table += "<th scope='col' class='" + rc(rowNum, colNum++) + "'><a href='" + baseUri + section + fn.id + "'>" + fn.label + "</a> <span class='total'>(" + fn.total + ")</span></th>"; 
		});
	});
	table += "</tr>"
	
	table += "</thead>";
	table += "<tbody>";
	
	// rows per user need
	userNeeds.forEach(function(un) {
		rowNum++;
		table += "<tr><th scope='rowgroup' rowspan='" + un.relevances.length + "'><div><a href='" + baseUri + "user-needs/" + un.id + "'>" + un.label + "</a> <span class='total'>(" + un.total + ")</span></div></th>";
		var groupPos = 1;
		un.relevances.forEach(function(unr) {
			if (groupPos > 1) {
				table += "<tr>"; 
			}
			rowNum++;
			table += "<th scope='row' class='" + rc(rowNum, 2) + "'><a href='" + baseUri + "user-need-relevances/" + unr.id + "'>" + unr.label + "</a> <span class='total'>(" + unr.total + ")</span></th>";
			
			colNum = 3;
			functionalNeedCategories.forEach(function(fnc) {
				fnc.functionalNeeds.forEach(function(fn) {
					table += "<td class='" + rc(rowNum, colNum++) + "'>";
					let mappingObj = findObjectByProperties(mappings, {"fnId": fn.id, "unId": un.id, "unrId": unr.id});
					if (typeof mappingObj !== 'undefined') {
						table += "<div id='" + mappingObj.id + "' class='mapping " + (mappingObj.applicable == true ? "applicable" : "na") + "'" + (mappingObj.statements.length > 0 ? (" popovertarget='" + mappingObj.id + "-popover" + "'") : "") + ">";
						if (mappingObj.applicable == 'false') table += "<p>N/A</p>";
						if (mappingObj.statements.length > 0) {
							table += "<ul>";
							mappingObj.statements.forEach(function(stmt) {
								table += "<li>";
								table += "<a href='" + baseUri + "guidance-statements/" + stmt.id + "' title='" + stmt.guidance + "' class='" + stmt.id + "'>" + stmt.label + "</a>";
								table += "</li>";
							});
							table += "</ul>";
						}
						table += "</div>";
					}
					table += "</td>";
				});
			});
			table += "</tr>";
			groupPos++;
		});
	});
	
	table += "</tbody>";
	table += "</table>";
	
	return table;
}

// returning a object {id, label, functionalNeeds[id, label, total]}
async function lookupFunctionalNeedCategories () {
	let fncs = new Array();
	let fns = new Array();
	
	//functional needs
	const fnSparql = 'select ?cId ?id ?label ?total where { ?id a a11y:FunctionalNeed ; rdfs:label ?label ; a11y:supports ?cId . ?cId rdfs:label ?clabel . optional { select ?id (count(?supId) as ?total) where { select distinct ?id ?supId where { ?id a a11y:FunctionalNeed . ?supId a a11y:AccessibilityStatement ; a11y:supports / a11y:supports ?id  } } group by ?id } } order by ?clabel ?label';	
	const fnRes = await dbquery.selectQuery(fnSparql);
	fnRes.results.bindings.forEach(function(fn) {
		if (!fn.label.value.includes("intersection")) fns.push({"id": dbquery.idFrag(fn.id.value), "label": fn.label.value, "cId": dbquery.idFrag(fn.cId.value), "total": typeof fn.total !== 'undefined' ? fn.total.value : 0});
	});

	//functional need categories
	const fncRes = await lookupList('FunctionalNeedCategory');
	fncRes.forEach(function(fnc) {
		const filtered = fns.filter(obj => obj.cId == dbquery.idFrag(fnc.id));
		if (fnc.label != 'Intersections') fncs.push({"id": dbquery.idFrag(fnc.id), "label": fnc.label, "functionalNeeds": filtered});
	});
	
	// add intersections
	const itscNeeds = await lookupIntersectionNeeds();
	fncs.push({"id": "placeholder", "label": "Intersections", "functionalNeeds": itscNeeds});
	
	return fncs;
}

// look up intersection needs
async function lookupIntersectionNeeds() {
	var arr = new Array();
	const itscSparql = 'select ?id ?label ?total where { ?id a a11y:IntersectionNeed ; rdfs:label ?label . optional { select ?id (count(?supId) as ?total) where { select distinct ?id ?supId where { ?id a a11y:IntersectionNeed . ?supId a a11y:AccessibilityStatement ; a11y:supports / a11y:supports ?id  } } group by ?id } } order by ?label';
	const itscRes = await dbquery.selectQuery(itscSparql);
	if (typeof itscRes.results !== 'undefined') itscRes.results.bindings.forEach(function(itsc) {
	 	arr.push({"id": dbquery.idFrag(itsc.id.value), "label": itsc.label.value, "total": typeof itsc.total !== 'undefined' ? itsc.total.value : 0});
	});
	return arr;
}

async function lookupUserNeeds() {
	let userNeeds = new Array();
	
	// user needs
	const unSparql = 'select ?id ?label ?total where { ?id a a11y:UserNeed ; rdfs:label ?label . optional { select ?id (count(?supId) as ?total) where { select distinct ?id ?supId where { ?id a a11y:UserNeed . ?supId a a11y:AccessibilityStatement ; a11y:supports / a11y:supports ?id  } } group by ?id } } order by ?label';
	const unResult = await dbquery.selectQuery(unSparql);
	unResult.results.bindings.forEach(async function(un) {
		const unId = idFrag(un.id.value);
		let needs = new Array();
		let relevances = new Array();
		
		const relevanceSparql = 'select ?id ?label ?total where { ?id a a11y:UserNeedRelevance ; rdfs:label ?label . optional { select ?id (count(?supId) as ?total) where { select distinct ?id ?supId where { ?id a a11y:UserNeedRelevance . ?supId a a11y:AccessibilityStatement ; a11y:supports / a11y:supports ?id ; a11y:supports / a11y:supports :' + unId + '  } } group by ?id } } order by ?label';
		const relevanceResult = await dbquery.selectQuery(relevanceSparql);
		relevanceResult.results.bindings.forEach(function(relevance) {
			relevances.push({"id": idFrag(relevance.id.value), "label": relevance.label.value, "total": typeof relevance.total !== 'undefined' ? relevance.total.value : 0});
		});

		userNeeds.push({"id": unId, "label": un.label.value, "total": typeof un.total !== 'undefined' ? un.total.value : 0, "relevances": relevances});
	});

	return userNeeds;
}

async function lookupMappings() {
	let matrix = new Array();
	let statements = new Array();

	const stmtSparql = 'select ?mId ?sId ?sLabel ?sGuidance where { ?mId a a11y:Mapping . ?sId a a11y:AccessibilityStatement ; a11y:supports ?mId ; rdfs:label ?sLabel ; a11y:stmtGuidance ?sGuidance }';
	const stmtResult = await dbquery.selectQuery(stmtSparql);
	stmtResult.results.bindings.forEach(function(stmt) {
		statements.push({"id": dbquery.idFrag(stmt.sId.value), "label": stmt.sLabel.value, "mId": dbquery.idFrag(stmt.mId.value), "guidance": stmt.sGuidance.value});
	});
	
	const sparql = 'select ?mId ?applicable ?fnId ?unId ?unrId where { ?mId a a11y:Mapping ; a11y:supports ?fnId ; a11y:supports ?unId ; a11y:supports ?unrId . { ?fnId a a11y:FunctionalNeed } union { ?fnId a a11y:IntersectionNeed } . ?unId a a11y:UserNeed . ?unrId a a11y:UserNeedRelevance . optional { ?mId a11y:applicable ?applicable } }';
	const result = await dbquery.selectQuery(sparql);
	result.results.bindings.forEach(function(mapping) {
		const applicable = typeof mapping.applicable !== 'undefined' ? mapping.applicable.value : true;
		const filtered = filterObjectByProperties(statements, {"mId": dbquery.idFrag(mapping.mId.value)}); //filter(obj => obj.mId == dbquery.idFrag(mapping.mId.value));
		matrix.push({"id": dbquery.idFrag(mapping.mId.value), "applicable": applicable, "fnId": dbquery.idFrag(mapping.fnId.value), "unId": dbquery.idFrag(mapping.unId.value), "unrId": dbquery.idFrag(mapping.unrId.value), "statements": filtered});
});
	
	return matrix;
}

async function lookupList(type) {
	let returnval = new Array();
	
	const sparql = 'select ?id ?label where { ?id a a11y:' + type + ' ; rdfs:label ?label } order by ?label';
	const result = await dbquery.selectQuery(sparql);

	result.results.bindings.forEach(function(item) {
		returnval.push({"id": dbquery.idFrag(item.id.value), "label": item.label.value});
	});
	
	return returnval;
}

