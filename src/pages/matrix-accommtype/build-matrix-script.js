// this script runs in JSDOM and must be in CommonJS
function generateMatrix(data, baseUri) {
    let accessibilityCharacteristicGroups = data.accessibilityCharacteristicGroups;
    let accommodationTypes = data.accommodationTypes;
    let functionalAbilityGroups = data.functionalAbilityGroups;
    let simpleCurveMaps = data.simpleCurveMaps;
    let statements = data.statements;

    const table = document.createElement("table");
    table.id = "matrixTable";

    const counts = new Array();
    let rowNum = 1;
    let colNum = 1;

    //thead
    let thead = document.createElement("thead");

    // row 1: functional ability groups
    let row1 = document.createElement("tr");
    createEmptyCells(row1, 1);

    functionalAbilityGroups.forEach(function (group) {
        let cell = document.createElement("th");
        cell.id = idFrag(group.id);
        cell.scope = "colgroup";
        cell.classList.add("row" + rowNum);

        let link = document.createElement("a");
        link.href =
            baseUri +
            "functional-ability-groups/" +
            idFrag(group.id);
        link.append(document.createTextNode(group.label));

        cell.append(link);
        row1.append(cell);
    });

    thead.append(row1);
    rowNum++;

    // row 2: functional abilities in each group
    let row2 = document.createElement("tr");
    createEmptyCells(row2, 2);

    colNum = 3;
    functionalAbilityGroups.forEach(function (faGroup) {
        counts[idFrag(faGroup.id)] = 0;

        row1.cells[idFrag(faGroup.id)].colSpan = faGroup.members.length;
        row1.cells[idFrag(faGroup.id)].classList.add("col" + colNum);

        faGroup.members.forEach(function (item) {
            counts[idFrag(item.id)] = 0;

            let cell = document.createElement("th");
            cell.id = idFrag(item.id);
            cell.scope = "col";
            cell.classList.add("row" + rowNum);
            cell.classList.add("col", colNum);

            let link = document.createElement("a");
            link.href =
                baseUri +
                "functional-abilities/" +
                idFrag(item.id);
            link.append(document.createTextNode(item.label));

            cell.append(link);
            row2.append(cell);

            colNum++;
        });
    });

    thead.append(row2);
    rowNum++;

    table.append(thead);

    //tbody
    let tbody = document.createElement("tbody");
    colNum = 4;

    // accessibility characteristic groups
    accessibilityCharacteristicGroups.forEach(function (acGroup) {
        let acgRow = document.createElement("tr");

        counts[idFrag(acGroup.id)] = 0;

        //col 1 header
        let acgCell = document.createElement("th");
        acgCell.id = idFrag(acGroup.id);
        acgCell.scope = "rowgroup";
        acgCell.rowSpan = acGroup.members.length * accommodationTypes.length;
        acgCell.classList.add("row" + rowNum);
        acgCell.classList.add("col1");
        
        let acgLink = document.createElement("a");
        acgLink.href =
            baseUri + "functional-ability-groups/" + idFrag(acGroup.id);
        acgLink.append(document.createTextNode(acGroup.label));

        acgCell.append(acgLink);
        acgRow.append(acgCell);

        // accessibility characteristics in each group
        let acMembers = acGroup.members;
        let acCount = 0;
        acMembers.forEach(function (characteristic) {
            let acRow =
                acCount == 0 ? acgRow : document.createElement("tr");
            acCount++;

            let characteristicId =
                idFrag(acGroup.id) + "+" + idFrag(characteristic.id);
            counts[characteristicId] = 0;

            //col 2 header
            let acCell = document.createElement("th");
            acCell.id = characteristicId;
            acCell.scope = "rowgroup";
            acCell.rowSpan = accommodationTypes.length;
            acCell.classList.add("row" + rowNum);
            acCell.classList.add("col2");

            let acLink = document.createElement("a");
            acLink.href =
                baseUri +
                "accessibility-characteristics/" +
                idFrag(characteristic.id);
            acLink.append(
                document.createTextNode(characteristic.label)
            );

            acCell.append(acLink);
            acRow.append(acCell);

            let accTypeCount = 0;
            accommodationTypes.forEach(function (accommodationType) {
                let accTypeRow =
                    accTypeCount == 0
                        ? acRow
                        : document.createElement("tr");
                accTypeCount++;

                counts[idFrag(accommodationType.id)] = 0;

                //col 3 header
                let accTypeCell = document.createElement("th");
                accTypeCell.id = idFrag(accommodationType.id);
                accTypeCell.scope = "row";
                accTypeCell.classList.add("row" + rowNum);
                accTypeCell.classList.add("col3");

                let accTypeLink = document.createElement("a");
                accTypeLink.href =
                    baseUri +
                    "accommodation-types/" +
                    idFrag(accommodationType.id);
                accTypeLink.append(
                    document.createTextNode(accommodationType.label)
                );

                accTypeCell.append(accTypeLink);
                accTypeRow.append(accTypeCell);

                // functional ability groups and individuals
                functionalAbilityGroups.forEach(
                    function (faGroup) {
                        faGroup.members.forEach(
                            function (functionalAbility) {
                                let cell = document.createElement("td");
                                cell.classList.add("row" + rowNum);
                                cell.classList.add("col" + colNum);

                                let maps = filterObjectByProperties(
                                    simpleCurveMaps,
                                    {
                                        abilityId: functionalAbility.id,
                                        accommId: accommodationType.id,
                                        charId: characteristic.id,
                                    }
                                );
                                if (maps.length > 0) {
                                    let div =
                                        document.createElement("div");
                                    div.id = idFrag(maps[0].id);
                                    div.classList.add("mapping");
                                    if (maps[0].applicable == "false") {
                                        div.classList.add("na");
                                        div.append(
                                            document.createTextNode(
                                                "NA"
                                            )
                                        );
                                    }

                                    let list =
                                        document.createElement("ul");

                                    /*
                            need to get statements in mappings
                            */

                                    maps.forEach(function (map) {
                                        if (map.stmtId != null) {
                                            let stmt =
                                                findObjectByProperties(
                                                    statements,
                                                    { id: map.stmtId }
                                                );

                                            let item =
                                                document.createElement(
                                                    "li"
                                                );
                                            let link =
                                                document.createElement(
                                                    "a"
                                                );
                                            link.href =
                                                baseUri +
                                                "guidance-statements/" +
                                                idFrag(map.stmtId);
                                            link.class = idFrag(
                                                map.stmtId
                                            );
                                            link.title = stmt.stmt;
                                            link.append(
                                                document.createTextNode(
                                                    stmt.label
                                                )
                                            );
                                            item.append(link);
                                            list.append(item);

                                            counts[
                                                idFrag(faGroup.id)
                                            ]++;
                                            counts[
                                                idFrag(functionalAbility.id)
                                            ]++;
                                            counts[
                                                idFrag(faGroup.id)
                                            ]++;
                                            counts[
                                                idFrag(
                                                    accommodationType.id
                                                )
                                            ]++;
                                        }
                                    });
                                    if (list.childNodes.length > 0)
                                        div.append(list);

                                    cell.append(div);
                                }

                                accTypeRow.append(cell);
                                colNum++;
                            }
                        );
                    }
                );
                tbody.append(accTypeRow);
                rowNum++;
                colNum = 4;
            });
        });
    });

    table.append(tbody);
    document.body.appendChild(table);

    let countIterator = Object.keys(counts);
    countIterator.forEach(function (c) {
        let cell = document.getElementById(c);
        let div = cell.firstElementChild.firstElementChild;
        let insertInto = div == null ? cell : div;

        let span = document.createElement("span");
        span.class = "total";
        span.append(document.createTextNode(" (" + counts[c] + ") "));
        insertInto.append(document.createTextNode(" "));
        insertInto.append(span);
    });
    //return (document.getElementsByTagName("table").item(0));
    document.dispatchEvent(new Event("MatrixTableCreated", {bubbles: true, composed: true}));

    function createEmptyCells(row, rowNum) {
        for (i = 1; i <= 3; i++) {
            let cell = document.createElement("td");
            cell.classList.add("topleft");
            cell.classList.add("row" + rowNum);
            cell.classList.add("col" + i);
            row.append(cell);
        }
    }
}

// Function to find an object based on multiple properties
function findObjectByProperties(array, properties) {
	return array.find(obj => {
		// Check if all specified properties match
		return Object.getOwnPropertyNames(properties).every(key => {
			//console.log ("key: " + key + "; obj: " + obj[key] + "; property: " + properties[key])
			if (compareStr(obj[key], properties[key])) return obj;
		});
	});
}
function filterObjectByProperties(array, properties) {
	return array.filter(obj => {
		// Check if all specified properties match
		return Object.getOwnPropertyNames(properties).every(key => {
			//console.log ("key: " + key + "; obj: " + obj[key] + "; property: " + properties[key])
			if (compareStr(obj[key], properties[key])) return obj;
		});
	});
}
function idFrag(uri) {
    return uri.substring(uri.indexOf("#") + 1);
}
function compareStr(str1, str2) {
	if (str1.trim().replace(/\s+/g, ' ').toLowerCase() == str2.trim().replace(/\s+/g, ' ').toLowerCase()) return true;
	else return false;
}
