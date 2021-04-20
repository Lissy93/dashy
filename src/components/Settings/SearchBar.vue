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
    /* Focus a search result, based on it's index */
    focusEelement(index) {
      document.getElementsByClassName('item')[index].focus();
    },
    /* Figures out which element is next, based on the key pressed *
     * current index and total number of items. Then calls focus function */
    arrowNavigation(key, numResults) {
      if (this.index === undefined) this.index = 0; // Start at beginning
      else if (key === 37) { // Left --> Previous
        this.index -= 1;
      } else if (key === 38) { // Up --> Previous
        this.index -= 1;
      } else if (key === 39) { // Right --> Next
        this.index += 1;
      } else if (key === 40) { // Down --> Next
        this.index += 1;
      }
      /* If at the end, move to start, and vica verca */
      if (this.index < 0) this.index = numResults - 1;
      else if (this.index >= numResults) this.index = 0;
      /* Call to focus function, to select given element*/
      this.focusEelement(this.index);
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
        const numResults = document.getElementsByClassName('item').length;
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
