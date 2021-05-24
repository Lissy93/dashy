<template>
  <div :class="`input-container ${layout}`">
    <label v-if="label" for="name">{{label}}</label>
    <input
      :type="type"
      :value="value"
      v-on:input="updateValue($event.target.value)"
      :name="name"
      :id="name"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>

export default {
  name: 'Input',
  props: {
    value: String, // The value bound to v-model
    label: String, // An optional label to display above
    name: String, // Required unique ID value, for accessibility
    placeholder: String, // Optional placeholder value
    type: {
      default: 'text', // Input type, e.g. text, password, number
      type: String,
    },
    layout: { // Layout alignment direction, either horizonal or verical
      validator: (value) => ['horizontal', 'vertical'].indexOf(value) !== -1,
      type: String,
      default: 'vertical',
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style scoped lang="scss">
div.input-container {
  margin: 0.25rem auto;
  display: flex;
  align-items: baseline;
  &.vertical {
    flex-direction: column;
  }
  &.horizontal {
    flex-direction: row;
    justify-content: space-between;
    label { margin-right: 0.25rem; }
  }

  input {
    min-width: 10rem;
    padding: 0.5rem 0.75rem;
    margin: 0.5rem auto;
    font-size: 1.2rem;
    box-sizing: border-box;
    color: var(--primary);
    background: var(--background);;
    border: 1px solid var(--primary);
    border-radius: var(--curve-factor);
    &:focus {
      box-shadow: 1px 1px 6px var(--config-settings-color);
      outline: none;
    }
  }
}

</style>
