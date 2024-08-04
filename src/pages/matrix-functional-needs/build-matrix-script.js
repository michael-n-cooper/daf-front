// this script runs in JSDOM and must be in CommonJS
function generateMatrix(data, baseUri) {
    let functionalNeedCategories = data.functionalNeedCategories;
    let functionalNeeds = data.functionalNeeds;
    let userNeeds = data.userNeeds;
    let userNeedContexts = data.userNeedContexts;
    let mappings = data.mappings;
    let statements = data.statements;

    const table = document.createElement("table");
    table.id = "matrixTable";

	const counts = {};

	//thead
	var thead = document.createElement("thead");

	// row 1: functional need categories
	var row1 = document.createElement("tr");
	row1.append(document.createElement("td"), document.createElement("td"));

	functionalNeedCategories.forEach(function (category) {
		var cell = document.createElement("th");
		cell.id = idFrag(category.id);
		cell.scope = "colgroup";

		var link = document.createElement("a");
		link.href = baseUri + "functional-need-categories/" + idFrag(category.id);
		link.append(document.createTextNode(category.label));

		cell.append(link);
		row1.append(cell);
	});

	thead.append(row1);

	// row 2: functional needs
	var row2 = document.createElement("tr");
	row2.append(document.createElement("td"), document.createElement("td"));

	functionalNeedCategories.forEach(function (category) {
		counts[idFrag(category.id)] = 0;

		functionalNeedList = filterObjectByProperties(functionalNeeds, { "categoryId": category.id });
		row1.cells[idFrag(category.id)].colSpan = functionalNeedList.length;

		functionalNeedList.forEach(function (fn) {
			counts[idFrag(fn.id)] = 0;

			var cell = document.createElement("th");
			cell.id = idFrag(fn.id);
			cell.scope = "col";

			var link = document.createElement("a");
			link.href = baseUri + "functional-needs/" + idFrag(fn.id);
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
	userNeeds.forEach(function (need) {
		var count = 0;

		// loop user need contexts
		userNeedContexts.forEach(function (context) {
			var row = document.createElement("tr");

			if (count == 0) {
				counts[idFrag(need.id)] = 0;

				var cell = document.createElement("th");
				cell.id = idFrag(need.id);
				cell.scope = "rowgroup";
				cell.rowSpan = userNeedContexts.length;

				var link = document.createElement("a");
				link.href = baseUri + "user-needs/" + idFrag(need.id);
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
			link.href = baseUri + "user-need-contexts/" + idFrag(context.id);
			link.append(document.createTextNode(context.label));

			cell.append(link);
			row.append(cell);

			// loop functional needs
			functionalNeedCategories.forEach(function (category) {
				functionalNeedList = filterObjectByProperties(functionalNeeds, { "categoryId": category.id });
				functionalNeedList.forEach(function (fn) {
					var cell = document.createElement("td");

					var maps = filterObjectByProperties(mappings, { "fnId": fn.id, "unId": need.id, "unrId": context.id });

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
								link.href = baseUri + "guidance-statements/" + idFrag(map.stmtId);
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
    document.body.appendChild(table);

	var countIterator = Object.keys(counts);
	countIterator.forEach(function (c) {
		var cell = document.getElementById(c);
		var span = document.createElement("span");
		span.class = "total";
		span.append(document.createTextNode(" (" + counts[c] + ") "));
		cell.append(span);
	});

    document.dispatchEvent(new Event("MatrixTableCreated", {bubbles: true, composed: true}));
}

/* functions copied from util */
// Find an object based on multiple properties
function findObjectByProperties(array, properties) {
    return array.find((obj) => {
        // Check if all specified properties match
        return Object.keys(properties).every((key) =>
            compareStr(obj[key], properties[key])
        );
    });
}
// Return multiple values of an object that match given properties
function filterObjectByProperties(array, properties) {
    return array.filter((obj) => {
        // Check if all specified properties match
        return Object.keys(properties).every((key) =>
            compareStr(obj[key], properties[key])
        );
    });
}
// Return just the fragment part of a URI
function idFrag(uri) {
    return uri.substring(uri.indexOf("#") + 1);
}
// Boolean indicating if two strings match ignoring whitespace and case
function compareStr(str1, str2) {
	if (str1.trim().replace(/\s+/g, ' ').toLowerCase() == str2.trim().replace(/\s+/g, ' ').toLowerCase()) return true;
	else return false;
}
