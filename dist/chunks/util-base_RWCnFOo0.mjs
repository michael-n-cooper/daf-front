import * as commonmark from 'commonmark';

// Find an object based on multiple properties
function findObjectByProperties(array, properties) {
  return array.find(obj => {
    // Check if all specified properties match
    return Object.keys(properties).every(key => compareStr(obj[key], properties[key]));
  });
}

// Return just the fragment part of a URIexport function findObjectByProperties(array, properties) {
	function idFrag(uri) {
	return uri.substring(uri.indexOf("#") + 1)
}

// Boolean indicating if two strings match ignoring whitespace and case
function compareStr(str1, str2) {
	if (str1.trim().replace(/\s+/g, ' ').toLowerCase() == str2.trim().replace(/\s+/g, ' ').toLowerCase()) return true;
	else return false;
}

function mdToHtml(str) {
	let reader = new commonmark.Parser();
	let writer = new commonmark.HtmlRenderer();
	let parsed = reader.parse(str);
	let result = writer.render(parsed);
	return result;
}

async function apiGet(path) {
	const data = await fetch ("http://localhost:3000/api/" + path);
	const json = await data.json();
	return json;
}

export { apiGet as a, findObjectByProperties as f, idFrag as i, mdToHtml as m };
