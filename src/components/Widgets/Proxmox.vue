<template>
  <div class="proxmox-list">
    <div class="proxmox-title" v-if="title">
      <a v-if="titleAsLink" class="proxmox-link" :href="clusterUrl" target="_blank">
        {{ title }}
      </a>
      <span v-if="!titleAsLink">{{ title }}</span>
    </div>
    <div v-for="(item, key) in data" :key="key" class="proxmox-row">
      <div v-if="item.node" class="proxmox-cell">{{ item.node }}</div>
      <div v-if="item.name" class="proxmox-cell">{{ item.name }}</div>
      <div class="proxmox-cell proxmox-status"><span :class="item.status"></span></div>
    </div>
    <div class="proxmox-footer" v-if="footer">
      <a v-if="footerAsLink" class="proxmox-link" :href="clusterUrl" target="_blank">
        {{ footer }}
      </a>
      <span v-if="!footerAsLink">{{ title }}</span>
    </div>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      data: [],
    };
  },
  computed: {
    clusterUrl() {
      if (!this.options.cluster_url) this.error('The cluster URL is required.');
      return this.options.cluster_url || '';
    },
    userName() {
      if (!this.options.user_name) this.error('The user name is required.');
      return this.options.user_name || '';
    },
    tokenName() {
      if (!this.options.token_name) this.error('The token name is required.');
      return this.options.token_name || '';
    },
    tokenUuid() {
      if (!this.options.token_uuid) this.error('The token uuid is required.');
      return this.options.token_uuid || '';
    },
    node() {
      return this.options.node || '';
    },
    nodeData() {
      return this.options.node_data || false;
    },
    hideTemplates() {
      return this.options.hide_templates || false;
    },
    title() {
      return this.options.title || '';
    },
    titleAsLink() {
      return this.options.title_as_link || false;
    },
    footer() {
      return this.options.footer || '';
    },
    footerAsLink() {
      return this.options.footer_as_link || false;
    },
    endpoint() {
      if (!this.node) {
        return `${this.clusterUrl}/api2/json/nodes`;
      }
      if (this.nodeData) {
        return `${this.clusterUrl}/api2/json/nodes/${this.node}/${this.nodeData}`;
      }
      return '';
    },
    authHeaders() {
      if (this.userName && this.tokenName && this.tokenUuid) {
        return { Authorization: `PVEAPIToken=${this.userName}!${this.tokenName}=${this.tokenUuid}` };
      }
      return false;
    },
  },
  methods: {
    fetchData() {
      const auth = this.authHeaders;
      if (auth) {
        this.startLoading();
        this.makeRequest(this.endpoint, auth).then(this.processData);
      }
    },
    processData(data) {
      this.data = data.data.sort((a, b) => Number(a.vmid) > Number(b.vmid));
      if (this.hideTemplates) {
        this.data = this.data.filter(item => item.template !== 1);
      }
      this.finishLoading();
    },
  },
};

</script>

<style scoped lang="scss">

.proxmox-list {
  .proxmox-title, .proxmox-footer {
    outline: 2px solid transparent;
    border: 1px solid var(--outline-color);
    border-radius: var(--curve-factor);
    box-shadow: var(--item-shadow);
    color: var(--item-text-color);
    margin: .5rem;
    padding: 0.3rem;
    background: var(--item-background);
    text-align: center;

    a {
      text-decoration: none;
      color: var(--item-text-color);
    }
  }
  .proxmox-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--widget-text-color);
    font-size: 1.1rem;
    .proxmox-cell {
      display: inline-block;
    }
    .proxmox-status{
      .online, .running {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background-color: var(--success);
        display: block;
      }
    }
    .proxmox-link {
      display: inline-block;
      padding: 0.2rem;
      margin: 0.1rem 0.2rem;

    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
