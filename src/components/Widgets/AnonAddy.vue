<template>
<div class="anonaddy-wrapper">
  <!-- Account Info -->
  <div class="account-info" v-if="meta && !hideMeta">
    <PercentageChart title="Mail Stats"
      :values="[
      { label: 'Forwarded', size: meta.forwardCount, color: '#20e253' },
      { label: 'Blocked', size: meta.blockedCount, color: '#f80363' },
      { label: 'Replies', size: meta.repliesCount, color: '#04e4f4' },
      { label: 'Sent', size: meta.sentCount, color: '#f6f000' },
      ]" />
    <div class="meta-item">
      <span class="lbl">Bandwidth</span>
      <span class="val">
        {{ meta.bandwidth | formatBytes }} out of
        {{ meta.bandwidthLimit !== 100000000 ? (formatBytes(meta.bandwidthLimit)) : '∞'}}
      </span>
    </div>
    <div class="meta-item">
      <span class="lbl">Active Domains</span>
      <span class="val">{{ meta.activeDomains }} out of {{ meta.activeDomainsLimit }}</span>
    </div>
    <div class="meta-item">
      <span class="lbl">Shared Domains</span>
      <span class="val">{{ meta.sharedDomains }} out of {{ meta.sharedDomainsLimit || '∞'}}</span>
    </div>
    <div class="meta-item">
      <span class="lbl">Usernames</span>
      <span class="val">{{ meta.usernamesCount }} out of {{ meta.usernamesLimit || '∞'}}</span>
    </div>
  </div>
  <!-- Email List -->
  <div class="email-list" v-if="aliases && !hideAliases">
    <div class="email-row" v-for="alias in aliases" :key="alias.id">
      <!-- Email address and status -->
      <div class="row-1">
        <Toggle v-if="!disableControls" @change="toggleAlias"
          :defaultState="alias.active" :id="alias.id" :hideLabels="true" />
        <span v-if="disableControls"
          :class="`status ${alias.active ? 'active' : 'inactive'}`">●</span>
        <div class="address-copy" @click="copyToClipboard(alias.fullEmail)" title="Click to Copy">
          <span class="txt-email">{{ alias.email }}</span>
          <span class="txt-at">@</span>
          <span class="txt-domain">{{ alias.domain }}</span>
        </div>
        <ClipboardIcon class="copy-btn"
          @click="copyToClipboard(alias.fullEmail)"
          v-tooltip="tooltip('Copy alias to clipboard')"
        />
      </div>
      <!-- Optional description field -->
      <div class="row-2" v-if="alias.description">
        <span class="description">{{ alias.description }}</span>
      </div>
      <!-- Num emails sent + received -->
      <div class="row-3">
        <span class="lbl">Forwarded</span>
        <span class="val">{{ alias.forwardCount }}</span>
        <span class="lbl">Blocked</span>
        <span class="val">{{ alias.blockedCount }}</span>
        <span class="lbl">Replied</span>
        <span class="val">{{ alias.repliesCount }}</span>
        <span class="lbl">Sent</span>
        <span class="val">{{ alias.sentCount }}</span>
      </div>
      <!-- Date created / updated -->
      <div class="row-4">
        <span class="lbl">Created</span>
        <span class="val as-date">{{ alias.createdAt | formatDate }}</span>
        <span class="val as-time-ago">{{ alias.createdAt | formatTimeAgo }}</span>
      </div>
    </div>
  </div>
  <!-- Pagination Page Numbers -->
  <div class="pagination" v-if="numPages && !hideAliases">
    <span class="page-num first" @click="goToFirst()">«</span>
    <span class="page-num" v-if="paginationRange[0] !== 1" @click="goToPrevious()">...</span>
    <span
      v-for="pageNum in paginationRange" :key="pageNum"
      @click="goToPage(pageNum)"
      :class="`page-num ${pageNum === currentPage ? 'selected' : ''}`"
    >{{ pageNum }}</span>
    <span class="page-num" @click="goToNext()"
      v-if="paginationRange[paginationRange.length - 1] < numPages">...</span>
    <span class="page-num last" @click="goToLast()">»</span>
    <p class="page-status">Page {{ currentPage }} of {{ numPages }}</p>
  </div>
