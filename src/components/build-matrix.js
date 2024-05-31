import {findObjectByProperties, filterObjectByProperties, baseUri, idFrag, apiGet} from '../script/util.js';
import { JSDOM } from 'jsdom';

const functionalNeedCategories = apiGet("functional-need-categories");
const functionalNeeds = apiGet("functional-needs");
const userNeeds = apiGet("user-needs");
const userNeedContexts = apiGet("user-need-contexts");
const mappings = apiGet("mappings");

const dom = new JSDOM("<table id = 'matrixTable'><tr><td>test</td></tr><table>", { runScripts: "outside-only" });
const document = dom.window;

var tb = document.eval('document.getElementById("matrixTable")');

export const table = tb.outerHTML;