<template>
    <header v-if="componentVisible">
      <PageTitle
        v-if="titleVisible"
        :title="pageInfo.title"
        :description="pageInfo.description"
        :logo="pageInfo.logo"
      />
      <Nav v-if="navVisible" :links="pageInfo.navLinks" class="nav" />
      <VoiceRecognition @voice-command="handleVoiceCommand" />
    </header>
</template>

<script>
import PageTitle from '@/components/PageStrcture/PageTitle.vue';
import Nav from '@/components/PageStrcture/Nav.vue';
import VoiceRecognition from '@/components/VoiceRecognition.vue';
import { shouldBeVisible } from '@/utils/SectionHelpers';

export default {
  name: 'Header',
  components: {
    PageTitle,
    Nav,
    VoiceRecognition,
  },
  props: {
    pageInfo: Object,
  },
  computed: {
    componentVisible() {
      return shouldBeVisible(this.$route.name);
    },
    visibleComponents() {
      return this.$store.getters.visibleComponents;
    },
    titleVisible() {
      return this.visibleComponents.pageTitle;
    },
    navVisible() {
      return this.visibleComponents.navigation;
    },
  },
  methods: {
    handleVoiceCommand(command) {
      // Map voice commands to actions
      if (command.includes('open settings')) {
        this.$router.push({ name: 'settings' });
      } else if (command.includes('search for')) {
        const query = command.replace('search for', '').trim();
        this.$emit('search', query);
      }
      // Add more command mappings as needed
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  header {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    background: var(--background-darker);
    align-items: center;
    align-content: flex-start;
    @include phone {
      flex-direction: column-reverse;
    }
  }
</style>
