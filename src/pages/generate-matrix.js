function generateMatrix(data) {
    let accessibilityCharacteristicGroups = data.accessibilityCharacteristicGroups;
    let accommodationTypes = data.accommodationTypes;
    let functionalAbilityGroups = data.functionalAbilityGroups;
    let simpleCurveMaps = data.simpleCurveMaps;
    let statements = data.statements;

    console.log(data);
    const table = document.createElement("table");
    table.id = "matrixTable";

    const base = "http://localhost:4321/";
    const counts = new Array();

    //thead
    let thead = document.createElement("thead");

    // row 1: accessibility characteristic groups
    let row1 = document.createElement("tr");
    row1.append(
        document.createElement("td"),
        document.createElement("td")
    );

    accessibilityCharacteristicGroups.forEach(function (group) {
        let cell = document.createElement("th");
        cell.id = idFrag(group.id);
        cell.scope = "colgroup";

        let link = document.createElement("a");
        link.href =
            base +
            "accessibility-characteristic-groups/" +
            idFrag(group.id);
        link.append(document.createTextNode(group.label));

        cell.append(link);
        row1.append(cell);
    });

    thead.append(row1);

    // row 2: accessibility characteristics in each group
    let row2 = document.createElement("tr");
    row2.append(
        document.createElement("td"),
        document.createElement("td")
    );

    accessibilityCharacteristicGroups.forEach(function (charGroup) {
        counts[idFrag(charGroup.id)] = 0;

        console.log(1);
        row1.cells[idFrag(charGroup.id)].colSpan = charGroup.members.length;

        charGroup.members.forEach(function (item) {
            counts[idFrag(item.id)] = 0;

            let cell = document.createElement("th");
            cell.id = idFrag(item.id);
            cell.scope = "col";

            let link = document.createElement("a");
            link.href =
                base +
                "accessibility-characteristics/" +
                idFrag(item.id);
            link.append(document.createTextNode(item.label));

            cell.append(link);
            row2.append(cell);
        });
    });

    thead.append(row2);

    table.append(thead);

    //tbody
    let tbody = document.createElement("tbody");

    // functional ability groups
    functionalAbilityGroups.forEach(function (faGroup) {
        let fagRow = document.createElement("tr");

        counts[idFrag(faGroup.id)] = 0;

        //col 1 header
        let fagCell = document.createElement("th");
        fagCell.id = idFrag(faGroup.id);
        fagCell.scope = "rowgroup";
        console.log(accommodationTypes.length);
        fagCell.rowSpan = faGroup.members.length * accommodationTypes.length;

        let fagLink = document.createElement("a");
        fagLink.href =
            base + "functional-ability-groups/" + idFrag(faGroup.id);
        fagLink.append(document.createTextNode(faGroup.label));

        fagCell.append(fagLink);
        fagRow.append(fagCell);

        // functional abilities in each group
        let faMembers = faGroup.members;
        let faCount = 0;
        faMembers.forEach(function (functionalAbility) {
            let faRow =
                faCount == 0 ? fagRow : document.createElement("tr");
            faCount++;

            let functionalAbilityId =
                idFrag(faGroup.id) + "+" + idFrag(functionalAbility.id);
            counts[functionalAbilityId] = 0;

            //col 2 header
            let faCell = document.createElement("th");
            faCell.id = functionalAbilityId;
            faCell.scope = "rowgroup";
            console.log(3);
            faCell.rowSpan = accommodationTypes.length;

            let faLink = document.createElement("a");
            faLink.href =
                base +
                "functional-abilities/" +
                idFrag(functionalAbility.id);
            faLink.append(
                document.createTextNode(functionalAbility.label)
            );

            faCell.append(faLink);
            faRow.append(faCell);

            let accTypeCount = 0;
            accommodationTypes.forEach(function (accommodationType) {
                let accTypeRow =
                    accTypeCount == 0
                        ? faRow
                        : document.createElement("tr");
                accTypeCount++;

                counts[idFrag(accommodationType.id)] = 0;

                //col 3 header
                let accTypeCell = document.createElement("th");
                accTypeCell.id = idFrag(accommodationType.id);
                accTypeCell.scope = "row";

                let accTypeLink = document.createElement("a");
                accTypeLink.href =
                    base +
                    "accommodation-types/" +
                    idFrag(accommodationType.id);
                accTypeLink.append(
                    document.createTextNode(accommodationType.label)
                );

                accTypeCell.append(accTypeLink);
                accTypeRow.append(accTypeCell);

                // accessibility characteristic groups and individuals
                accessibilityCharacteristicGroups.forEach(
                    function (charGroup) {
                        charGroup.members.forEach(
                            function (characteristic) {
                                let cell = document.createElement("td");

                                let maps = filterObjectByProperties(
                                    simpleCurveMaps,
                                    {
                                        abilityId: functionalAbility.id,
                                        accomId: accommodationType.id,
                                        charId: characteristic.id,
                                    }
                                );
console.log(4);
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
                                                base +
                                                "statements/" +
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
                                                idFrag(charGroup.id)
                                            ]++;
                                            counts[
                                                functionalAbilityId
                                            ]++;
                                            counts[
                                                idFrag(charGroup.id)
                                            ]++;
                                            counts[
                                                idFrag(
                                                    characteristic.id
                                                )
                                            ]++;
                                        }
                                    });
                                    console.log(5);
                                    if (list.childNodes.length > 0)
                                        div.append(list);

                                    cell.append(div);
                                }

                                accTypeRow.append(cell);
                            }
                        );
                    }
                );
                tbody.append(accTypeRow);
            });
        });
    });

    table.append(tbody);
    document.body.appendChild(table);

    let countIterator = Object.keys(counts);
    countIterator.forEach(function (c) {
        let cell = document.getElementById(c);
        let span = document.createElement("span");
        span.class = "total";
        span.append(document.createTextNode(" (" + counts[c] + ") "));
        cell.append(span);
    });
    //return (document.getElementsByTagName("table").item(0));
    document.dispatchEvent(new Event("MatrixTableCreated", {bubbles: true, composed: true}));
}

// Function to find an object based on multiple properties
function findObjectByProperties(array, properties) {
    return array.find((obj) => {
        // Check if all specified properties match
        return Object.keys(properties).every((key) =>
            compareStr(obj[key], properties[key])
        );
    });
}
function filterObjectByProperties(array, properties) {
    return array.filter((obj) => {
        // Check if all specified properties match
        return Object.keys(properties).every((key) =>
            compareStr(obj[key], properties[key])
        );
    });
}
function idFrag(uri) {
    return uri.substring(uri.indexOf("#") + 1);
}
