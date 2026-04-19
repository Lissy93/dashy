<template>
  <div class="dashy-schema-form">
    <div v-if="fatalError" class="form-error">
      <p>Unable to render this form. {{ fatalError }}</p>
      <p class="form-error-hint">See browser console or Config / Logs for details.</p>
    </div>
    <template v-else>
      <JsonForms
        :data="formData"
        :schema="schema"
        :uischema="uischema"
        :renderers="renderers"
        :validation-mode="validationMode"
        :ajv="ajv"
        :config="jfConfig"
        @change="onChange"
      />
      <p v-if="errorCount" class="validation-summary">
        {{ errorCount }} validation issue{{ errorCount === 1 ? '' : 's' }}. Review highlighted fields.
      </p>
    </template>
  </div>
</template>

<script>
import { JsonForms } from '@jsonforms/vue';
import { vanillaRenderers, defaultStyles } from '@jsonforms/vue-vanilla';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ErrorHandler from '@/utils/logging/ErrorHandler';
import safeClone from '@/utils/safeClone';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  addUsedSchema: false,
  useDefaults: true,
  validateSchema: false,
});
addFormats(ajv);

/* Global config for every control: keep field descriptions always visible,
 * not gated behind focus (the vue-vanilla default). */
const jfConfig = Object.freeze({ showUnfocusedDescription: true });

const dashyStyles = Object.fromEntries(
  Object.entries(defaultStyles).map(([group, map]) => [
    group,
    Object.fromEntries(Object.entries(map).map(([k, v]) => [
      k,
      typeof v === 'string' ? v.split(/\s+/).filter(Boolean).map(c => `dashy-jf-${c}`).join(' ') : v,
    ])),
  ]),
);

export default {
  name: 'SchemaForm',
  components: { JsonForms },
  props: {
    modelValue: { type: [Object, Array], default: null },
    schema: { type: Object, required: true },
    uischema: { type: Object, default: undefined },
    validationMode: { type: String, default: 'ValidateAndShow' },
  },
  emits: ['update:modelValue'],
  provide() {
    return { styles: dashyStyles };
  },
  data() {
    const empty = this.schema.type === 'array' ? [] : {};
    return {
      renderers: Object.freeze(vanillaRenderers),
      formData: safeClone(this.modelValue, empty),
      ajv,
      jfConfig,
      errorCount: 0,
      fatalError: null,
    };
  },
  errorCaptured(err, _vm, info) {
    /* Return false to stop Vue's default handler from also logging. */
    this.fatalError = err?.message || 'unknown error';
    ErrorHandler(`SchemaForm runtime error (${info})`, err);
    return false;
  },
  methods: {
    onChange({ data, errors }) {
      this.formData = data;
      this.errorCount = (errors || []).length;
      this.$emit('update:modelValue', data);
    },
  },
};
</script>

<style lang="scss">
/* Themed vue-vanilla styles, scoped to .dashy-schema-form. Class names match
 * the `dashy-jf-*` map provided to JsonForms above. */

$jf-gap: 0.75rem;
$jf-field-radius: var(--curve-factor, 4px);

