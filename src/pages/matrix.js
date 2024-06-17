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
	
	const base = "http://localhost:4321/";
	const counts = {};

	const table = document.getElementById("matrixTable");

	//thead
	var thead = document.createElement("thead");

	// row 1: functional need categories
	var row1 = document.createElement("tr");
	row1.append(document.createElement("td"), document.createElement("td"));

	functionalNeedCategories.forEach(function(category) {
		var cell = document.createElement("th");
		cell.id = idFrag(category.id);
		cell.scope = "colgroup";

		var link = document.createElement("a");
		link.href = base + "functional-need-categories/" + idFrag(category.id);
		link.append(document.createTextNode(category.label));

		cell.append(link);
		row1.append(cell);
	});

	thead.append(row1);

	// row 2: functional needs
	var row2 = document.createElement("tr");
	row2.append(document.createElement("td"), document.createElement("td"));

	functionalNeedCategories.forEach(function(category) {
		counts[idFrag(category.id)] = 0;

		functionalNeedList = filterObjectByProperties(functionalNeeds, {"categoryId": category.id});
		row1.cells[idFrag(category.id)].colSpan = functionalNeedList.length;

		functionalNeedList.forEach(function(fn) {
			counts[idFrag(fn.id)] = 0;

			var cell = document.createElement("th");
			cell.id = idFrag(fn.id);
			cell.scope = "col";
		
			var link = document.createElement("a");
			link.href = base + "functional-needs/" + idFrag(fn.id);
			link.append(document.createTextNode(fn.label));

			cell.append(link);
			row2.append(cell);
		});
	});

	thead.append(row2);

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
				counts[idFrag(need.id)] = 0;

				var cell = document.createElement("th");
				cell.id = idFrag(need.id);
				cell.scope = "rowgroup";
				cell.rowSpan = userNeedContexts.length;
		
				var link = document.createElement("a");
				link.href = base + "user-needs/" + idFrag(need.id);
				link.append(document.createTextNode(need.label));

				cell.append(link);
				row.append(cell);
			}

			var uncid = idFrag(need.id) + "+" + idFrag(context.id);
			counts[uncid] = 0;
			var cell = document.createElement("th");
			cell.id = uncid;
			cell.scope = "row";
		
			var link = document.createElement("a");
			link.href = base + "user-need-contexts/" + idFrag(context.id);
			link.append(document.createTextNode(context.label));

			cell.append(link);
			row.append(cell);

			// loop functional needs
			functionalNeedCategories.forEach(function(category) {
				functionalNeedList = filterObjectByProperties(functionalNeeds, {"categoryId": category.id});
				functionalNeedList.forEach(function(fn) {
					var cell = document.createElement("td");

					var maps = filterObjectByProperties(mappings, {"fnId": fn.id, "unId": need.id, "unrId": context.id});

					if (maps.length > 0) {
						var div = document.createElement("div");
						div.id = idFrag(maps[0].id);
						div.classList.add("mapping");
						if (maps[0].applicable == "false") {
							div.classList.add("na");
							div.append(document.createTextNode("NA"));
						}

						var list = document.createElement("ul");
						maps.forEach(function (map) {
							if (map.stmtId != null) {
								var stmt = findObjectByProperties(statements, { "id": map.stmtId });

								var item = document.createElement("li");
								var link = document.createElement("a");
								link.href = base + "statements/" + idFrag(map.stmtId);
								link.class = idFrag(map.stmtId);
								link.title = stmt.stmt;
								link.append(document.createTextNode(stmt.label));
								item.append(link);
								list.append(item);

								counts[idFrag(need.id)]++;
								counts[uncid]++;
								counts[idFrag(category.id)]++;
								counts[idFrag(fn.id)]++;
							}
						});
						if (list.childNodes.length > 0) div.append(list);

						cell.append(div);
					}

					row.append(cell);
				});

			});
			tbody.append(row);
			count++;
		});


	});

	table.append(tbody);
	console.log(counts);

	var countIterator = Object.keys(counts);
	countIterator.forEach(function(c) {
		var cell = document.getElementById(c);
		var span = document.createElement("span");
		span.class = "total";
		span.append(document.createTextNode(" (" + counts[c] + ") "));
		cell.append(span);
	});
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


