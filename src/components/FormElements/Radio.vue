<template>
  <div class="radio-container">
    <label v-if="label" class="radio-label">{{ label }}</label>
    <div class="radio-wrapper">
      <div v-for="radio in options" :key="radio.value"
        :class="`radio-option ${disabled ? 'wrap-disabled' : ''}`">
        <label :for="`id-${radio.value}`" class="option-label">{{ radio.label }}</label>
        <input type="radio" class="radio-input"
          :id=" `id-${radio.value}`"
          :name="makeGroupName"
          :value="radio.value"
          :disabled="disabled || radio.disabled"
          v-model="selectedRadio"
          v-on:input="updateValue($event.target.value)"
        />
      </div>
    </div>
    <p v-if="description" class="radio-description">{{ description }}</p>
  </div>
</template>

<script>

export default {
  name: 'Radio',
  components: {},
  props: {
    options: Array, // Array of objects for available options
    initialOption: String, // Optional default option
    label: String, // Form label for element
    description: String, // Optional description text
    disabled: Boolean, // Disable all radio buttons
  },
  data() {
    return {
      selectedRadio: '', // The currently radio val
    };
  },
  created() {
    if (this.initialOption) {
      this.updateValue(this.initialOption);
    }
  },
  computed: {
    makeGroupName() {
      return this.label.toLowerCase().replace(/[^a-z]+/, '');
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
      this.selectedRadio = value;
    },
  },
};
</script>

<style scoped lang="scss">
div.radio-container {
  margin: 0.25rem auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  label.radio-label,
  .radio-wrapper,
  p.radio-description {
    margin: 0.25rem;
    flex-basis: 8rem;
    flex-grow: 1;
  }
   label.radio-label {
    text-transform: capitalize;
  }
  p.radio-description {
    flex-grow: 3;
    opacity: var(--dimming-factor);
  }
  .radio-wrapper {
    display: flex;
    flex-grow: 2;
    margin: 0.5rem auto;
    font-size: 1.2rem;
    color: var(--primary);
    background: var(--background);;
    border-radius: var(--curve-factor);
    min-width: 8rem;
    .radio-option {
      margin: 0.2rem;
      padding: 0.2rem;
      cursor: pointer;
      border: 1px solid transparent;
      border-radius: var(--curve-factor);
      &:hover:not(.wrap-disabled) {
        border: 1px solid var(--primary);
      }
      &:disabled {
        opacity: var(--dimming-factor);
      }
      label.option-label, input.radio-input {
        cursor: pointer;
        text-transform: capitalize;
        margin: 0.2rem;
      }
    }
  }
}
</style>
