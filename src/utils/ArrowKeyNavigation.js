/**
 * Class encapsulating the functionality that enables the user to
 * navigate through tiles/ search result grid using the arrow keys
 * This code is very hacky, it's best not to look at it for too long
 */
export default class ArrowKeyNavigation {
  constructor(index) {
    this.index = index;
  }

  resetIndex() {
    this.index = 0;
  }

  /* Figures out which element is next, based on the key pressed *
   * current index and total number of items. Then calls focus function */
  arrowNavigation(key) {
    if (this.index === undefined) this.index = 0; // Start at beginning
    else if (key === 37) { // Left --> Previous
      this.index -= 1;
    } else if (key === 38) { // Up --> Previous
      this.index = ArrowKeyNavigation.goToPrevious(this.index);
    } else if (key === 39) { // Right --> Next
      this.index += 1;
    } else if (key === 40) { // Down --> Next
      this.index = ArrowKeyNavigation.goToNext(this.index);
    }
    /* Ensure the index is within bounds, then focus element */
    this.index = ArrowKeyNavigation.getSafeElementIndex(this.index);
    ArrowKeyNavigation.selectItemByIndex(this.index).focus();
  }

  /* Returns the number of visible items / results */
  static getNumResults() {
    return document.getElementsByClassName('item').length;
  }

  /* Returns the index for an element, ensuring that it's within bounds */
  static getSafeElementIndex(index) {
    const numResults = ArrowKeyNavigation.getNumResults();
    if (index < 0) return numResults - 1;
    else if (index >= numResults) return 0;
    return index;
  }

  /* Selects a given element, by it's ID. If out of bounds, returns element 0 */
  static selectItemByIndex(index) {
    return (index >= 0 && index <= ArrowKeyNavigation.getNumResults())
      ? document.getElementsByClassName('item')[index] : [document.getElementsByClassName('item')];
  }

  /* Returns the index of the first cell in the previous/ above row */
  static findPreviousRow(startingIndex) {
    const isSameRow = (indx, pos) => ArrowKeyNavigation.selectItemByIndex(indx).offsetTop === pos;
    const checkPreviousIndex = (currentIndex, yPos) => {
      if (currentIndex >= ArrowKeyNavigation.getNumResults()) return checkPreviousIndex(0, yPos);
      else if (isSameRow(currentIndex, yPos)) return checkPreviousIndex(currentIndex - 1, yPos);
      return currentIndex;
    };
    const position = ArrowKeyNavigation.selectItemByIndex(startingIndex).offsetTop;
    return checkPreviousIndex(startingIndex, position);
  }

  /* Moves to the cell directly above the current */
  static goToPrevious(startingIndex) {
    const isBelow = (start, end) => (ArrowKeyNavigation.selectItemByIndex(start).offsetTop
      < ArrowKeyNavigation.selectItemByIndex(end).offsetTop);
    const nextIndex = ArrowKeyNavigation.findPreviousRow(startingIndex);
    const count = nextIndex - startingIndex;
    const rowLen = nextIndex - ArrowKeyNavigation.findNextRow(startingIndex) + 1;
    const adjustment = isBelow(startingIndex, nextIndex) ? 0 : rowLen - count;
    return nextIndex + adjustment;
  }

  /* Returns the index of the first cell in the next/ below row */
  static findNextRow(startingIndex) {
    const isSameRow = (indx, pos) => ArrowKeyNavigation.selectItemByIndex(indx).offsetTop === pos;
    const checkNextIndex = (currentIndex, yPos) => {
      if (currentIndex >= ArrowKeyNavigation.getNumResults()) return checkNextIndex(0, yPos);
      else if (isSameRow(currentIndex, yPos)) return checkNextIndex(currentIndex + 1, yPos);
      return currentIndex;
    };
    const position = ArrowKeyNavigation.selectItemByIndex(startingIndex).offsetTop;
    return checkNextIndex(startingIndex, position);
  }

  /* Moves to the cell directly below the current */
  static goToNext(startingIndex) {
    const isAbove = (start, end) => (ArrowKeyNavigation.selectItemByIndex(start).offsetTop
      > ArrowKeyNavigation.selectItemByIndex(end).offsetTop);
    const nextIndex = ArrowKeyNavigation.findNextRow(startingIndex);
    const count = nextIndex - startingIndex;
    const rowLen = nextIndex - ArrowKeyNavigation.findPreviousRow(startingIndex) - 1;
    const adjustment = isAbove(startingIndex, nextIndex) ? 0 : rowLen - count;
    return nextIndex + adjustment;
  }
}
