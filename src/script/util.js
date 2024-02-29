// Function to find an object based on multiple properties
export function findObjectByProperties(array, properties) {
  return array.find(obj => {
    // Check if all specified properties match
    return Object.keys(properties).every(key => obj[key] === properties[key]);
  });
}
export function filterObjectByProperties(array, properties) {
  return array.filter(obj => {
    // Check if all specified properties match
    return Object.keys(properties).every(key => obj[key] === properties[key]);
  });
}

export function idFrag(uri) {
	return uri.substring(uri.indexOf("#") + 1)
}

