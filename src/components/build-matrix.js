import * as dbquery from '../script/dbquery.js';
import {findObjectByProperties, filterObjectByProperties, baseUri} from '../script/util.js';

var debug = new Array();
// Get the matrix data, including mapping info etc.

// Get the FunctionalNeedCategory, FunctionalNeed, UserNeed, UserNeedRelevance into arrays (FN grouped into FNC)
const functionalNeedCategories = await lookupFunctionalNeedCategories();
const userNeeds = await lookupList('UserNeed');
const userNeedRelevances = await lookupList('UserNeedRelevance');

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
	table += "<th scope='colgroup' colspan='2'>Total</th>";
	table += "</tr>"
	
	// row 2
	rowNum++;
	table += "<tr><td></td><td></td>"; colNum = 3;
	functionalNeedCategories.forEach(function(fnc) {
		fnc.functionalNeeds.forEach(function(fn) {
			const section = fnc.label == 'Intersections' ? "intersection-needs/" : "functional-needs/";
			table += "<th scope='col' class='" + rc(rowNum, colNum++) + "'><a href='" + baseUri + section + fn.id + "'>" + fn.label + "</a></th>"; 
		});
	});
	table += "<th scope='col'>User need</th>";
	table += "<th scope='col'>Relevance</th>";
	table += "</tr>"
	
	table += "</thead>";
	table += "<tbody>";
	
	// rows per user need
	userNeeds.forEach(function(un) {
		rowNum++;
		table += "<tr><th scope='rowgroup' rowspan='" + userNeedRelevances.length + "'><a href='" + baseUri + "user-needs/" + un.id + "'>" + un.label + "</a></th>";
		var groupPos = 1;
		userNeedRelevances.forEach(function(unr) {
			if (groupPos > 2) {
				table += "<tr>"; 
			}
			rowNum++;
			table += "<th scope='row' class='" + rc(rowNum, 2) + "'><a href='" + baseUri + "user-need-relevances/" + unr.id + "'>" + unr.label + "</a></th>";
			
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
			table += "<td></td><td></td>"; // for totals 
			table += "</tr>";
			groupPos++;
		});
	});
	
	table += "</tbody>";
	table += "<tfoot>";
	table += "<tr><th colspan'2' scope='row'>Total Functional need</th>"; // total
	functionalNeedCategories.forEach(function(fnc) {
		fnc.functionalNeeds.forEach(function(fn) {
			table += "<td></td>";
		});
	});
	table += "<td></td><td></td>"; // for totals 
	table += "</tr>";
	
	table += "</tfoot>";
	table += "</table>";
	
	return table;
}

// returning a object {id, label, functionalNeeds[id, label]}
async function lookupFunctionalNeedCategories () {
	let fncs = new Array();
	let fns = new Array();
	
	//functional needs
	const fnSparql = 'select ?cId ?id ?label where { ?id a a11y:FunctionalNeed ; rdfs:label ?label ; a11y:supports ?cId . ?cId rdfs:label ?clabel } order by ?clabel ?label';	
	const fnRes = await dbquery.selectQuery(fnSparql);
	fnRes.results.bindings.forEach(function(fn) {
		if (!fn.label.value.includes("intersection")) fns.push({"id": dbquery.idFrag(fn.id.value), "label": fn.label.value, "cId": dbquery.idFrag(fn.cId.value)});
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
	var seen = new Array();
	const itscSparql = 'select ?id ?label where { ?id a a11y:IntersectionNeed ; rdfs:label ?label }';
	const itscRes = await dbquery.selectQuery(itscSparql);
	if (typeof itscRes.results !== 'undefined') itscRes.results.bindings.forEach(function(itsc) {
		const itscId = dbquery.idFrag(itsc.id.value);
		if (!seen.includes(itscId)) {
		 	arr.push({"id": dbquery.idFrag(itscId), "label": itsc.label.value});
		 	seen.push(itscId);
		}
	});
	return arr;
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