.dashy-schema-form {
  color: var(--interactive-editor-color);

  > p.validation-summary {
    color: var(--warning);
    font-size: 0.9rem;
    text-align: right;
    margin: 0.25rem 0 0.5rem;
  }

  > .form-error {
    padding: 1rem;
    border: 1px solid var(--warning);
    border-radius: var(--curve-factor, 4px);
    color: var(--warning);
    background: var(--interactive-editor-background-darker, transparent);
    p { margin: 0.25rem 0; }
    .form-error-hint {
      opacity: var(--dimming-factor, 0.75);
      font-size: 0.85rem;
    }
  }

  /* Layouts */
  .dashy-jf-vertical-layout {
    display: flex;
    flex-direction: column;
    gap: $jf-gap;
  }
  .dashy-jf-horizontal-layout {
    display: flex;
    flex-direction: row;
    gap: $jf-gap;
    flex-wrap: wrap;
    .dashy-jf-horizontal-layout-item {
      flex: 1 1 auto;
      min-width: 0;
    }
  }

  /* Groups */
  .dashy-jf-group {
    border: 1px solid var(--interactive-editor-color);
    border-radius: $jf-field-radius;
    padding: 0.75rem 1rem;
    margin: 0.25rem 0;
    .dashy-jf-group-label {
      font-weight: bold;
      font-size: 1.05rem;
      margin: 0 0 0.5rem 0;
      color: var(--interactive-editor-color);
    }
    .dashy-jf-group-item + .dashy-jf-group-item {
      margin-top: $jf-gap;
    }
  }

  /* Controls (field wrapper + label + input + description + error) */
  .dashy-jf-control {
    display: flex;
    flex-direction: column;
    .dashy-jf-wrapper {
      display: flex;
      flex-direction: column;
    }
    .dashy-jf-label {
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
      color: var(--interactive-editor-color);
      .dashy-jf-asterisk {
        color: var(--warning, #ef5350);
        margin-left: 0.2rem;
      }
    }
    .dashy-jf-description {
      font-size: 0.8rem;
      opacity: var(--dimming-factor, 0.75);
      margin: 0.5rem 0;
      color: var(--interactive-editor-color);
    }
    .dashy-jf-error {
      color: var(--warning, #ef5350);
      font-size: 0.8rem;
      margin-top: 0.2rem;
    }
  }

  /* Inputs (text / number / select / textarea / checkbox) */
  .dashy-jf-input,
  .dashy-jf-select,
  .dashy-jf-text-area {
    width: 100%;
    padding: 0.4rem 0.6rem;
    font-size: 1rem;
    font-family: inherit;
    color: var(--interactive-editor-color);
    background: var(--interactive-editor-background);
    border: 1px solid var(--interactive-editor-color);
    border-radius: $jf-field-radius;
    box-sizing: border-box;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--interactive-editor-color);
    }
    &:disabled {
      opacity: var(--dimming-factor, 0.6);
      cursor: not-allowed;
    }
  }
  .dashy-jf-text-area {
    min-height: 5rem;
    resize: vertical;
    font-family: monospace;
  }
  /* Boolean rows: label + description on the left, checkbox on the right */
  .dashy-jf-control:has(input[type='checkbox']) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: "label box" "desc box";
    column-gap: 1rem;
    align-items: center;
    padding: 0.25rem 0;
    > .dashy-jf-label { grid-area: label; margin: 0; }
    > .dashy-jf-wrapper { grid-area: box; display: flex; }
    > .dashy-jf-description,
    > .dashy-jf-error { grid-area: desc; margin: 0.15rem 0 0; }
  }
  input[type='checkbox'].dashy-jf-input {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0;
    cursor: pointer;
    accent-color: var(--interactive-editor-color);
  }

  /* Arrays of objects */
  .dashy-jf-array-list {
    border: 1px solid var(--interactive-editor-color);
    border-radius: $jf-field-radius;
    padding: 0.5rem 0.75rem;
    margin: 0.25rem 0;
    .dashy-jf-array-list-legend {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .dashy-jf-array-list-label {
      font-weight: bold;
      font-size: 1rem;
      color: var(--interactive-editor-color);
    }
    .dashy-jf-array-list-no-data {
      opacity: var(--dimming-factor, 0.6);
      font-style: italic;
      padding: 0.5rem 0;
    }
    .dashy-jf-array-list-item-wrapper {
      border: 1px dashed var(--interactive-editor-color);
      border-radius: $jf-field-radius;
      margin: 0.5rem 0;
      padding: 0.25rem 0.5rem;
      background: var(--interactive-editor-background-darker, transparent);
    }
    .dashy-jf-array-list-item-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.25rem;
      padding: 0.25rem 0;
      .dashy-jf-array-list-item-label {
        flex: 1;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .dashy-jf-array-list-item-content {
      display: none;
      padding: 0.5rem 0.25rem 0.25rem;
      border-top: 1px dashed var(--interactive-editor-color);
      margin-top: 0.25rem;
      &.dashy-jf-expanded {
        display: block;
      }
    }
  }

  /* Buttons inside JSON Forms (add / remove / move) */
  .dashy-jf-array-list-add,
  .dashy-jf-array-list-item-move-up,
  .dashy-jf-array-list-item-move-down,
  .dashy-jf-array-list-item-delete {
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0.2rem 0.5rem;
    color: var(--interactive-editor-color);
    background: var(--interactive-editor-background);
    border: 1px solid var(--interactive-editor-color);
    border-radius: $jf-field-radius;
    &:hover:not(:disabled) {
      color: var(--interactive-editor-background);
      background: var(--interactive-editor-color);
    }
    &:disabled {
      opacity: var(--dimming-factor, 0.4);
      cursor: not-allowed;
    }
  }
  .dashy-jf-array-list-item-delete:hover:not(:disabled) {
    background: var(--warning, #ef5350);
    border-color: var(--warning, #ef5350);
  }

  /* Standalone labels / categorization (rarely used here) */
  .dashy-jf-label-element {
    font-weight: bold;
    margin: 0.5rem 0;
  }
}
</style>
