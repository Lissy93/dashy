<template>
  <div class="pin-gate">
    <div class="pin-head">
      <i class="far fa-lock" aria-hidden="true"></i>
      <span>Locked section</span>
    </div>

    <FormSchema
      :schema="schema"
      v-model="form"
      name="pinInputForm"
      class="pin-form"
    />

    <div class="pin-actions">
      <button class="pin-btn" @click="submit">
        <i class="fas fa-unlock-alt btn-icon" aria-hidden="true"></i>
        Unlock</button>
      <button class="pin-reset" @click="lockAgain" type="button">
        <i class="fas fa-lock btn-icon" aria-hidden="true"></i>
        Lock</button>
    </div>
  </div>
</template>

<script>
import FormSchema from '@formschema/native';

export default {
  name: 'PinInput',
  components: { FormSchema },
  props: {
    id: String,
  },
  data() {
    return {
      form: { pin: '' },
      schema: {
        type: 'object',
        properties: {
          pin: {
            title: 'Enter PIN',
            type: 'string',
            attrs: {
              type: 'password',
              inputmode: 'numeric',
              autocomplete: 'one-time-code',
              placeholder: '••••',
            },
          },
        },
        required: ['pin'],
      },
    };
  },
  methods: {
    submit() {
      const tried = String(this.form.pin || '');
      this.$emit('unlock_attempt', {
        pin: tried,
        id: this.id,
      });
      // clear local field
      this.form.pin = '';
    },
    lockAgain() {
    },
  },
};
</script>

<style scoped lang="scss">
  .pin-gate {
    padding: .9rem;
    border-radius: var(--curve-factor);
    border: 1px solid var(--border);
    background: var(--item-background);
    box-shadow: var(--item-shadow);
    color: var(--primary);
  }

  .pin-head {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: .6rem;
    font-weight: 600;
  }
  .pin-form {
    margin-bottom: .6rem;
  }
  .pin-actions {
    display: flex;
    align-items: center;
    justify-content: right;
    gap: .5rem;
    flex-wrap: wrap;
  }

  .pin-btn {
    padding: .5rem .9rem;
    border-radius: .6rem;
    border: 1px solid var(--border);
    background: var(--button-bg);
    color: var(--primary);
    cursor: pointer;
    transition: transform .06s ease;

    &:active { transform: translateY(1px); }
  }

  .pin-reset {
    background: transparent;
    border: none;
    padding: .3rem .2rem;
    color: var(--primary);
    opacity: .8;
    text-decoration: underline;
    cursor: pointer;

    &:hover { opacity: 1; }
  }
  .btn-icon {
    margin-right: .4rem;
    font-size: .95em;
    line-height: 0;
    opacity: .9;
  }
</style>
