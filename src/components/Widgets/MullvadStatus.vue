<template>
<div class="mullvad-wrapper" v-if="mullvadInfo">
  <p v-if="mullvadInfo.isMullvad"  class="status connected"><span>✔</span> Connected</p>
  <p v-else class="status not-connected"><span>✘</span> Not Connected</p>
  <div class="connection-info">
    <p><span class="lbl">IP</span><span class="val">{{ mullvadInfo.ip }}</span></p>
    <p v-if="mullvadInfo.host">
      <span class="lbl">Host</span><span class="val">{{ mullvadInfo.host }}</span>
    </p>
    <p><span class="lbl">Owner</span><span class="val">{{ mullvadInfo.ownedBy }}</span></p>
    <p v-if="mullvadInfo.serverType">
      <span class="lbl">Type</span><span class="val">{{ mullvadInfo.serverType }}</span>
    </p>
    <p><span class="lbl">Location</span><span class="val">{{ mullvadInfo.location }}</span></p>
    <p>
      <span class="lbl">Blacklisted?</span>
      <span class="val">{{ mullvadInfo.isBlacklisted ? '✘ Yes' : '✔ No' }}</span>
    </p>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  computed: {
    endpoint() {
      return widgetApiEndpoints.mullvad;
    },
  },
  data() {
    return {
      mullvadInfo: null,
    };
  },
  methods: {
    /* Make GET request to Mullvad API endpoint */
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(mullvad) {
      this.mullvadInfo = {
        ip: mullvad.ip,
        isMullvad: mullvad.mullvad_exit_ip,
        host: mullvad.mullvad_exit_ip_hostname,
        serverType: mullvad.mullvad_server_type,
        ownedBy: mullvad.organization,
        location: `${mullvad.city}, ${mullvad.country}`,
        isBlacklisted: mullvad.blacklisted.blacklisted,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.mullvad-wrapper {
  color: var(--widget-text-color);
  cursor: default;

  .status {
    display: flex;
    max-width: 250px;
    font-size: 1.5rem;
    font-weight: bold;
    align-items: center;
    margin: 0.25rem auto;
    justify-content: space-evenly;
    span {
      font-size: 1.5rem;
      border-radius: 1.5rem;
      padding: 0.3rem 0.7rem;
      border: 1px solid;
      color: var(--background);
    }
    &.not-connected {
      color: var(--danger);
      span { background: var(--danger); }
    }
    &.connected {
      color: var(--success);
      span { background: var(--success); }
    }
  }
  .connection-info {
    p {
      display: flex;
      max-width: 250px;
      font-size: 0.9rem;
      padding: 0.2rem;
      margin: 0.2rem auto;
      justify-content: space-between;
      opacity: var(--dimming-factor);
      span {
        &.lbl {
          font-weight: bold;
        }
        &.val {
          font-family: monospace;
        }
      }
      &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
    }
  }
}

</style>
