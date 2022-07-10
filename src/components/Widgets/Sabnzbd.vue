<template>
<div class="sabznbd">
  <!-- Sabznbd Header -->
  <div class="intro">
    <p class="download">{{ download_speed }}</p>
    <em :class="`fas fa-${status}`"></em>
  </div>
  <!-- Sabnzbd Details, If hideDetails set False -->
  <div class="details" v-if="sabnzbdDetails.length > 0">
    <div class="info-wrap" v-for="(section, indx) in sabnzbdDetails" :key="indx">
      <p class="info-line" v-for="sabznbd in section" :key="sabznbd.label">
          <span class="lbl">{{sabznbd.label}}</span>
          <span class="val">{{ sabznbd.value }}</span>
        </p>
    </div>
  </div>
  <!-- Queue Details, If hideQueue set False -->
  <div class="details" v-if="showQueue && sabnzbdQueue.length > 0">
    <div class="info-wrap">
      <p class="info-line" v-for="sabznbd in sabnzbdQueue" :key="sabznbd.label">
        <em :class="`fas fa-${sabznbd.status}`"></em>
        <span class="lbl">{{ sabznbd.filename }}</span>
        <span class="lbl">{{ sabznbd.percentage }}%</span>
      </p>
    </div>
  </div>
  <!-- Show/ hide toggle button for Queue-->
  <p class="more-details-btn" @click="toggleQueue" v-if="sabnzbdQueue.length > 0">
    {{ showQueue ? "Hide Queue" : "Show Queue" }}
  </p>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      download_speed: null,
      status: null,
      sabnzbdDetails: [],
      showQueue: false,
      sabnzbdQueue: [],
    };
  },
  mounted() {
    this.checkProps();
  },
  computed: {
    endpoint() {
      const { apiKey, sabnzbdUrl } = this.options;
      return `${sabnzbdUrl}/sabnzbd/api?output=json&apikey=${apiKey}&mode=queue`;
    },
  },
  methods: {
    /* Reads the kbpersec value of the server status, converts to mb/s if over 1024 kb. */
    processKBperSec(kbpersec) {
      if (kbpersec <= 1024) {
        return `${Number(kbpersec).toFixed(0)} kb/s`;
      } else {
        return `${Number(kbpersec / 1024).toFixed(1)} mb/s`;
      }
    },
    /* Reads the bool status output of the server status to append the correct icon */
    processPaused(paused) {
      if (paused === true) {
        return 'pause';
      } else {
        return 'play';
      }
    },
    /* Reads the string status output of the queue list to append the correct icon */
    processPausedStr(paused) {
      if (['Queued', 'Paused'].includes(paused)) {
        return 'pause';
      } else {
        return 'play';
      }
    },
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Fetches the Sabnzbd status, and processes results */
    processData(data) {
      this.download_speed = this.processKBperSec(data.queue.kbpersec);
      this.status = this.processPaused(data.queue.paused);
      if (!this.options.hideDetails) {
        this.makeSabnzbdataData(data);
      }
      if (!this.options.hideQueue) {
        this.makeSabnzbdataQueueData(data);
      }
    },
    /* If showing Details, then Creates the object required */
    makeSabnzbdataData(data) {
      this.sabnzbdDetails = [
        [
          { label: 'Time Left', value: data.queue.timeleft },
          { label: 'Queue', value: data.queue.noofslots },

        ],
        [
          { label: 'Status', value: data.queue.status },
          { label: 'Size Left', value: data.queue.sizeleft },
        ],
      ];
    },
    /* If showing Queue, Creates list of downloads that are in the sabnzbd list */
    makeSabnzbdataQueueData(data) {
      this.sabnzbdQueue = [];
      let i = 0;
      for (i; i < data.queue.slots.length; i += 1) {
        this.sabnzbdQueue.push({
          status: this.processPausedStr(data.queue.slots[i].status),
          filename: data.queue.slots[i].filename.substring(0, 25),
          percentage: data.queue.slots[i].percentage,
        });
      }
    },
    /* Show/ hide Queue list */
    toggleQueue() {
      this.showQueue = !this.showQueue;
    },
    /* Validate input props, and print warning if incorrect */
    checkProps() {
      const ops = this.options;
      if (!ops.sabnzbdUrl) this.error('Missing URL for Sabnzbd. Configure sabnzbdUrl in config file.');
      if (!ops.apiKey) this.error('Missing API key for Sabnzbd. Configure apiKey in config file.');
    },
  },
};
</script>

<style scoped lang="scss">
.loader {
  margin: 0 auto;
  display: flex;
}
  p {
    color: var(--widget-text-color);
  }

.sabznbd {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  .intro {
    grid-column-start: span 2;
    display: flex;
    justify-content: space-around;
    .fas {
      font-size: 2rem;
      color: var(--widget-text-color);
      margin: 2;
    }
    .download {
      font-size: 2rem;
      margin: 0;
    }
  }
  .more-details-btn {
    grid-column-start: span 2;
    cursor: pointer;
    font-size: 0.9rem;
    text-align: center;
    width: fit-content;
    margin: 0.25rem auto;
    padding: 0.1rem 0.25rem;
    border: 1px solid transparent;
    opacity: var(--dimming-factor);
    border-radius: var(--curve-factor);
    &:hover {
      border: 1px solid var(--widget-text-color);
    }
    &:focus, &:active {
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
  }
  // More sabznbd details table
  .details {
    grid-column-start: span 2;
    display: flex;
    .fas {
      font-size: 1rem;
      color: var(--widget-text-color);
      margin: 2;
    }
    .info-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      opacity: var(--dimming-factor);
      p.info-line {
        display: flex;
        justify-content: space-between;
        margin: 0.1rem 0.5rem;
        padding: 0.1rem 0;
        color: var(--widget-text-color);
        &:not(:last-child) {
          border-bottom: 1px dashed var(--widget-text-color);
        }
        span.lbl {
          text-transform: capitalize;
        }
      }
    }
  }
}

</style>
