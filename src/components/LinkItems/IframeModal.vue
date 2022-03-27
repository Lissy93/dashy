<template>
  <modal :name="name" :resizable="true" width="80%" height="80%" @closed="modalClosed()"
    classes="dashy-modal">
    <div slot="top-right" @click="hide()">Close</div>
    <a @click="hide()" class="close-button" title="Close">x</a>
    <iframe v-if="url" :src="url" @keydown.esc="close" class="frame" allow="fullscreen" />
    <div v-else class="no-url">No URL Specified</div>
  </modal>
</template>

<script>
import Keys from '@/utils/StoreMutations';

export default {
  name: 'IframeModal',
  props: {
    name: String,
  },
  data: () => ({
    url: '#',
  }),
  methods: {
    show(url) {
      this.url = url;
      this.$modal.show(this.name);
      this.$store.commit(Keys.SET_MODAL_OPEN, true);
    },
    hide() {
      this.$modal.hide(this.name);
    },
    modalClosed() {
      this.$store.commit(Keys.SET_MODAL_OPEN, false);
    },
  },
};
</script>

<style lang="scss">

.frame {
  width: 100%;
  height: 100%;
  border: none;
}

.no-url {
  margin: 4rem auto;
  width: fit-content;
  font-size: 2rem;
  padding: 0.5rem;
  border: 1px dashed #ff0000;
  border-radius: 3px;
  background: #f4f2f2;
}

.close-button {
  position: absolute;
  right: 0;
  padding: 0.5rem;
  border: 0;
  border-radius: 0 0 0 10px;
  background: var(--primary);
  color: var(--background);
  border-left: 1px solid var(--primary);
  border-bottom: 1px solid var(--primary);
  cursor: pointer;
  &:hover {
    background: var(--background);
    color: var(--primary);
  }

}

</style>
