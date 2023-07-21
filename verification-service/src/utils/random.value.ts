/**
 * Returns a random number between an interval
 * @param {number} min - Min value of the interval (included)
 * @param {number} max - Max value of the interval (included)
 * @returns {number} A random number
 */
function randomNumberFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export { randomNumberFromInterval };
