/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj !== 'object') {return;}
  
  const arr = Object.entries(obj).map(value => {
    return [value[1], value[0]];
  });
  return Object.fromEntries(arr);
}

