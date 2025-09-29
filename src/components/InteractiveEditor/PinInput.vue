<template>
  <div class="pin-gate">
    <div class="pin-head">
      <i class="far fa-lock" aria-hidden="true"></i>
      <span>{{ $t('pin.lockedSection') }}</span>
    </div>

    <FormSchema
      :schema="schema"
      v-model="form"
      name="pinInputForm"
      class="pin-form"
    />

    <div class="pin-actions">
      <button class="pin-btn" @click="submit" :aria-label="$t('pin.unlock')">
        <i class="fas fa-unlock-alt btn-icon" aria-hidden="true"></i>
        {{ $t('pin.unlock') }}
      </button>
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
            title: this.$t('pin.enter-pin'),
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

@import '@/styles/pin-input.scss';

</style>
