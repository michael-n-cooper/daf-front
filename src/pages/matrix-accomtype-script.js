async function generateMatrix() {
    const table = document.getElementById("matrixTable");

    let promises = new Array();

    console.log("begin");

    promises.push(apiGet("accessibility-characteristic-groups"));
    promises.push(apiGet("accommodation-types"));
    promises.push(apiGet("functional-ability-groups"));
    promises.push(apiGet("intersection-curve-maps"));
    promises.push(apiGet("simple-curve-maps"));
    promises.push(apiGet("statements"));

    Promise.all(promises).then(async (values) => {
        console.log("middle");

        const gpChar = values[0];
        const accommodationTypes = values[1];
        const gpFa = values[2];
        const intersectionCurveMaps = values[3];
        const simpleCurveMaps = values[4];
        const statements = values[5];

        var acgPromises = new Array();
        var fagPromises = new Array();

        gpChar.forEach(function (group) {
            acgPromises.push(
                apiGet(
                    "accessibility-characteristic-groups/" + idFrag(group.id)
                )
            );
        });
        gpFa.forEach(function (group) {
            fagPromises.push(
                apiGet("functional-ability-groups/" + idFrag(group.id))
            );
        });

        var innerPromises = new Array();
        innerPromises.push(Promise.all(acgPromises));
        innerPromises.push(Promise.all(fagPromises));
        Promise.all(innerPromises).then((innerValues) => {
            var accessibilityCharacteristicGroups = new Array(); innerValues[0];
            var functionalAbilityGroups = new Array(); innerValues[1];

            innerValues[0].forEach(function (group) {
                accessibilityCharacteristicGroups.push(group[0]);
            });
            innerValues[1].forEach(function (group) {
                functionalAbilityGroups.push(group[0]);
            });

            console.log(accessibilityCharacteristicGroups);
            console.log(functionalAbilityGroups);

            const base = "http://localhost:4321/";
            const counts = {};

            //thead
            let thead = document.createElement("thead");

            // row 1: accessibility characteristic groups
            let row1 = document.createElement("tr");
            row1.append(
                document.createElement("td"),
                document.createElement("td")
            );

            accessibilityCharacteristicGroups.forEach(function (group) {
                console.log("getting there");
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

                let members = charGroup.members;
                row1.cells[idFrag(charGroup.id)].colSpan = members.length;

                members.forEach(function (item) {
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
                fagCell.rowSpan = faMembers.length;

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

                    counts[functionalAbilityId] = 0;

                    //col 2 header
                    let functionalAbilityId =
                        idFrag(faGroup.id) + "+" + idFrag(functionalAbility.id);
                    let faCell = document.createElement("th");
                    faCell.id = functionalAbilityId;
                    faCell.scope = "rowgroup";
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
            //console.log(counts);
            //console.log(table);

            let countIterator = Object.keys(counts);
            countIterator.forEach(function (c) {
                let cell = document.getElementById(c);
                let span = document.createElement("span");
                span.class = "total";
                span.append(document.createTextNode(" (" + counts[c] + ") "));
                cell.append(span);
            });
        });
    });
    return table;
}

/* Functions taken from util in the backend */

async function apiGet(path) {
    const data = await fetch("http://localhost:3000/api/" + path);
    const json = await data.json();
    return json;
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
function compareStr(str1, str2) {
    if (
        str1.trim().replace(/\s+/g, " ").toLowerCase() ==
        str2.trim().replace(/\s+/g, " ").toLowerCase()
    )
        return true;
    else return false;
}
function idFrag(uri) {
    return uri.substring(uri.indexOf("#") + 1);
}

await generateMatrix();
