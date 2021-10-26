<template>
  <div class="select-container">
    <label v-if="label" class="select-label">{{ label }}</label>
    <v-select
      @input="updateValue"
      :value="selectedOption"
      :selectOnTab="true"
      :options="options"
      class="form-dropdown"
    />
    <p v-if="description" class="select-description">{{ description }}</p>
  </div>
</template>

<script>

export default {
  name: 'Select',
  components: {},
  props: {
    options: Array, // Array of available options
    initialOption: String, // Optional default option
    label: String, // Form label for element
    description: String, // Optional description text
  },
  data() {
    return {
      selectedOption: '', // The currently selected val
    };
  },
  created() {
    if (this.initialOption) {
      this.selectedOption = this.initialOption;
    }
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
      this.selectedOption = value;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

div.select-container {
  margin: 0.25rem auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  label.select-label,
  .form-dropdown,
  p.select-description {
    margin: 0.25rem;
    flex-basis: 8rem;
    flex-grow: 1;
  }
   label.select-label {
    text-transform: capitalize;
  }
  p.select-description {
    flex-grow: 3;
    opacity: var(--dimming-factor);
  }
  .form-dropdown {
    flex-grow: 2;
    min-width: 12rem;
    margin: 0.5rem auto;
    font-size: 1.2rem;
    box-sizing: border-box;
    color: var(--primary);
    background: var(--background);;
    border-radius: var(--curve-factor);
    &:focus {
      box-shadow: 1px 1px 6px var(--config-settings-color);
      outline: none;
    }
  }
  @include tablet-down {
    flex-direction: column;
    align-items: start;
      label.select-label,
      .form-dropdown,
      p.select-description {
        margin: 0.5rem;
        flex-basis: auto;
      }
  }
}
</style>

<style lang="scss">
@import '@/styles/style-helpers.scss';

.form-dropdown {
  margin: 1rem auto;
  ul.vs__dropdown-menu {
    max-height: 14rem;
    @extend .scroll-bar;
  }
  input.vs__search {
    color: var(--primary);
  }
  div.vs__dropdown-toggle {
    padding: 0.2rem 0;
    border-color: var(--primary);
    background: var(--background);
    .vs__actions svg {
      height: 1.2rem;
      width: 1.2rem;
      border: none;
      margin: 0;
      padding: 0.2rem 0 0 0.2rem;
      &:hover {
        background: var(--primary);
        path { fill: var(--background); }
      }
    }
  }
  div, input {
    cursor: pointer;
  }
}

</style>
