<template>
  <div
    class="options-panel"
    role="dialog"
    aria-labelledby="options-panel-title"
  >
    <header class="panel-header">
      <h3 id="options-panel-title">{{ $t('settings.options-title') }}</h3>
      <button
        type="button"
        class="close-btn"
        @click="close"
        v-tooltip="$t('settings.hide')"
        :aria-label="$t('settings.hide')"
      >
        <IconClose />
      </button>
    </header>

    <section v-if="canEdit" class="section actions-row">
      <button
        type="button"
        class="action-btn"
        :class="{ 'is-primary': !isEditMode }"
        @click="startEdit"
        :disabled="isEditMode"
        v-tooltip="editTooltip"
      >
        <IconEdit />
        <span>{{ $t('interactive-editor.menu.edit-mode-name') }}</span>
      </button>
      <button
        type="button"
        class="action-btn"
        @click="openConfig"
        v-tooltip="$t('settings.config-launcher-tooltip')"
      >
        <IconConfig />
        <span>{{ $t('settings.config-launcher-label') }}</span>
      </button>
    </section>

    <section v-else class="section language-row">
      <LanguageSwitcher miniView />
    </section>

    <section class="section theme-section">
      <ThemeSelector />
    </section>

    <section class="section grid-2">
      <LayoutSelector />
      <ItemSizeSelector />
    </section>

    <section class="section view-switch-row">
      <router-link
        v-for="v in views"
        :key="v.id"
        :to="pathFor(v.id)"
        class="view-btn"
        :class="{ 'is-active': currentView === v.id }"
        v-tooltip="v.label"
        @click="close"
      >
        <component :is="v.icon" />
        <span>{{ v.label }}</span>
      </router-link>
    </section>

    <section v-if="userState !== 0" class="section auth-row">
      <AuthButtons :userType="userState" />
    </section>
  </div>
</template>

<script>
import ThemeSelector from '@/components/Settings/ThemeSelector';
import LayoutSelector from '@/components/Settings/LayoutSelector';
import ItemSizeSelector from '@/components/Settings/ItemSizeSelector';
import LanguageSwitcher from '@/components/Settings/LanguageSwitcher';
import AuthButtons from '@/components/Settings/AuthButtons';
import Keys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/config/defaults';
import { getUserState } from '@/utils/auth/Auth';
import { makeRoutePath, resolveRouteIntent, viewFromPath } from '@/utils/config/ConfigHelpers';
import IconClose from '@/assets/interface-icons/config-close.svg';
import IconEdit from '@/assets/interface-icons/interactive-editor-edit-mode.svg';
import IconConfig from '@/assets/interface-icons/config-editor.svg';
import IconHome from '@/assets/interface-icons/application-home.svg';
import IconMinimalView from '@/assets/interface-icons/application-minimal.svg';
import IconWorkspaceView from '@/assets/interface-icons/open-workspace.svg';

export default {
  name: 'OptionsPanel',
  components: {
    ThemeSelector,
    LayoutSelector,
    ItemSizeSelector,
    LanguageSwitcher,
    AuthButtons,
    IconClose,
    IconEdit,
    IconConfig,
    IconHome,
    IconMinimalView,
    IconWorkspaceView,
  },
  emits: ['close'],
  computed: {
    isEditMode() { return this.$store.state.editMode; },
    canEdit() { return this.$store.getters.permissions.allowViewConfig; },
    userState() { return getUserState(); },
    editTooltip() {
      const key = this.isEditMode ? 'edit-mode-subtitle' : 'start-editing-tooltip';
      return this.$t(`interactive-editor.menu.${key}`);
    },
    currentView() { return viewFromPath(this.$route?.path); },
    views() {
      return [
        { id: 'home', label: this.$t('alternate-views.default'), icon: 'IconHome' },
        { id: 'minimal', label: this.$t('alternate-views.minimal'), icon: 'IconMinimalView' },
        { id: 'workspace', label: this.$t('alternate-views.workspace'), icon: 'IconWorkspaceView' },
      ];
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKey);
  },
  methods: {
    close() { this.$emit('close'); },
    onKey(e) { if (e.key === 'Escape') this.close(); },
    openConfig() {
      this.$modal.show(modalNames.CONF_EDITOR);
      this.$store.commit(Keys.SET_MODAL_OPEN, true);
      this.close();
    },
    startEdit() {
      if (this.isEditMode) return;
      this.$store.commit(Keys.SET_EDIT_MODE, true);
      this.close();
    },
    pathFor(view) {
      const { pageId, sectionSlug } = resolveRouteIntent(this.$route, this.$store);
      return makeRoutePath(view, pageId, sectionSlug);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

.options-panel {
  position: absolute;
  top: 100%;
  right: 0.5rem;
  z-index: 5;
  width: 22rem;
  max-width: calc(100vw - 1rem);
  padding: 1rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border: 1px solid var(--config-settings-color);
  border-radius: var(--curve-factor);
  box-shadow: var(--settings-container-shadow);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;

  @include phone {
    left: 0.5rem;
    width: auto;
  }

  button, a { transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease; }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--config-settings-color);

  h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--config-settings-color);
  }

  .close-btn {
    width: 1.6rem;
    height: 1.6rem;
    padding: 0.2rem;
    background: transparent;
    border: none;
    border-radius: var(--curve-factor-small);
    color: var(--config-settings-color);
    cursor: pointer;
    opacity: var(--dimming-factor);

    svg { width: 100%; height: 100%; fill: currentColor; }

    &:hover, &:focus-visible {
      opacity: 1;
      background: var(--config-settings-color);
      color: var(--config-settings-background);
      outline: none;
    }
  }
}

.section {
  display: flex;
  gap: 0.6rem;

  &.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
}

.actions-row .action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.55rem 0.6rem;
  background: var(--background);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: var(--curve-factor);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;

  svg { width: 1rem; height: 1rem; fill: currentColor; flex-shrink: 0; }

  &:hover:not(:disabled), &:focus-visible {
    background: var(--primary);
    color: var(--background);
    outline: none;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.view-switch-row {
  padding: 0.25rem;
  background: var(--background);
  border: 1px solid var(--primary);
  border-radius: var(--curve-factor);
  gap: 0.25rem;

  .view-btn {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    padding: 0.45rem 0.25rem;
    color: var(--primary);
    text-decoration: none;
    border-radius: var(--curve-factor-small);
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;

    svg { width: 1rem; height: 1rem; fill: currentColor; }

    &:hover, &:focus-visible {
      background: color-mix(in srgb, var(--primary) 15%, transparent);
      outline: none;
    }

    &.is-active {
      background: var(--primary);
      color: var(--background);
    }
  }
}

.auth-row {
  padding-top: 0.75rem;
  border-top: 1px dashed var(--config-settings-color);
}
</style>
