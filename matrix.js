var curRow = 0; var curCol = 0;
var proportion = 1;
const popovers = HTMLElement.prototype.hasOwnProperty("popover");
var usingPopovers = false;

// generate a class attribute for row and column number
function rc(row, col) {
	return "row" + row + " col" + col;
}


function focusRowCol(event) {
	var row = null; var col = null;
	let cell = this;
	cell.classList.forEach(function(val) {
		if (val.includes("row")) row = val.substr(3);
		if (val.includes("col")) col = val.substr(3);
	});
	if (row != null && col != null) {
//	console.log("row" + row + " col" + col);
		show(document.getElementsByClassName("row" + row));
		show(document.getElementsByClassName("col" + col));
	}
	function show(list) {
		for (let i = 0; i < list.length; i++) {
			list[i].classList.add("rch");
		}
	}
}

function blurRowCol(event) {
	var row = null; var col = null;
	let cell = this;
	cell.classList.forEach(function(val) {
		if (val.includes("row")) row = val.substr(3);
		if (val.includes("col")) col = val.substr(3);
	});
	if (row != null && col != null) {
		clear(document.getElementsByClassName("row" + row));
		clear(document.getElementsByClassName("col" + col));
	}
	function clear(list) {
		for (let i = 0; i < list.length; i++) {
			list[i].classList.remove("rch");
		}
	}
}

function focusStmt(event) {
	const id = this.getAttribute("class");
	let nl = document.getElementsByClassName(id);
	for (let i = 0; i < nl.length; i++) {
		nl[i].classList.add("stmt");
	}
}
function blurStmt(event) {
	const id = this.classList[0];
	let nl = document.getElementsByClassName(id);
	for (let i = 0; i < nl.length; i++) {
		nl[i].classList.remove("stmt");
	}
}

var curOpenerId = "";
var curPopoverId = "";

function enterCell(event) {
	const id = this.id;
	openPopover(id);
	curPopoverId = id;
	curOpenerId = id;
	event.stopPropagation();
}

function enterPopover(event) {
	const id = this.id.substr(0, this.id.length - 8);
	curPopoverId = id;
	event.stopPropagation();
}

// Events to show/hide the subpopover when the mouse moves over and out
function openPopover(id) {
  const popover = document.getElementById(id + "-popover");
  popover.showPopover();
}

function closePopover(id) {
	const popover = document.getElementById(id + "-popover");
  if (popover != null && popover.matches(":popover-open")) {
    popover.hidePopover();
  }
}

function clearPopover() {
	if (curPopoverId != "") {
		popover = document.getElementById(curPopoverId + "-popover");
	  if (popover != null && popover.matches(":popover-open")) {
	    popover.hidePopover();
	  }
	  curPopoverId = "";
	  curOpenerId = "";
	}
}

function sizePopovers() {
	if (popovers) {
		const divs = document.getElementsByTagName("div");
		for (let i = 0; i < divs.length; i++) {
			if (divs[i].getAttribute("popovertarget") != null) {
				const opener = divs[i];
				const popover = document.getElementById(opener.id + "-popover");
				const rect = opener.getBoundingClientRect();
	
				popover.style = "left: " + rect.left + "px; top: calc(" + rect.top + "px + 3ex); width: " + rect.width / proportion + "px; height: " + rect.height / proportion + "px; font-size: " + 100 / proportion + "%;";
			}
		}
	}
}

function attachPopovers() {
	if (popovers) {
		const divs = document.getElementsByTagName("div");
		for (let i = 0; i < divs.length; i++) {
			if (divs[i].getAttribute("popovertarget") != null) {
				const id = divs[i].id;
				const opener = divs[i];
				const popover = document.createElement("div");
				popover.id = id + "-popover";
				popover.setAttribute("popover", "");
				popover.innerHTML = opener.innerHTML;
				opener.insertAdjacentElement("afterend", popover);
				opener.addEventListener("mouseover", enterCell);
				opener.addEventListener("focus", enterCell, {capture: true});
				popover.addEventListener("mouseover", enterPopover);
			}
		}
		const table = document.getElementById("table");
		const matrix = document.getElementById("matrix");
		table.addEventListener("mouseover", clearPopover);
		matrix.addEventListener("scrollend", sizePopovers);
		sizePopovers();
		usingPopovers = true;
	}
}

function removePopovers() {
	if (popovers && usingPopovers) {
		const divs = document.getElementsByTagName("div");
		for (let i = 0; i < divs.length; i++) {
			if (divs[i].getAttribute("popovertarget") != null) {
				const id = divs[i].id;
				const opener = divs[i];
				const popover = document.getElementById(id + "-popover");
				const parent = popover.parentElement;
				opener.removeEventListener("mouseover", enterCell);
				parent.removeChild(popover);
			}
		}
		const table = document.getElementById("table");
		table.removeEventListener("mouseover", clearPopover);
		matrix.removeEventListener("scrollend", sizePopovers);
		usingPopovers = false;
	}
}

function sizeTable(event) {
	const shrink = this.checked;
	const matrix = document.getElementById("matrix");
	const table = document.getElementById("table");
	const showPopupsControl = document.getElementById("showPopupsControl");
	if (shrink) {
		proportion = matrix.clientWidth / table.scrollWidth;
		table.style = "width: " + 100 * proportion + "%; font-size: " + 100 * proportion + "% ";
		
		showPopupsControl.disabled = false;
		
	} else {
		showPopupsControl.disabled = true;
		table.style = "";
		removePopovers();
	}
}

function togglePopovers(event) {
	if (this.checked) attachPopovers();
	else removePopovers();
}

function highlightCellPos(event) {
	const show = this.checked;
	const nl = document.getElementsByTagName("td");
	for (let i = 0; i < nl.length; i++) {
		if (show) {
			nl[i].addEventListener("mouseover", focusRowCol);
			nl[i].addEventListener("mouseout", blurRowCol);
		} else {
			nl[i].removeEventListener("mouseover", focusRowCol);
			nl[i].removeEventListener("mouseout", blurRowCol);
		}
	};
}

function highlightSameStmt(event) {
	const show = this.checked;
	const stmtList = document.getElementsByTagName("a");
	for (let i = 0; i < stmtList.length; i++) {
		if (stmtList[i].className.length > 0) {
			if (show) {
				stmtList[i].addEventListener("mouseover", focusStmt);
				stmtList[i].addEventListener("mouseout", blurStmt);
			} else {
				stmtList[i].removeEventListener("mouseover", focusStmt);
				stmtList[i].removeEventListener("mouseout", blurStmt);
			}
		}
	}
}

function attachListeners() {
	const highlightCellPosControl = document.getElementById("highlightCellPosControl");
	highlightCellPosControl.addEventListener("change", highlightCellPos);
	
	const highlightSameStmtControl = document.getElementById("highlightSameStmtControl");
	highlightSameStmtControl.addEventListener("change", highlightSameStmt);
	
	const shrinkTableControl = document.getElementById("shrinkMatrixControl");
	shrinkTableControl.addEventListener("change", sizeTable);

	const showPopupsControl = document.getElementById("showPopupsControl");
	showPopupsControl.addEventListener("change", togglePopovers);
}


