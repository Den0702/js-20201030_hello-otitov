/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let count = 0;
  let charCurrent;

  const arr = string.split('');

  arr.forEach((element, index) => {
    if (element === charCurrent) {
      ++count;
    }
    else {
      count = 0;
      charCurrent = element;
    }

    if (element === charCurrent && count >= size) {
      delete arr[index];
    }
  });

  return arr.join('');
}