</div>
</template>

<script>
import Toggle from '@/components/FormElements/Toggle';
import PercentageChart from '@/components/Charts/PercentageChart';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { timestampToDate, getTimeAgo, convertBytes } from '@/utils/MiscHelpers';
import ClipboardIcon from '@/assets/interface-icons/open-clipboard.svg';

export default {
  mixins: [WidgetMixin],
  components: {
    Toggle,
    PercentageChart,
    ClipboardIcon,
  },
  data() {
    return {
      aliases: null,
      meta: null,
      numPages: null,
      currentPage: 1,
    };
  },
  computed: {
    hostname() {
      return this.options.hostname || widgetApiEndpoints.anonAddy;
    },
    apiVersion() {
      return this.options.apiVersion || 'v1';
    },
    limit() {
      return this.options.limit || '10';
    },
    sortBy() {
      return this.options.sortBy || 'updated_at';
    },
    searchTerm() {
      return this.options.searchTerm || '';
    },
    disableControls() {
      return this.options.disableControls || false;
    },
    apiKey() {
      if (!this.options.apiKey) this.error('An apiKey is required');
      return this.options.apiKey;
    },
    hideMeta() {
      return this.options.hideMeta;
    },
    hideAliases() {
      return this.options.hideAliases;
    },
    endpoint() {
      return `${this.hostname}/api/${this.apiVersion}/aliases?`
        + `sort=${this.sortBy}&filter[search]=${this.searchTerm}`
        + `&page[number]=${this.currentPage}&page[size]=${this.limit}`;
    },
    aliasCountEndpoint() {
      return `${this.hostname}/api/${this.apiVersion}/aliases?filter[search]=${this.searchTerm}`;
    },
    accountInfoEndpoint() {
      return `${this.hostname}/api/${this.apiVersion}/account-details`;
    },
    headers() {
      return {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${this.apiKey}`,
      };
    },
    paginationRange() {
      const arrOfRange = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);
      const maxNumbers = this.numPages > 10 ? 10 : this.numPages;
      if (this.currentPage > maxNumbers) {
        return arrOfRange(this.currentPage - maxNumbers, this.currentPage);
      }
      return arrOfRange(1, maxNumbers);
    },
  },
  filters: {
    formatDate(timestamp) {
      return timestampToDate(timestamp);
    },
    formatTimeAgo(timestamp) {
      return getTimeAgo(timestamp);
    },
    formatBytes(bytes) {
      return convertBytes(bytes);
    },
  },
  created() {
    this.fetchAccountInfo();
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      this.$toasted.show('Email address copied to clipboard');
    },
    fetchData() {
      this.makeRequest(this.endpoint, this.headers).then(this.processData);
    },
    fetchAccountInfo() {
      // Get account info
      this.makeRequest(this.accountInfoEndpoint, this.headers).then(this.processAccountInfo);
      // Get number of pages of results (in the most inefficient way possible...)
      this.makeRequest(this.aliasCountEndpoint, this.headers).then((response) => {
        this.numPages = Math.floor(response.data.length / this.limit);
      });
    },
    processData(data) {
      // this.numPages = 14; // data.meta.to;
      this.currentPage = data.meta.current_page;
      const aliases = [];
      data.data.forEach((alias) => {
        aliases.push({
          id: alias.id,
          active: alias.active,
          domain: alias.domain,
          email: alias.local_part,
          recipients: alias.recipients,
          description: alias.description,
          forwardCount: alias.emails_forwarded,
          blockedCount: alias.emails_blocked,
          repliesCount: alias.emails_replied,
          sentCount: alias.emails_sent,
          createdAt: alias.created_at,
          updatedAt: alias.updated_at,
          deletedAt: alias.deleted_at,
          fullEmail: alias.email,
        });
      });
      this.aliases = aliases;
    },
    processAccountInfo(data) {
      const res = data.data;
      this.meta = {
        name: data.username || res.from_name,
        bandwidth: res.bandwidth,
        bandwidthLimit: res.bandwidth_limit || 100000000,
        activeDomains: res.active_domain_count,
        activeDomainsLimit: res.active_domain_limit,
        sharedDomains: res.active_shared_domain_alias_count,
        sharedDomainsLimit: res.active_shared_domain_alias_limit,
        usernamesCount: res.username_count,
        usernamesLimit: res.username_limit,
        forwardCount: res.total_emails_forwarded,
        blockedCount: res.total_emails_blocked,
        repliesCount: res.total_emails_replied,
        sentCount: res.total_emails_sent,
      };
    },
    toggleAlias(state, id) {
      if (this.disableControls) {
        this.$toasted.show('Error, controls disabled', { className: 'toast-error' });
      } else {
        const method = state ? 'POST' : 'DELETE';
        const path = state ? 'active-aliases' : `active-aliases/${id}`;
        const body = state ? { id } : {};
        const endpoint = `${this.hostname}/api/${this.apiVersion}/${path}`;
        this.makeRequest(endpoint, this.headers, method, body).then(() => {
          const successMsg = `Alias successfully ${state ? 'enabled' : 'disabled'}`;
          this.$toasted.show(successMsg, { className: 'toast-success' });
        });
      }
    },
    goToPage(page) {
      this.progress.start();
      this.currentPage = page;
      this.fetchData();
    },
    goToFirst() {
      this.goToPage(1);
    },
    goToLast() {
      this.goToPage(this.numPages);
    },
    goToPrevious() {
      if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
    },
    goToNext() {
      if (this.currentPage < this.numPages) this.goToPage(this.currentPage + 1);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';

.anonaddy-wrapper {
  .account-info {
    background: var(--widget-accent-color);
    border-radius: var(--curve-factor);
    padding: 0.5rem;
    .meta-item span {
      font-size: 0.8rem;
      margin: 0.25rem 0;
      opacity: var(--dimming-factor);
      color: var(--widget-text-color);
      font-family: var(--font-monospace);
      &.lbl {
        font-weight: bold;
        margin-right: 0.25rem;
        &::after { content: ':'; }
      }
    }
    p.username {
      margin: 0.25rem 0;
    }
  }
  .email-list {
    span.lbl {
      &::after { content: ':'; }
    }
    span.val {
      font-family: var(--font-monospace);
      margin: 0 0.5rem 0 0.25rem;
    }
    .email-row {
      color: var(--widget-text-color);
      padding: 0.5rem 0;
      .row-1 {
        @extend .svg-button;
        .address-copy {
          cursor: copy;
          display: inline;
        }
        span.txt-email {
          font-weight: bold;
        }
        span.txt-at {
          margin: 0 0.1rem;
          opacity: var(--dimming-factor);
        }
        span.status {
          font-size: 1.5rem;
          line-height: 1rem;
          margin-right: 0.25rem;
          vertical-align: middle;
          &.active { color: var(--success); }
          &.inactive { color: var(--danger); }
        }
        .copy-btn {
          float: right;
          border: none;
          color: var(--widget-text-color);
          background: var(--widget-accent-color);
        }
      }
      .row-2 {
        max-width: 90%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        opacity: var(--dimming-factor);
        span.description {
          font-size: 0.8rem;
          font-style: italic;
        }
      }
      .row-3, .row-4 {
        font-size: 0.8rem;
        opacity: var(--dimming-factor);
      }
      .row-4 {
        span.as-time-ago {
          display: none;
        }
      }
      &:hover {
        .row-4 {
          .as-date { display: none; }
          .as-time-ago { display: inline; }
        }
      }
      &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
    }
  }
  .pagination {
    text-align: center;
    p.page-status {
      color: var(--widget-text-color);
      opacity: var(--dimming-factor);
      margin: 0.25rem 0;
      font-size: 0.85rem;
      font-family: var(--font-monospace);
    }
    span.page-num {
      width: 1rem;
      cursor: pointer;
      padding: 0 0.15rem 0.1rem 0.15rem;
      margin: 0;
      color: var(--widget-text-color);
      border-radius: 0.25rem;
      border: 1px solid transparent;
      display: inline-block;
      &.selected {
        font-weight: bold;
        color: var(--widget-background-color);
        background: var(--widget-text-color);
        border: 1px solid var(--widget-background-color);
      }
      &:hover {
        border: 1px solid var(--widget-text-color);
      }
    }
  }
}

</style>
