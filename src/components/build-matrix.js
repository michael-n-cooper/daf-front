import {findObjectByProperties, filterObjectByProperties, baseUri, idFrag, apiGet} from '../script/util.js';

const functionalNeedCategories = apiGet("functional-need-categories");
const functionalNeeds = apiGet("functional-needs");
const userNeeds = apiGet("user-needs");
const userNeedContexts = apiGet("user-need-contexts");
const mappings = apiGet("mappings");

export const table = "<p>test</p>";