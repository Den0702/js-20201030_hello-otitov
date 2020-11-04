/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sort = (a, b) => {
    return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
  };
    
  const result = arr.slice().sort((a, b) => sort(a, b));

  return param == 'asc' ? result : result.reverse();
}
