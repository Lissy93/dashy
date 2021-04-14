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
    },
  },
  mounted() {
    window.addEventListener('keyup', (event) => {
      const { key, keyCode } = event;
      if (/^[a-zA-Z]$/.test(key) && !document.activeElement.id) {
        try {
          this.input += key;
          this.$refs.filter.focus();
          this.userIsTypingSomething();
        } catch (e) {
          // Do nothing
        }
      } else if (keyCode === 27) {
        this.clearFilterInput();
      }
    });
  },
};
</script>

<style scoped lang="scss">

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
    background: var(--background-darker);
    label {
        display: inline;
        color: var(--primary);
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
      background: var(--background);
      color: var(--primary);
      border: 1px solid var(--outline-color);
      &:focus {
        border-color: var(--primary);
        opacity: var(--dimming-factor);
      }
    }
    .clear-search {
      position: absolute;
      color: var(--primary);
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

  @media screen and (max-width: 600px) {
    form {
      flex: 1;
      border-radius: 0;
      text-align: center;
      padding: 0.25rem 0;
    }
  }
</style>
