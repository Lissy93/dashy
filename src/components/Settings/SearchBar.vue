<template>
  <form>
    <label for="filter-tiles">Search</label>
    <input
      id="filter-tiles"
      v-model="input"
      ref="filter"
      placeholder="Start typing to filter tiles..."
      v-on:input="userIsTypingSomething"
      @keydown.esc="clearFilterInput" />
      <i v-if="input.length > 0"
        class="clear-search"
        title="Clear search"
        @click="clearFilterInput">x</i>
  </form>
</template>

<script>

export default {
  name: 'FilterTile',
  data() {
    return {
      input: '',
      index: undefined,
    };
  },
  methods: {
    userIsTypingSomething() {
      this.$emit('user-is-searchin', this.input);
    },
    clearFilterInput() {
      this.input = '';
      this.userIsTypingSomething();
      document.activeElement.blur();
      this.index = undefined;
    },
    /* Returns the number of visible items / results */
    getNumResults() {
      return document.getElementsByClassName('item').length;
    },
    /* Returns the index for an element, ensuring that it's within bounds */
    getSafeElementIndex(index) {
      const numResults = this.getNumResults();
      if (index < 0) return numResults - 1;
      else if (index >= numResults) return 0;
      return index;
    },
    /* Selects a given element, by it's ID. If out of bounds, returns element 0 */
    selectElementByIndex(index) {
      return (index >= 0 && index <= this.getNumResults())
        ? document.getElementsByClassName('item')[index] : [document.getElementsByClassName('item')];
    },
    findNextRow(index) {
      const isSameRow = (indx, pos) => this.selectElementByIndex(indx).offsetTop === pos;
      const checkNextIndex = (currentIndex, yPos) => {
        if (currentIndex >= this.getNumResults()) return checkNextIndex(0, yPos);
        else if (isSameRow(currentIndex, yPos)) return checkNextIndex(currentIndex + 1, yPos);
        return currentIndex;
      };
      const position = this.selectElementByIndex(index).offsetTop;
      return checkNextIndex(index, position);
    },
    findPrevious(index) {
      const isSameRow = (indx, pos) => this.selectElementByIndex(indx).offsetTop === pos;
      const checkNextIndex = (currentIndex, yPos) => {
        if (currentIndex >= this.getNumResults()) return checkNextIndex(0, yPos);
        else if (isSameRow(currentIndex, yPos)) return checkNextIndex(currentIndex - 1, yPos);
        return currentIndex;
      };
      const position = this.selectElementByIndex(index).offsetTop;
      return checkNextIndex(index, position);
    },
    /* Figures out which element is next, based on the key pressed *
     * current index and total number of items. Then calls focus function */
    arrowNavigation(key, numResults) {
      if (this.index === undefined) this.index = 0; // Start at beginning
      else if (key === 37) { // Left --> Previous
        this.index -= 1;
      } else if (key === 38) { // Up --> Previous
        this.index = this.findPrevious(this.index, numResults);
      } else if (key === 39) { // Right --> Next
        this.index += 1;
      } else if (key === 40) { // Down --> Next
        this.index = this.findNextRow(this.index, numResults);
      }
      /* Ensure the index is within bounds, then focus element */
      this.index = this.getSafeElementIndex(this.index);
      this.selectElementByIndex(this.index).focus();
    },
  },
  mounted() {
    window.addEventListener('keydown', (event) => {
      const currentElem = document.activeElement.id;
      const { key, keyCode } = event;
      if (/^[a-zA-Z]$/.test(key) && currentElem !== 'filter-tiles') {
      /* Letter key pressed - start searching */
        try {
          this.$refs.filter.focus();
          this.userIsTypingSomething();
        } catch (e) { /* Do nothing */ }
      } else if (keyCode >= 37 && keyCode <= 40) {
      /* Arrow key pressed - start navigation */
        const numResults = this.getNumResults();
        this.arrowNavigation(keyCode, numResults);
      } else if (keyCode === 27) {
      /* Esc key pressed - reset form */
        this.clearFilterInput();
      }
    });
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  section {
    display: flex;
    align-items: center;
    align-items: stretch;
    background: linear-gradient(0deg, var(--background) 0%, var(--background-darker) 100%);
  }
  form {
    display: flex;
    align-items: center;
    border-radius: 0 0 var(--curve-factor-navbar) 0;
    padding: 0 0.2rem 0.2rem 0;
    background: var(--search-container-background);
    label {
        display: inline;
        color: var(--settings-text-color);
        margin: 0.5rem;
        display: inline;
    }
    input {
      display: inline-block;
      width: 200px;
      height: 1rem;
      padding: 0.5rem;
      margin: 0.5rem;
      outline: none;
      border: none;
      border-radius: var(--curve-factor);
      background: var(--search-field-background);
      color: var(--settings-text-color);
      border: 1px solid var(--outline-color);
      &:focus {
        border-color: var(--settings-text-color);
        opacity: var(--dimming-factor);
      }
    }
    .clear-search {
      position: absolute;
      color: var(--settings-text-color);
      margin: 0.55rem 0 0 -2.2rem;
      padding: 0 0.4rem;
      font-style: normal;
      font-size: 1.5rem;
      opacity: var(--dimming-factor);
      border-radius: 50px;
      cursor: pointer;
      &:hover {
        opacity: 1;
        background: var(--background-darker);
      }
    }
  }

  @include tablet {
    form {
      display: block;
      text-align: center;
    }
  }
  @include phone {
    form {
      flex: 1;
      border-radius: 0;
      text-align: center;
      padding: 0.25rem 0;
      display: block;
    }
  }
</style>
