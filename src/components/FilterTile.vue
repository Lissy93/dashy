<template>
  <section>
    <form>
      <label for="filter-tiles">Search</label>
      <input
        id="filter-tiles"
        v-model="input"
        ref="filter"
        placeholder="Start typing to filter tiles..."
        v-on:input="userIsTypingSomething"
        @keydown.esc="clearFilterInput" />
        <i v-if="input.length > 0"
          class="el-icon-circle-close clear-search"
          title="Clear search"
          @click="clearFilterInput"></i>
      </form>
      <div class="options-container">
        <span class="options-label">Layout</span>
        <div class="display-options">
          <IconDeafault @click="updateDisplayLayout('default')"
            :class="`layout-icon ${displayLayout === 'default' ? 'selected' : ''}`" />
          <IconHorizontal class="layout-icon" @click="updateDisplayLayout('horizontal')"
            :class="`layout-icon ${displayLayout === 'horizontal' ? 'selected' : ''}`" />
          <IconVertical class="layout-icon" @click="updateDisplayLayout('vertical')"
            :class="`layout-icon ${displayLayout === 'vertical' ? 'selected' : ''}`" />
        </div>
      </div>
      <KeyboardShortcutInfo />
  </section>
</template>

<script>
import KeyboardShortcutInfo from '@/components/KeyboardShortcutInfo';

import IconDeafault from '@/assets/icons/layout-default.svg';
import IconHorizontal from '@/assets/icons/layout-horizontal.svg';
import IconVertical from '@/assets/icons/layout-vertical.svg';

export default {
  name: 'FilterTile',
  data() {
    return {
      input: '',
    };
  },
  props: {
    displayLayout: String,
  },
  components: {
    KeyboardShortcutInfo,
    IconDeafault,
    IconHorizontal,
    IconVertical,
  },
  methods: {
    userIsTypingSomething() {
      this.$emit('user-is-searchin', this.input);
    },
    clearFilterInput() {
      this.input = '';
      this.userIsTypingSomething();
      document.activeElement.blur();
    },
    updateDisplayLayout(layout) {
      this.$emit('change-display-layout', layout);
    },
  },
  mounted() {
    window.addEventListener('keyup', (event) => {
      const { key, keyCode } = event;
      if (/^[a-zA-Z]$/.test(key) && !document.activeElement.id) {
        try {
          this.input += key;
          this.$refs.filter.focus();
          this.userIsTypingSomething();
        } catch (e) {
          // Do nothing
        }
      } else if (keyCode === 27) {
        this.clearFilterInput();
      }
    });
  },
};
</script>

<style scoped lang="scss">

@import '../../src/styles/color-pallet.scss';

  section {
    display: flex;
    align-items: center;
    align-items: stretch;
    background: linear-gradient(0deg, $background 0%, $header-color 100%);
  }
  form {
    border-radius: 0 0 20px 0;
    padding: 0 0.2rem 0.2rem 0;
    background: $header-color;
    label {
        display: inline;
        color: $ascent;
        margin: 0.5rem;
        display: inline;
    }
    input {
      display: inline-block;
      width: 200px;
      padding: 0.5rem;
      margin: 0.5rem;
      outline: none;
      border: none;
      border-radius: 12px;
      background: $background;
      color: $ascent;
      &:focus {
        background: $bg-with-opacity;
      }
    }
    .clear-search {
      position: absolute;
      margin: 1em 0 0 -2em;
      color: $ascent;
      opacity: 0.5;
      border-radius: 50px;
      cursor: pointer;
      &:hover {
        opacity: 1;
        background: $header-color;
      }
    }
  }
  .options-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    flex: 1;
    padding: 0 1rem;
    border-radius: 20px 0 0;
    background: $background;

    span.options-label {
      font-size: 0.8rem;
      color: #5cabca;
      width: 5.5rem;
      text-align: left;
    }

    .display-options {
      color: $ascent;
      svg {
        path {
          fill: $ascent;
        }
        width: 1rem;
        height: 1rem;
        margin: 0.2rem;
        padding: 0.2rem;
        text-align: center;
        background: $background;
        border: 1px solid currentColor;
        border-radius: 4px;
        opacity: 0.8;
        cursor: pointer;
        &:hover, &.selected {
          background: $ascent;
          path { fill: $background; }
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    form {
      flex: 1;
      border-radius: 0;
      text-align: center;
      padding: 0.25rem 0;
    }
    .options-container {
      display: none;
    }
  }
</style>
