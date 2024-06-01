var promises = new Array();

promises.push(apiGet("functional-need-categories"));
promises.push(apiGet("functional-needs"));
promises.push(apiGet("user-needs"));
promises.push(apiGet("user-need-contexts"));
promises.push(apiGet("mappings"));

Promise.all(promises).then((values) => {
	const functionalNeedCategories = values[0];
	const functionalNeeds = values[1];
	const userNeeds = values[2];
	const userNeedContexts = values[3];
	const mappings = values[4];


	const table = document.getElementById("matrixTable");

	const base = "http://localhost:4321/";

	//thead
	var thead = document.createElement("thead");

	// row 1: functional need categories
	var row = document.createElement("tr");
	row.append(document.createElement("td"), document.createElement("td"));

	functionalNeedCategories.forEach(function(category) {
		var cell = document.createElement("th");
		cell.scope = "colgroup";
		cell.colSpan = filterObjectByProperties(functionalNeeds, {"categoryId": category.id}).length;

		var link = document.createElement("a");
		link.href = base + category.id;
		link.append(document.createTextNode(category.label));

		cell.append(link);
		row.append(cell);
	});

	thead.append(row);

	// row 2: functional needs
	var row = document.createElement("tr");
	row.append(document.createElement("td"), document.createElement("td"));

	functionalNeedCategories.forEach(function(category) {
		functionalNeedList = filterObjectByProperties(functionalNeeds, {"categoryId": category.id});
		functionalNeedList.forEach(function(fn) {

			var cell = document.createElement("th");
			cell.scope = "col";
		
			var link = document.createElement("a");
			link.href = base + "functional-needs/" + fn.id;
			link.append(document.createTextNode(fn.label));

			cell.append(link);
			row.append(cell);
		});
	});

	thead.append(row);

	table.append(thead);

	//tbody
	var tbody = document.createElement("tbody");

	// loop user needs
	userNeeds.forEach(function(need) {
		var count = 0;

		// loop user need contexts
		userNeedContexts.forEach(function(context) {
			var row = document.createElement("tr");

			if (count == 0) {
				var cell = document.createElement("th");
				cell.scope = "rowgroup";
				cell.rowSpan = userNeedContexts.length;
		
				var link = document.createElement("a");
				link.href = base + "user-needs/" + need.id;
				link.append(document.createTextNode(need.label));

				cell.append(link);
				row.append(cell);
			}

			var cell = document.createElement("th");
			cell.scope = "row";
		
			var link = document.createElement("a");
			link.href = base + "user-need-contexts/" + context.id;
			link.append(document.createTextNode(context.label));

			cell.append(link);
			row.append(cell);

			// loop functional needs
			functionalNeedCategories.forEach(function(category) {
				functionalNeedList = filterObjectByProperties(functionalNeeds, {"categoryId": category.id});
				functionalNeedList.forEach(function(fn) {
					var cell = document.createElement("td");

					var statements = filterObjectByProperties(mappings, {"fnId": fn.id, "unId": need.id, "unrId": context.id});

					if (statements.length > 0) {
						var list = document.createElement("ul");
						statements.forEach(function(statement) {
							var item = document.createElement("li");
							var link = document.createElement("a");
							link.href = base + "statements/" + statement.id;
							link.append(document.createTextNode(findObjectByProperties(statements, {"id": statement.id}).label));
							item.append(link);
							list.append(item);
						});
						cell.append(list);
					}

					row.append(cell);
				});

			});
			tbody.append(row);
			count++;
		});


	});


	table.append(tbody);
});

async function apiGet(path) {
	const data = await fetch ("http://localhost:3000/api/" + path);
	const json = await data.json();
	return json;
}

// Function to find an object based on multiple properties
function findObjectByProperties(array, properties) {
  return array.find(obj => {
    // Check if all specified properties match
    return Object.keys(properties).every(key => compareStr(obj[key], properties[key]));
  });
}
function filterObjectByProperties(array, properties) {
  return array.filter(obj => {
    // Check if all specified properties match
    return Object.keys(properties).every(key => compareStr(obj[key], properties[key]));
  });
}
function compareStr(str1, str2) {
	if (str1.trim().replace(/\s+/g, ' ').toLowerCase() == str2.trim().replace(/\s+/g, ' ').toLowerCase()) return true;
	else return false;
}
function idFrag(uri) {
	return uri.substring(uri.indexOf("#") + 1)
}


