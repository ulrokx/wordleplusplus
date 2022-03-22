//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const randInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};