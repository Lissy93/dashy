
/**
 * Returns a color class name for elements relative to their position
 * @param index The position of a given element
 * @returns A color, relational to position
 */
const getColor = (index: number): string => {
  const remainder = index % 4;
  switch (remainder) {
    case 0: return 'pink';
    case 1: return 'blue';
    case 2: return 'green';
    case 3: return 'yellow';
    default: return 'white';
  }
};

export default getColor;
