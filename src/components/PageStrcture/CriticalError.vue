<template>
  <div class="critical-error-wrap" v-if="shouldShow">
    <button class="close" title="Close Warning" @click="close">🗙</button>
    <h3>{{ $t('critical-error.title') }}</h3>
    <p>{{ $t('critical-error.subtitle') }}</p>
    <h4>{{ $t('critical-error.sub-ensure-that') }}</h4>
    <ul>
      <li>The configuration file can be found at the specified location</li>
      <li>There are no CORS rules preventing client-side access</li>
      <li>The YAML is valid, parsable and matches the schema</li>
    </ul>
    <h4>{{ $t('critical-error.sub-error-details') }}</h4>
    <pre>{{ this.$store.state.criticalError }}</pre>
    <h4>{{ $t('critical-error.sub-next-steps') }}</h4>
    <ul>
      <li>Check the browser console for more details
        (<a href="https://github.com/Lissy93/dashy/blob/master/docs/troubleshooting.md#how-to-open-browser-console">see how</a>)
      </li>
      <li>View the
        <a href="https://github.com/Lissy93/dashy/blob/master/docs/troubleshooting.md">Troubleshooting Guide</a>
        and <a href="https://dashy.to/docs/">Docs</a>
      </li>
      <li>
        If you've verified the config is present, accessible and valid, and cannot find the solution
        in the troubleshooting, docs or GitHub issues,
        then <a href="https://github.com/Lissy93/dashy/issues/new/choose">open a ticket on GitHub</a>
      </li>
      <li>Click 'Ignore Critical Errors' below to not show this warning again</li>
    </ul>
    <button class="user-doesnt-care" @click="ignoreWarning">
      {{ $t('critical-error.ignore-button') }}
    </button>
  </div>
</template>

<script>
import { localStorageKeys } from '@/utils/defaults';
import Keys from '@/utils/StoreMutations';

export default {
  name: 'CriticalError',
  computed: {
    /* Determines if we should show this component.
     * If error present AND user hasn't disabled */
    shouldShow() {
      return this.$store.state.criticalError
      && !localStorage[localStorageKeys.DISABLE_CRITICAL_WARNING];
    },
  },
  methods: {
    /* Ignore all future errors, by putting a key in local storage */
    ignoreWarning() {
      localStorage.setItem(localStorageKeys.DISABLE_CRITICAL_WARNING, true);
      this.close();
    },
    /* Close this dialog, by removing this error from the local store */
    close() {
      this.$store.commit(Keys.CRITICAL_ERROR_MSG, null);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
.critical-error-wrap {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  max-width: 50rem;
  background: var(--background-darker);
  padding: 1rem;
  border-radius: var(--curve-factor);
  color: var(--danger);
  border: 2px solid var(--danger);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  @include tablet-down {
    top: 50%;
    width: 85vw;
  }
  p, ul, h4, a {
    margin: 0;
    color: var(--white);
  }
  pre {
    color: var(--warning);
    font-size: 0.8rem;
    overflow: auto;
    background: var(--transparent-white-10);
    padding: 0.5rem;
    border-radius: var(--curve-factor);
  }
  h4 {
    margin: 0.5rem 0 0 0;
    font-size: 1.2rem;
  }
  h3 {
    font-size: 2.2rem;
    text-align: center;
    background: var(--danger);
    color: var(--white);
    margin: -1rem -1rem 1rem -1rem;
    padding: 0.5rem;
  }
  ul {
    padding-left: 1rem;
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
  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    background: var(--background);
    color: var(--primary);
    border: none;
    border-radius: var(--curve-factor);
    transition: all 0.2s ease-in-out;
    &:hover {
      background: var(--primary);
      color: var(--background);
    }
  }
}
</style>
