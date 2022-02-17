export const isLetter = (char: string) => {
  return char.match(/[a-z]/i);
}

export const createHashOfIndexes = (str: string) => {
  return str.split('').reduce((prev, curr, index) => {
    if (!prev[curr]) {
      prev[curr] = [index];
      return prev;
    }
    prev[curr].push(index);
    return prev;
  }, {} as { [key: string]: number[] });
}