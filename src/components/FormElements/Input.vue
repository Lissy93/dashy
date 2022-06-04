<template>
  <div :class="`input-container ${layout}`">
    <label
      v-if="label"
      for="name"
      class="input-label"
    >
      {{label}}
    </label>
    <input
      :type="type"
      :value="value"
      v-on:input="updateValue($event.target.value)"
      :name="name"
      :id="name"
      :placeholder="placeholder"
      @keyup.enter="onEnter ? onEnter() : () => {}"
      class="input-field"
    />
    <p
      v-if="description"
      class="input-description"
    >
    {{ description }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'Input',
  props: {
    value: [String, Number], // The value bound to v-model
    label: String, // An optional label to display above
    name: String, // Required unique ID value, for accessibility
    placeholder: String, // Optional placeholder value
    description: String, // Optional info paragraph
    onEnter: Function,
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
@import '@/styles/media-queries.scss';

div.input-container {
  margin: 0.25rem auto;
  display: flex;
  align-items: baseline;
  &.vertical {
    flex-direction: column;
  }
  &.horizontal {
    @include tablet-up {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      label.input-label,
      input.input-field,
      p.input-description {
        margin: 0.25rem;
        flex-basis: 8rem;
        flex-grow: 1;
      }
      input.input-field { flex-grow: 2; }
      p.input-description { flex-grow: 3; }
    }
  }

  input.input-field {
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

  label.input-label {
    text-transform: capitalize;
  }

  p.input-description {
    opacity: var(--dimming-factor);
  }

  @include tablet-down {
    flex-direction: column;
    align-items: start;
    input.input-field {
      margin: 0.5rem;
    }
  }
}

</style>
