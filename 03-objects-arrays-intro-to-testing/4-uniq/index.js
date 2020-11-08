/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  //return [...new Set(arr)];
  
  if (!Array.isArray(arr)) return [];

  return arr.reduce((acc, current) => {
    if (!acc.includes(current)){
      acc.push(current);
    }
    return acc;
  }, []);
}