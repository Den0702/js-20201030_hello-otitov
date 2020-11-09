/**
 * Sum - returns sum of arguments if they can be converted to a number
 * @param {number} n value
 * @returns {number | function}
 */
export function sum(n) {
  let totalSum = n || 0;

  const func = (n = 0) => {
    totalSum += n;
    return func;
  }

  func[Symbol.toPrimitive] = hint => {
    return (hint === 'string') ? `Сумма чисел = ${totalSum}` : totalSum;
  }

  return func;
}