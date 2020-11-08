/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  return [...new Set(arr)];
  
  // Интересно решение без Set. В варианте ниже, меняется порядок в массиве [1,2,a] к примеру,
  // Из-за чего не проходят тесты, но задача по факту решенная
 
  // if (!Array.isArray(arr)) return [];
  // const newArr = [...arr];
  // const uniqArr = newArr.reduce((acc, current) => {
  //   acc[current] = current;
  //   return acc;
  // }, {});
}