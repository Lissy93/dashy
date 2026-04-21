<template>
  <div class="language-switcher" :class="{ mini: miniView }">
    <h3 v-if="!miniView" class="title">{{ $t('language-switcher.title') }}</h3>
    <p v-if="!miniView" class="intro">{{ $t('language-switcher.dropdown-label') }}:</p>
    <span v-if="miniView" class="options-label">{{ $t('settings.language-label') }}</span>
    <v-select
      v-model="language"
      :selectOnTab="true"
      :options="languageList"
      class="language-dropdown"
      label="friendlyName"
      @input="applyLanguageLocally"
      @option:selected="onOptionSelected"
    />
    <template v-if="!miniView">
      <Button class="save-button" :click="saveLanguage" :disallow="!language">
        {{ $t('language-switcher.save-button') }}
        <SaveConfigIcon />
      </Button>
      <p v-if="language" class="current-lang">
        🌐 {{ language.flag }} {{ language.name }}
      </p>
      <p v-if="$i18n.availableLocales.length <= 1" class="sad-times">
        There are not currently any additional languages supported,
        but stay tuned as more are on their way!
      </p>
    </template>
  </div>
</template>

<script>
import Button from '@/components/FormElements/Button';
import SaveConfigIcon from '@/assets/interface-icons/save-config.svg';
import ErrorHandler from '@/utils/logging/ErrorHandler';
import Keys from '@/utils/StoreMutations';
import { languages } from '@/utils/languages';
import { getUsersLanguage } from '@/utils/config/ConfigHelpers';
import { localStorageKeys, modalNames } from '@/utils/config/defaults';

export default {
  name: 'LanguageSwitcher',
  components: {
    Button,
    SaveConfigIcon,
  },
  props: {
    miniView: Boolean, // If true, render only the dropdown and auto-save on select
  },
  data() {
    return {
      language: '', // The currently selected language
      modalName: modalNames.LANG_SWITCHER, // Key for modal
    };
  },
  created() {
    // Initiate the current language, with VueX state
    this.language = this.savedLanguage;
  },
  computed: {
    /* Get appConfig from store */
    appConfig() {
      return this.$store.getters.appConfig;
    },
    /* The ISO code for users current lang */
    savedLanguage: {
      get() {
        return getUsersLanguage();
      },
      set(newLang) {
        this.$store.commit(Keys.SET_LANGUAGE, newLang.code);
      },
    },
    /* Return the array of language objects, plus a friends name */
    languageList: () => languages.map((lang) => {
      const newLang = lang;
      newLang.friendlyName = `${lang.flag} ${lang.name}`;
      return newLang;
    }),
  },
  methods: {
    /* Check if language is supported */
    checkLocale(selectedLanguage) {
      if (!selectedLanguage || !selectedLanguage.code) return false;
      const i18nLocales = this.$i18n.availableLocales;
      return i18nLocales.includes(selectedLanguage.code);
    },
    /* Apply language locally */
    applyLanguageLocally() {
      if (this.language && this.language.code) {
        this.$i18n.locale = this.language.code;
      } else {
        ErrorHandler('Error applying language, it\'s config may be missing of incomplete');
      }
    },
    /* Save language to local storage, show success msg and close modal */
    saveLanguage() {
      const selectedLanguage = this.language;
      if (this.checkLocale(selectedLanguage)) {
        localStorage.setItem(localStorageKeys.LANGUAGE, selectedLanguage.code);
        this.applyLanguageLocally();
        this.savedLanguage = selectedLanguage;
        const successMsg = `${selectedLanguage.flag} `
          + `${this.$t('language-switcher.success-msg')} ${selectedLanguage.name}`;
        this.$toast.success(successMsg);
        if (!this.miniView) this.$modal.hide(this.modalName);
      } else {
        this.$toast.error('Unable to update language');
        ErrorHandler('Unable to apply language');
      }
    },
    /* In miniView, commit immediately on selection (no save button) */
    onOptionSelected() {
      if (this.miniView) this.saveLanguage();
    },
  },
};
</script>

<style scoped lang="scss">

.language-switcher {
  height: 100%;
  margin: 0;
  padding: 1rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  h3.title {
    text-align: center;
  }
  p.intro {
    margin: 0;
  }
  button.save-button {
    margin: 0 auto;
    width: 100%;
  }
  p.sad-times {
    color: var(--warning);
    text-align: center;
  }
  p.current-lang {
    color: var(--success);
    opacity: var(--dimming-factor);
    text-align: center;
    position: absolute;
    margin: 1rem auto;
    cursor: default;
    width: 100%;
    bottom: 0;
  }
  &.mini {
    height: auto;
    padding: 0;
    background: transparent;
    flex: 1;
  }
}

</style>

<style lang="scss">
@import '@/styles/style-helpers.scss';
.language-dropdown {
  margin: 1rem auto;
  ul.vs__dropdown-menu {
    max-height: 14rem;
    @extend .scroll-bar;
  }
  div.vs__dropdown-toggle {
    padding: 0.2rem 0;
  }
  div, input {
    cursor: pointer;
  }
  button.vs__clear {
    display: none;
  }
}

.language-switcher.mini .language-dropdown {
  margin: 0;
  width: 100%;
  div.vs__dropdown-toggle {
    border-color: var(--primary);
    border-radius: var(--curve-factor);
    height: 1.8rem;
    font-size: 0.85rem;
  }
  span.vs__selected { margin: 0.1rem 0 0.5rem 0; }
  svg.vs__open-indicator {
    fill: var(--primary);
  }
}

</style>
