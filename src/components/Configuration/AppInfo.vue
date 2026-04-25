<template>
  <div class="about-modal">
    <h2 class="title">{{ $t('app-info.title') }}</h2>
    <!-- Source and Docs Links -->
    <h3>{{ $t('app-info.more-info') }}</h3>
    {{ $t('app-info.source') }}:
    <a href="https://github.com/lissy93/dashy"
      target="_blank" rel="noopener noreferrer">github.com/lissy93/dashy</a><br>
    {{ $t('app-info.documentation') }}:
    <a href="https://dashy.to/docs"
      target="_blank" rel="noopener noreferrer">dashy.to/docs</a>
    <!-- Bug Reports -->
    <h3>{{ $t('app-info.report-bug') }}</h3>
    {{ $t('app-info.report-bug-description') }}
    <a href="#"
      @click.prevent="$emit('navigate-tab', 'debug')">{{
        $t('app-info.report-bug-debug-link') }}</a>
    {{ $t('app-info.report-bug-middle') }}
    <a href="https://github.com/Lissy93/dashy/issues/new/choose"
      target="_blank" rel="noopener noreferrer">{{ $t('app-info.report-bug-link') }}</a>.
    <!-- Please, I really need to pay my rent! -->
    <h3>{{ $t('app-info.sponsor-heading') }}</h3>
    {{ $t('app-info.sponsor-l1-prefix') }}
    <a href="https://github.com/sponsors/Lissy93"
      target="_blank" rel="noopener noreferrer">{{ $t('app-info.sponsor-l1-link') }}</a>
    {{ $t('app-info.sponsor-l1-suffix') }}
    <!-- Privacy & Security -->
    <h3>{{ $t('app-info.privacy-and-security') }}</h3>
    {{ $t('app-info.privacy-and-security-l1') }}
    <a href="https://dashy.to/docs/privacy"
      target="_blank" rel="noopener noreferrer">{{
        $t('app-info.privacy-and-security-privacy-policy') }}</a>.
    <br>
    {{ $t('app-info.privacy-and-security-advice') }}
    <a href="https://dashy.to/docs/management"
      target="_blank" rel="noopener noreferrer">{{
        $t('app-info.privacy-and-security-advice-link') }}</a>.
    <br>
    {{ $t('app-info.privacy-and-security-security-issue') }}
    <a href="https://github.com/Lissy93/dashy/blob/master/.github/SECURITY.md"
      target="_blank" rel="noopener noreferrer">{{
        $t('app-info.privacy-and-security-security-policy') }}</a>
    <!-- License -->
    <h3>{{ $t('app-info.license') }}</h3>
    {{ $t('app-info.license-under') }}
    <a href="https://github.com/Lissy93/dashy/blob/master/LICENSE"
      target="_blank" rel="noopener noreferrer">MIT X11</a>.
    Copyright
    <a href="https://aliciasykes.com"
      target="_blank" rel="noopener noreferrer">Alicia Sykes</a>
    &copy; {{ new Date().getFullYear() }}.<br>
    {{ $t('app-info.list-contributors') }}
    <a href="https://github.com/Lissy93/dashy/blob/master/docs/credits.md"
      target="_blank" rel="noopener noreferrer">{{
        $t('app-info.list-contributors-link') }}</a>.
    <!-- App Version -->
    <h3>{{ $t('app-info.version') }}</h3>
    <AppVersion class="app-version" :doUpdateCheck="false" />
  </div>
</template>

<script>
import AppVersion from '@/components/Configuration/AppVersion';

export default {
  name: 'AppInfo',
  emits: ['navigate-tab'],
  components: { AppVersion },
};
</script>

<style scoped lang="scss">
div.about-modal {
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  overflow-y: auto;
  padding: 0 1rem;
  height: 100%;
  p, ul li, a { font-size: 1rem; }
  h2.title { font-size: 1.8rem; text-align: center; margin: 1rem; }
  h3 {
    font-size: 1.2rem;
    margin: 0.75rem 0 0.2rem 0;
    color: var(--config-settings-color);
    opacity: 0.8;
  }
  a { color: var(--config-settings-color); }
  .app-version { text-align: left; }
}
</style>

<style lang="scss">
div.about-modal .app-version {
  text-align: left;
  display: flex;
  align-items: self-end;
  p {
      color: var(--config-settings-color);
      font-size: 1rem;
      margin: 0;
  }
}
</style>
