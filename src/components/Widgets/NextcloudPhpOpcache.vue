<template>
<div v-if="didLoadData" class="nextcloud-widget nextcloud-phpopcache-wrapper">
  <div class="sep">
    <!-- PHP opcache enabled and cache full -->
    <p v-tooltip="opcacheStartTimeTooltip()">
      <i class="fal fa-microchip"></i>
      <strong>PHP opcache</strong>&nbsp;
      <em v-if="opcache.opcache_enabled" class="oc-enabled">
        {{ tt('enabled') }}
      </em>
      <em v-else class="oc-disabled">{{ tt('disabled') }}</em>&nbsp;
      <strong v-if="opcache.cache_full" class="oc-full">
        <i class="far fa-siren-on"></i>{{ tt('cache-full') }}
      </strong>
    </p>
    <hr/>
    <!-- PHP opcache stats -->
    <div v-if="opcache.opcache_enabled">
      <!-- PHP opcache stats: hit/miss -->
      <p v-tooltip="opcacheStatsTooltip()">
        <i class="fal fa-bullseye-arrow"></i>
        <em v-html="formatNumber(opcache_stats.hits)"></em>&nbsp;
        <small>{{ tt('hits') }}</small>&nbsp;
        <em v-html="formatNumber(opcache_stats.misses)"></em>&nbsp;
        <small>{{ tt('misses') }}</small>&nbsp;
        <em v-html="formatPercent(opcache_stats.opcache_hit_rate, 3)"></em>&nbsp;
        <small>{{ tt('hit-rate') }}</small>
      </p>
      <hr/>
      <!-- PHP opcache stats: memory -->
      <p v-tooltip="opcacheMemoryUsageTooltip()">
        <i class="fal fa-memory"></i>
        <em v-html="formatPercent(opcache.memory_usage.used_memory_percentage, 1)"></em>&nbsp;
        <small>of</small>
        <em v-html="convertBytes(opcache.memory_usage.total_memory)"></em>&nbsp;
        <small>{{ tt('memory-used') }}</small>
      </p>
      <hr/>
      <!-- PHP opcache stats: interned strings -->
      <p v-tooltip="opcacheInternedStringsTooltip()">
        <i class="fal fa-puzzle-piece"></i>
        <em v-html="formatNumber(opcache.interned_strings_usage.number_of_strings, 1, true)"></em>
        &nbsp;<small>{{ tt('strings-use') }}</small>
        <em v-html="formatPercent(opcache.interned_strings_usage.used_memory_percentage)"></em>
        &nbsp;<small>{{ tt('of') }}</small>
        <em v-html="convertBytes(opcache.interned_strings_usage.total_memory)"></em>
      </p>
      <hr/>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import NextcloudMixin from '@/mixins/NextcloudMixin';

/**
 * NextcloudPhpOpcache widget - Shows statistics about PHP opcache performance
 * Used endpoints
 *  - serverinfo: requires Nextcloud admin user
 */
