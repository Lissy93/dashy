<template>
  <div
    class="critical-error-wrap" v-if="shouldShow">
    <h3>Configuration Load Error</h3>
    <p>
      It looks like there was an error loading the configuration.<br>
    </p>
    <p>Please ensure that:</p>
    <ul>
      <li>The configuration file can be found at the specified location</li>
      <li>There are no CORS rules preventing client-side access</li>
      <li>The YAML is valid, parsable and matches the schema</li>
    </ul>
    <p>
      You can check the browser console for more details.<br>
      If this issue persists, open a ticket on our GitHub.
    </p>
    <h4>Error Details:</h4>
    <p class="the-error">{{ this.$store.state.criticalError }}</p>

    <button class="user-doesnt-care" @click="ignoreWarning">Ignore Error</button>
  </div>
</template>

<script>
import { localStorageKeys } from '@/utils/defaults';
import Keys from '@/utils/StoreMutations';

export default {
  name: 'CriticalError',
  props: {
    text: String,
  },
  data() {
    return {

    };
  },
  computed: {
    shouldShow() {
      return this.$store.state.criticalError
      && !localStorage[localStorageKeys.DISABLE_CRITICAL_WARNING];
    },
  },
  methods: {
    ignoreWarning() {
      this.$store.commit(Keys.CRITICAL_ERROR_MSG, null);
      localStorage.setItem(localStorageKeys.DISABLE_CRITICAL_WARNING, true);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
.critical-error-wrap {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background: var(--background-darker);
  padding: 1rem;
  border-radius: var(--curve-factor);
  color: var(--danger);
  border: 2px solid var(--danger);
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0.95;
  gap: 0.5rem;
  @include tablet-down {
    top: 50%;
    width: 85vw;
  }
  p, ul, h4 {
    margin: 0;
    color: var(--white);
  }
  h4 {
    margin-top: 1rem;
  }
  h3 {
    font-size: 2.2rem;
    text-align: center;
    background: var(--danger);
    color: white;
    margin: -1rem -1rem 1rem -1rem;
    padding: 0.5rem;
  }
  ul {
    padding-left: 1rem;
  }
  .the-error {
    color: var(--danger);
  }
  .user-doesnt-care {
    background: var(--background-darker);
    color: var(--white);
    border-radius: var(--curve-factor);
    border: none;
    text-decoration: underline;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    width: fit-content;
    margin: 0 auto;
    transition: all 0.2s ease-in-out;
    &:hover {
      background: var(--danger);
      color: var(--background-darker);
      text-decoration: none;
    }
  }
}
</style>
