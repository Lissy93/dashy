<template>
  <modal :name="modalName" :resizable="true" width="55%" height="80%" classes="dashy-modal">
    <AppInfo />
  </modal>
</template>

<script>
import AppInfo from '@/components/Configuration/AppInfo';
import { modalNames } from '@/utils/defaults';

export default {
  name: 'AppInfoModal',
  components: { AppInfo },
  data: () => ({ modalName: modalNames.ABOUT_APP }),
};
</script>
