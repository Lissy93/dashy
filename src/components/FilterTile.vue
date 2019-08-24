<template>
  <section>
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
          class="el-icon-circle-close clear-search"
          title="Clear search"
          @click="clearFilterInput"></i>
      </form>
      <div class="space-filler"></div>
  </section>
</template>

<script>

export default {
  name: 'FilterTile',
  data () {
    return {
      input: ''
    }
  },
  methods: {
    userIsTypingSomething () {
      this.$emit('user-is-searchin', this.input)
    },
    clearFilterInput () {
      this.input = ''
      this.userIsTypingSomething()
      document.activeElement.blur()
    },
  },
  mounted: function() {
      window.addEventListener('keyup', (event) => {
        const key = event.key
        if(/^[a-zA-Z]$/.test(key) && !document.activeElement.id) {
          this.input += key
          this.$refs.filter.focus()
          this.userIsTypingSomething()
        }
      });
    }
}
</script>

<style scoped lang="scss">
  section {
    display: flex;
    align-items: center;
    align-items: stretch;
    background: linear-gradient(0deg, rgba(47,50,58,1) 0%, rgba(40,42,50,1) 100%);
  }
  form {
    border-radius: 0 0 20px 0;
    padding: 0 0.2rem 0.2rem 0;
    background: #282a32;
    label {
        display: inline;
        background: -webkit-gradient(linear, right bottom, left top, from(#9F86FF), color-stop(#1CA8DD), to(#007AE1));
        background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0.5rem;
        display: inline;
    }
    input {
      display: inline-block;
      width: 200px;
      padding: 0.5rem;
      margin: 0.5rem;
      outline: none;
      border: none;
      border-radius: 12px;
      background: #607d8b33;
      box-shadow: 1px 1px 2px #232323;
      color: #1CA8DD;
      font-family: 'Comfortaa', cursive;
      &:focus {
        background: #607d8b4a;
      }
    }
    .clear-search {
      position: absolute;
      margin: 1em 0 0 -2em;
      color: #1CA8DD;
      opacity: 0.5;
      border-radius: 50px;
      cursor: pointer;
      &:hover {
        opacity: 1;
        background: #282a32;
      }
    }
  }
  .space-filler {
    flex: 1;
    border-radius: 20px 0 0;
    background: #2f323a;
  }
  @media screen and (max-width: 600px) {
    form {
      flex: 1;
      border-radius: 0;
      text-align: center;
      padding: 0.25rem 0;
    }
    .space-filler {
      display: none;
    }
  }
</style>