export default {
  mixins: [WidgetMixin, NextcloudMixin],
  components: {},
  data() {
    return {
      opcache: {
        opcache_enabled: null,
        full: null,
        opcache_statistics: {
          num_cached_scripts: null,
          num_cached_keys: null,
          max_cached_keys: null,
          hits: null,
          start_time: null,
          last_restart_time: null,
          misses: null,
          opcache_hit_rate: null,
        },
        memory_usage: {
          used_memory: null,
          free_memory: null,
          total_memory: null,
          wasted_memory: null,
          used_memory_percentage: null,
          current_wasted_percentage: null,
        },
        interned_strings_usage: {
          buffer_size: null,
          used_memory: null,
          total_memory: null,
          free_memory: null,
          number_of_strings: null,
          used_memory_percentage: null,
        },
      },
    };
  },
  computed: {
    didLoadData() {
      return typeof (this?.opcache?.opcache_enabled) === 'boolean';
    },
    // shortcuts to data members
    opcache_stats() {
      return this.opcache.opcache_statistics;
    },
    opcache_interned() {
      return this.opcache.interned_strings_usage;
    },
  },
  methods: {
    allowedStatuscodes() {
      return [200];
    },
    fetchData() {
      if (!this.hasValidCredentials()) return;
      this.makeRequest(this.endpoint('serverinfo'), this.headers)
        .then(this.processServerInfo)
        .finally(() => this.finishLoading());
    },
    processServerInfo(serverData) {
      const data = this.validateResponse(serverData);
      this.opcache = data.server?.php?.opcache;
      if (!this.opcache) return;
      this.updateOpcacheMemory();
      this.updateOpcacheInterned();
    },
    updateOpcacheMemory() {
      this.opcache_stats.opcache_hit_rate = parseFloat(
        this.opcache_stats.opcache_hit_rate,
      ).toFixed(3);
      this.opcache.memory_usage.total_memory = (
        this.opcache.memory_usage.used_memory + this.opcache.memory_usage.free_memory
      );
      this.opcache.memory_usage.used_memory_percentage = parseFloat(
        (this.opcache.memory_usage.used_memory / this.opcache.memory_usage.total_memory) * 100,
      ).toFixed(1);
    },
    updateOpcacheInterned() {
      this.opcache_interned.total_memory = (
        this.opcache_interned.used_memory + this.opcache_interned.free_memory
      );
      this.opcache_interned.used_memory_percentage = parseFloat(
        (this.opcache_interned.used_memory / this.opcache_interned.total_memory) * 100,
      ).toFixed(5);
    },
    /* Tooltip generators */
    opcacheStartTimeTooltip() {
      let content = `${this.tt('started')} `
                  + `${new Date(this.opcache_stats.start_time * 1000).toLocaleString()}`;
      if (this.opcache_stats.last_restart_time) {
        content = content.concat(
          `<br><br>${this.tt('last-restart')} `
          + `${new Date(this.opcache_stats.last_restart_time * 1000).toLocaleString()}`,
        );
      }
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    opcacheStatsTooltip() {
      const content = `${parseFloat(this.opcache_stats.hits).toLocaleString()} ${this.tt('hits')}<br>`
        + `${parseFloat(this.opcache_stats.misses).toLocaleString()} ${this.tt('misses')}<br><br>`
        + `${parseFloat(this.opcache_stats.num_cached_scripts).toLocaleString()} ${this.tt('scripts')}<br>`
        + `${parseFloat(this.opcache_stats.num_cached_keys).toLocaleString()} ${this.tt('keys')}<br>`
        + `${parseFloat(this.opcache_stats.max_cached_keys).toLocaleString()} ${this.tt('max-keys')}<br>`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    opcacheMemoryUsageTooltip() {
      const content = `PHP opcache ${this.tt('memory-utilisation')}<br><br>`
        + `${this.convertBytes(this.opcache.memory_usage.total_memory)} ${this.tt('total')}<br>`
        + `${this.convertBytes(this.opcache.memory_usage.used_memory)} ${this.tt('used')}<br>`
        + `${this.convertBytes(this.opcache.memory_usage.free_memory)} ${this.tt('free')}<br><br>`
        + `${this.convertBytes(this.opcache.memory_usage.wasted_memory)} (`
        + `${parseFloat(this.opcache.memory_usage.current_wasted_percentage).toFixed(1)}%) ${this.tt('wasted')}`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    opcacheInternedStringsTooltip() {
      const content = 'PHP opcache interned strings<br><br>'
        + `${this.convertBytes(this.opcache_interned.buffer_size)} ${this.tt('total')} ${this.tt('memory')}<br>`
        + `${this.convertBytes(this.opcache_interned.used_memory)} ${this.tt('used')} ${this.tt('memory')}<br>`
        + `${this.convertBytes(this.opcache_interned.free_memory)} ${this.tt('free')} ${this.tt('memory')}<br><br>`
        + `${parseFloat(this.opcache_interned.number_of_strings).toLocaleString()}`
        + ' strings';
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
  },
  created() {
    this.overrideUpdateInterval = 60;
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/widgets/nextcloud-shared.scss';
.nextcloud-phpopcache-wrapper {
  .oc-enabled {
    color: var(--success);
  }
  .oc-disabled {
    color: var(--neutral);
  }
  .oc-full {
    color: var(--danger);
  }
}
</style>
