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

import ArrowKeyNavigation from '@/utils/ArrowKeyNavigation';

export default {
  name: 'FilterTile',
  data() {
    return {
      input: '', // Users current search term
      akn: new ArrowKeyNavigation(), // Class that manages arrow key naviagtion
    };
  },
  mounted() {
    window.addEventListener('keydown', (event) => {
      const currentElem = document.activeElement.id;
      const { key, keyCode } = event;
      if (/^[a-zA-Z]$/.test(key) && currentElem !== 'filter-tiles') {
        /* Letter key pressed - start searching */
        this.$refs.filter.focus();
        this.userIsTypingSomething();
      } else if (keyCode >= 37 && keyCode <= 40) {
      /* Arrow key pressed - start navigation */
        this.akn.arrowNavigation(keyCode);
      } else if (keyCode === 27) {
      /* Esc key pressed - reset form */
        this.clearFilterInput();
      }
    });
  },
  methods: {
    /* Emmits users's search term up to parent */
    userIsTypingSomething() {
      this.$emit('user-is-searchin', this.input);
    },
    /* Resets everything to initial state, when user is finished */
    clearFilterInput() {
      this.input = ''; // Clear input model
      this.userIsTypingSomething(); // Emmit new empty value
      document.activeElement.blur(); // Remove focus
      this.akn.resetIndex(); // Reset current element index
    },
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
