<template>
  <section>
    <label for="filter-tiles">Search</label>
    <input
      id="filter-tiles"
      v-model="input"
      placeholder="Start typing to filter tiles..."
      v-on:input="userIsTypingSomething" />
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
    }
  }
}
</script>

<style scoped lang="scss">
  section {
    display: flex;
    align-items: center;
    margin: 0.25em;
    border-radius: 5px;
    border: 1px solid transparent;

    border: 1px solid #30556469;
    -webkit-box-shadow: 1px 1px 2px #130f23;
    box-shadow: 1px 1px 2px #130f23;
  }
  label {
      display: inline;
      background: -webkit-gradient(linear, right bottom, left top, from(#9F86FF), color-stop(#1CA8DD), to(#007AE1));
      background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0.5em;
      display: inline;
  }
  input {
    display: inline-block;
    width: 200px;
    padding: 0.5em;
    margin: 0.5em;
    outline: none;
    border: none;
    border-radius: 5px;
    background: #607d8b33;
    box-shadow: 1px 1px 2px #232323;
    color: #1CA8DD;
    font-family: 'Comfortaa', cursive;
    &:focus {
      background: #607d8b4a;
    }
  }
</style>
