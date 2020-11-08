/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArray = path.split('.');

  const getter = (obj) =>{
    const currentProp = pathArray.shift();
    
    if (typeof obj[currentProp] === "object") {
      return getter(obj[currentProp]);
    }
    
    return obj[currentProp];
  };

  return getter;
}
