var curRow = 0; var curCol = 0;
var proportion = 1;

// generate a class attribute for row and column number
function rc(row, col) {
	return "row" + row + " col" + col;
}


function focusRowCol(cell) {
	var row = null; var col = null;
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

function blurRowCol(cell) {
	var row = null; var col = null;
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

function focusStmt(id) {
	const nl = document.getElementsByClassName(id);
	for (let i = 0; i < nl.length; i++) nl[i].classList.add("stmt");
}
function blurStmt(id) {
	const nl = document.getElementsByClassName(id);
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
}
function leaveCell(event) {
	const id = this.id;
	if (curPopoverId != id) {
		curOpenerId = "";
		closePopover(id);
	}
}

function enterPopover(event) {
	const id = this.id;
	curPopoverId = id;
}
function leavePopover(event) {
	const id = this.id;
	if (curOpenerId != id) {
		closePopover(id);
		curPopoverId = "";
	}
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

function sizePopovers() {
	const divs = document.getElementsByTagName("div");
	for (let i = 0; i < divs.length; i++) {
		if (divs[i].getAttribute("popovertarget") != null) {
			const opener = divs[i];
			const popover = document.getElementById(opener.id + "-popover");
			const rect = opener.getBoundingClientRect();

			popover.style = "left: " + rect.left + "px; top: " + rect.bottom + "px; width: " + rect.width / proportion + "px; height: " + rect.height / proportion + "px; font-size: " + 100 / proportion + "%;";
		}
	}
}

function attachPopovers() {
	const divs = document.getElementsByTagName("div");
	for (let i = 0; i < divs.length; i++) {
		if (divs[i].getAttribute("popovertarget") != null) {
			const id = divs[i].id;
			const opener = divs[i];
			const popover = document.getElementById(id + "-popover");
			popover.innerHTML = opener.innerHTML;
			opener.addEventListener("mouseover", enterCell);
			opener.addEventListener("mouseout", leaveCell);
			popover.addEventListener("mouseover", enterPopover);
			popover.addEventListener("mouseout", leavePopover);
		}
	}
	sizePopovers();
}

function removePopovers() {
	const divs = document.getElementsByTagName("div");
	for (let i = 0; i < divs.length; i++) {
		if (divs[i].getAttribute("popovertarget") != null) {
			const id = divs[i].id;
			const opener = divs[i];
			const popover = document.getElementById(id + "-popover");
			const parent = popover.parentElement;
			opener.removeEventListener("mouseover", enterCell);
			opener.removeEventListener("mouseout", leaveCell);
			parent.removeChild(popover);
		}
	}
}

function sizeTable(shrink) {
	const matrix = document.getElementById("matrix");
	const table = document.getElementById("table");
	if (shrink) {
		proportion = matrix.clientWidth / table.scrollWidth;
		//console.log (proportion); 
		//console.log (100 / proportion);
		table.style = "width: " + 100 * proportion + "%; font-size: " + 100 * proportion + "%";
		
		attachPopovers();
		
		matrix.addEventListener("scrollend", (event) => {sizePopovers(); console.log("scroll");});
	} else {
		table.style = "";
		removePopovers();
	}
	
	
}

function attachListeners() {
	const nl = document.getElementsByTagName("td");
	for (let i = 0; i < nl.length; i++) {
		nl[i].addEventListener("mouseover", function(){focusRowCol(nl[i])});
		nl[i].addEventListener("mouseout", function(){blurRowCol(nl[i])});
	};
	
	const stmtList = document.getElementsByTagName("a");
	for (let i = 0; i < stmtList.length; i++) {
		if (stmtList[i].className.length > 0) {
			const id = stmtList[i].className;
			stmtList[i].addEventListener("mouseover", function(){focusStmt(id)});
			stmtList[i].addEventListener("mouseout", function(){blurStmt(id)});
		}
	}
	
	const shrinkTableControl = document.getElementById("shrinkMatrixControl");
	shrinkTableControl.addEventListener("change", function(event){sizeTable(event.target.checked)})
}


