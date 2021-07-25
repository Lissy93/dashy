<template>
  <div class="login-page">
    <form class="login-form">
      <h2 class="login-title">{{ $t('login.title') }}</h2>
      <Input
        v-model="username"
        type="text"
        :label="$t('login.username-label')"
        class="login-field username"
      />
      <Input
        v-model="password"
        type="password"
        :label="$t('login.password-label')"
        class="login-field password"
      />
      <label>{{ $t('login.remember-me-label') }}</label>
      <v-select
        v-model="timeout"
        :selectOnTab="true"
        :options="dropDownMenu"
        class="login-time-dropdown"
      />
      <Button class="login-button" :click="submitLogin">
        {{ $t('login.login-button') }}
      </Button>
      <transition name="bounce">
        <p :class="`login-error-message ${status}`" v-show="message">{{ message }}</p>
      </transition>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import Button from '@/components/FormElements/Button';
import Input from '@/components/FormElements/Input';
import Defaults, { localStorageKeys } from '@/utils/defaults';
import { checkCredentials, login } from '@/utils/Auth';

export default {
  name: 'login',
  props: {
    appConfig: Object,
  },
  data() {
    return {
      username: '',
      password: '',
      message: '',
      status: 'waiting', // wating, error, success
      timeout: { label: this.$t('login.remember-me-never'), time: 0 },
      dropDownMenu: [ // Data for timeout dropdown menu, translated label + value in ms
        { label: this.$t('login.remember-me-never'), time: 0 },
        { label: this.$t('login.remember-me-hour'), time: 14400 * 1000 },
        { label: this.$t('login.remember-me-day'), time: 86400 * 1000 },
        { label: this.$t('login.remember-me-week'), time: 604800 * 1000 },
      ],
    };
  },
  components: {
    Button,
    Input,
  },
  methods: {
    /* Checks form is filled in, then initiates the login, and redirects to /home */
    submitLogin() {
      const timeout = this.timeout ? this.timeout.time : 0;
      const response = checkCredentials(this.username, this.password, this.appConfig.auth || []);
      this.message = response.msg; // Show error or success message to the user
      this.status = response.correct ? 'success' : 'error';
      if (response.correct) { // Yay, credentials were correct :)
        login(this.username, this.password, timeout); // Login, to set the cookie
        setTimeout(() => { // Wait a short while, then redirect back home
          router.push({ path: '/' });
        }, 250);
      }
    },
    /* Since we don't have the Theme setter at this point, we must manually set users theme */
    setTheme() {
      const theme = localStorage[localStorageKeys.THEME] || Defaults.theme;
      document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);
    },
  },
  created() {
    this.setTheme();
  },
};

</script>

<style lang="scss">

/* Login page base styles */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--footer-height));

  /* Login form container */
  form.login-form {
    background: var(--login-form-background);
    color: var(--login-form-color);
    border: 1px solid var(--login-form-color);
    border-radius: var(--curve-factor);
    font-size: 1.4rem;
    padding: 2rem;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;

    /* Login form title */
    h2.login-title {
      font-size: 3rem;
      margin: 0 0 1rem 0;
      text-align: center;
      cursor: default;
    }

    /* Set sizings for input fields and login button */
    .login-field input, Button.login-button {
      width: 20rem;
      margin: 0.5rem auto;
      font-size: 1.4rem;
      padding: 0.5rem 1rem;
    }

    /* Custom colors for username/ password input fields */
    .login-field input {
      color: var(--login-form-color);
      border-color: var(--login-form-color);
      background: var(--login-form-background);
    }
    /* Custom colors for Login Button */
    Button.login-button {
      background: var(--login-form-color);
      border-color: var(--login-form-background);
      color: var(--login-form-background);
      &:hover {
        color: var(--login-form-color);
        border-color: var(--login-form-color);
        background: var(--login-form-background);
      }
      &:active, &:focus {
        box-shadow: 1px 1px 6px var(--login-form-color);
      }
    }
    /* Apply color to status message, depending on status */
    p.login-error-message {
      font-size: 1rem;
      text-align: center;
      &.waiting { color: var(--login-form-color); }
      &.success { color: var(--success); }
      &.error { color: var(--warning); }
    }
  }
}

/* Enter animations for error/ success message */
.bounce-enter-active { animation: bounce-in 0.25s; }
.bounce-leave-active { animation: bounce-in 0.25s reverse; }
@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

/* Custom styles for dropdown component */
.v-select.login-time-dropdown {
  margin: 0.5rem 0;
  .vs__dropdown-toggle {
    border-color: var(--login-form-color);
    background: var(--login-form-background);
    cursor: pointer;
    span.vs__selected {
      color: var(--login-form-color);
    }
    .vs__actions svg path { fill: var(--login-form-color); }
  }
  ul.vs__dropdown-menu {
    background: var(--login-form-background);
    border-color: var(--login-form-color);
    li {
      color: var(--login-form-color);
      &:hover {
        color: var(--login-form-background);
        background: var(--login-form-color);
      }
      &.vs__dropdown-option--highlight {
        color: var(--login-form-background) !important;
        background: var(--login-form-color);
      }
    }
  }
}
</style>
