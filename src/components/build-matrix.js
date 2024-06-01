import {findObjectByProperties, filterObjectByProperties, baseUri, idFrag, apiGet} from '../script/util.js';
import { JSDOM } from 'jsdom';
import fileUrl from 'file-url';

const functionalNeedCategories = await apiGet("functional-need-categories");
const functionalNeeds = await apiGet("functional-needs");
const userNeeds = await apiGet("user-needs");
const userNeedContexts = await apiGet("user-need-contexts");
const mappings = await apiGet("mappings");

const dom = new JSDOM("<table id = 'matrixTable'><table>", {url: fileUrl("matrix.html"), runScripts: "dangerously", resources: "usable"});
const document = dom.window;

var tb = document.eval('document.getElementById("matrixTable")');

var thead = document.eval('')

export const table = tb.outerHTML;