<template>
  <div class="language-switcher">
    <h3 class="title">{{ $t('language-switcher.title') }}</h3>
    <p class="intro">{{ $t('language-switcher.dropdown-label') }}:</p>
    <v-select
      v-model="language"
      :selectOnTab="true"
      :options="availibleLanguages"
      class="language-dropdown"
      label="name"
      :input="setLangLocally()"
    />
    <Button class="save-button" :click="saveLanguage" :disallow="!language">
      {{ $t('language-switcher.save-button') }}
      <SaveConfigIcon />
    </Button>
    <p v-if="language">{{ language.flag }} {{ language.name }}</p>
    <p v-if="$i18n.availableLocales.length <= 1" class="sad-times">
      There are not currently any additional languages supported,
      but stay tuned as more are on their way!
    </p>
  </div>
</template>

<script>
import Button from '@/components/FormElements/Button';
import { languages } from '@/utils/languages';
import SaveConfigIcon from '@/assets/interface-icons/save-config.svg';
import { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'LanguageSwitcher',
  inject: ['config'],
  components: {
    Button,
    SaveConfigIcon,
  },
  data() {
    return {
      availibleLanguages: languages,
      language: '',
    };
  },
  methods: {
    /* Save language to local storage */
    saveLanguage() {
      const selectedLanguage = this.language;
      if (this.checkLocale(selectedLanguage)) {
        localStorage.setItem(localStorageKeys.LANGUAGE, selectedLanguage.code);
        this.setLangLocally();
        const successMsg = `${selectedLanguage.flag} `
          + `${this.$t('language-switcher.success-msg')} ${selectedLanguage.name}`;
        this.$toasted.show(successMsg, { className: 'toast-success' });
      }
    },
    /* Check language is supported, before saving */
    checkLocale(selectedLanguage) {
      if (!selectedLanguage || !selectedLanguage.code) return false;
      const i18nLocales = this.$i18n.availableLocales;
      return i18nLocales.includes(selectedLanguage.code);
    },
    /* Apply language locally */
    setLangLocally() {
      if (this.language && this.language.code) {
        this.$i18n.locale = this.language.code;
      }
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

  .language-dropdown {
    margin: 1rem auto;
    div.vs__dropdown-toggle {
      padding: 0.2rem 0;
    }
  }
}

</style>
