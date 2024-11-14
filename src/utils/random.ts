const LETTERS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const NUM_LETTERS = LETTERS.length;

export const generateRandom = (n: number): string => {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += LETTERS[Math.floor(Math.random() * (NUM_LETTERS - 0) + 0)];
  }
  return result;
};
