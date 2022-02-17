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

export const randomNoRepeats = (array: string[]) => {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}
