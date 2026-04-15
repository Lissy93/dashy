<template>
  <div class="filebrowser-widget">
    <!-- Storage Stats -->
    <div class="storage-stats" v-if="directoryInfo && !hideStats">
      <p class="source-name">{{ directoryInfo.name }}</p>
      <p class="stat-row">
        <span class="size">{{ formattedSize }}</span>
        <span class="counts">{{ fileCount }} files, {{ folderCount }} folders</span>
      </p>
    </div>

    <!-- Detailed Stats Section -->
    <div v-if="showDetailedStats && directoryInfo" class="detailed-stats">
      <p class="section-title">Statistics</p>
      <div class="stats-grid">
        <div class="stat-item" v-if="directoryInfo.modified">
          <span class="stat-label">Last Modified</span>
          <span class="stat-value">{{ formatDate(directoryInfo.modified) }}</span>
        </div>
        <div class="stat-item" v-if="largestFile">
          <span class="stat-label">Largest File</span>
          <span class="stat-value" :title="largestFile.name">
            {{ truncate(largestFile.name, 18) }}
            <small>({{ formatSize(largestFile.size) }})</small>
          </span>
        </div>
        <div class="stat-item" v-if="hiddenCount > 0">
          <span class="stat-label">Hidden Files</span>
          <span class="stat-value">{{ hiddenCount }}</span>
        </div>
        <div class="stat-item" v-if="totalItems > 0">
          <span class="stat-label">Total Items</span>
          <span class="stat-value">{{ totalItems }}</span>
        </div>
      </div>
      <div class="file-types" v-if="fileTypesList.length">
        <span class="stat-label">File Types</span>
        <div class="type-badges">
          <span
            v-for="ft in fileTypesList"
            :key="ft.type"
            class="type-badge"
            :title="`${ft.count} ${ft.type} file(s)`"
          >
            {{ ft.label }} <small>{{ ft.count }}</small>
          </span>
        </div>
      </div>
    </div>

    <!-- Favorites Section -->
    <div v-if="matchedFavorites.length && !hideFavorites" class="file-list">
      <p class="section-title">Favorites</p>
      <div class="file-links">
        <a
          v-for="(file, idx) in matchedFavorites"
          :key="`fav-${idx}`"
          :href="getFileUrl(file)"
          :title="file.name"
          target="_blank"
          class="file-link"
        >
          <span class="file-name">{{ truncate(file.name) }}</span>
          <span class="file-size">{{ formatSize(file.size) }}</span>
        </a>
      </div>
    </div>

    <!-- Recent Files Section -->
    <div v-if="recentFiles.length && !hideRecent" class="file-list">
      <p class="section-title">Recent</p>
      <div class="file-links">
        <a
          v-for="(file, idx) in recentFiles"
          :key="`recent-${idx}`"
          :href="getFileUrl(file)"
          :title="file.name"
          target="_blank"
          class="file-link"
        >
          <span class="file-name">{{ truncate(file.name) }}</span>
          <span class="file-meta">{{ formatDate(file.modified) }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { convertBytes, getTimeAgo, truncateStr } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      directoryInfo: null,
      files: [],
      folders: [],
    };
  },
  computed: {
    hostname() {
      const host = this.parseAsEnvVar(this.options.hostname);
      if (!host) this.error('Filebrowser hostname is required');
      return host ? host.replace(/\/$/, '') : '';
    },
    apiKey() {
      const key = this.parseAsEnvVar(this.options.apiKey);
      if (!key) this.error('API key is required');
      return key;
    },
    source() {
      return this.options.source || '';
    },
    path() {
      return this.options.path || '/';
    },
    showRecent() {
      return this.options.showRecent ?? 5;
    },
    limit() {
      return this.options.limit || 10;
    },
    favorites() {
      return this.options.favorites || [];
    },
    hideStats() {
      return this.options.hideStats || false;
    },
    hideFavorites() {
      return this.options.hideFavorites || false;
    },
    hideRecent() {
      return this.options.hideRecent || false;
    },
    showDetailedStats() {
      return this.options.showDetailedStats || false;
    },
    endpoint() {
      const base = `${this.hostname}/api/resources`;
      const params = new URLSearchParams({ auth: this.apiKey });
      if (this.source) params.append('source', this.source);
      if (this.path && this.path !== '/') params.append('path', this.path);
      return `${base}?${params.toString()}`;
    },
    formattedSize() {
      return this.directoryInfo ? convertBytes(this.directoryInfo.size) : '';
    },
    fileCount() {
      return this.files.length;
    },
    folderCount() {
      return this.folders.length;
    },
    matchedFavorites() {
      if (this.hideFavorites || !this.favorites.length || !this.files.length) return [];
      const favSet = new Set(this.favorites.map((f) => f.replace(/^\//, '')));
      return this.files.filter((file) => favSet.has(file.name)).slice(0, this.limit);
    },
    recentFiles() {
      if (this.hideRecent || !this.showRecent || !this.files.length) return [];
      const favNames = new Set(this.matchedFavorites.map((f) => f.name));
      const maxRecent = Math.min(this.showRecent, this.limit);
      return [...this.files]
        .filter((f) => !favNames.has(f.name))
        .sort((a, b) => new Date(b.modified) - new Date(a.modified))
        .slice(0, maxRecent);
    },
    largestFile() {
      if (!this.files.length) return null;
      return this.files.reduce((max, f) => (f.size > max.size ? f : max), this.files[0]);
    },
    hiddenCount() {
      const hiddenFiles = this.files.filter((f) => f.hidden).length;
      const hiddenFolders = this.folders.filter((f) => f.hidden).length;
      return hiddenFiles + hiddenFolders;
    },
    totalItems() {
      return this.files.length + this.folders.length;
    },
    fileTypesList() {
      if (!this.files.length) return [];
      const types = {};
      this.files.forEach((f) => {
        const type = f.type || 'unknown';
        types[type] = (types[type] || 0) + 1;
      });
      return Object.entries(types)
        .map(([type, count]) => ({
          type,
          count,
          label: this.getTypeLabel(type),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
  },
  methods: {
    fetchData() {
      if (!this.hostname || !this.apiKey) return;
      this.makeRequest(this.endpoint).then(this.processData);
    },
    processData(data) {
      if (!data || data.status) {
        this.error(data?.message || 'Failed to fetch data from Filebrowser');
        return;
      }
      this.directoryInfo = {
        name: data.name || data.source || 'Files',
        size: data.size || 0,
        path: data.path || '/',
        source: data.source || '',
        modified: data.modified || null,
      };
      this.files = data.files || [];
      this.folders = data.folders || [];
    },
    getFileUrl(file) {
      const filePath = this.path === '/' ? `/${file.name}` : `${this.path}/${file.name}`;
      return `${this.hostname}/files${filePath}?source=${this.source}`;
    },
    formatSize(bytes) {
      return convertBytes(bytes);
    },
    formatDate(timestamp) {
      return getTimeAgo(timestamp);
    },
    truncate(str, len = 28) {
      return truncateStr(str, len);
    },
    getTypeLabel(type) {
      const typeMap = {
        'application/yaml': 'YAML',
        'application/json': 'JSON',
        'application/pdf': 'PDF',
        'application/zip': 'ZIP',
        'text/plain': 'Text',
        'text/html': 'HTML',
        'text/css': 'CSS',
        'text/javascript': 'JS',
        directory: 'Folder',
        blob: 'Binary',
      };
      if (typeMap[type]) return typeMap[type];
      if (type.startsWith('image/')) return 'Image';
      if (type.startsWith('video/')) return 'Video';
      if (type.startsWith('audio/')) return 'Audio';
      if (type.startsWith('application/')) return type.split('/')[1].toUpperCase();
      return type.split('/').pop() || 'Other';
    },
  },
};
</script>

<style scoped lang="scss">
.filebrowser-widget {
  color: var(--widget-text-color);
  max-height: 400px;
  overflow-y: auto;

  .storage-stats {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px dashed var(--widget-text-color);

    .source-name {
      margin: 0 0 0.25rem;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .stat-row {
      margin: 0;
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .size {
      font-weight: bold;
      color: var(--widget-accent-color, var(--primary));
    }
  }

  .section-title {
    margin: 0 0 0.25rem;
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .detailed-stats {
    margin: 0.5rem 0;
    padding: 0.5rem 0;
    border-bottom: 1px dashed var(--widget-text-color);

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.4rem;
      margin-top: 0.25rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      padding: 0.25rem 0;

      .stat-label {
        font-size: 0.75rem;
        opacity: 0.7;
        text-transform: uppercase;
      }

      .stat-value {
        font-size: 0.85rem;
        font-family: var(--font-monospace);
        color: var(--widget-text-color);

        small {
          opacity: 0.7;
          font-size: 0.75rem;
        }
      }
    }

    .file-types {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--widget-text-color);
      opacity: 0.8;

      .stat-label {
        display: block;
        font-size: 0.75rem;
        opacity: 0.7;
        text-transform: uppercase;
        margin-bottom: 0.25rem;
      }

      .type-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .type-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
        padding: 0.15rem 0.4rem;
        font-size: 0.7rem;
        background: var(--widget-accent-color, var(--primary));
        color: var(--widget-background-color, var(--background));
        border-radius: 0.75rem;
        opacity: 0.9;

        small {
          font-weight: bold;
        }
      }
    }
  }

  .file-list {
    margin-top: 0.5rem;

    .file-links {
      max-height: 150px;
      overflow-y: auto;
    }

    .file-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
      color: var(--widget-text-color);
      text-decoration: none;
      border-bottom: 1px solid transparent;

      &:hover {
        border-bottom-color: var(--widget-accent-color, var(--primary));
      }

      .file-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-size,
      .file-meta {
        font-size: 0.8rem;
        opacity: 0.7;
        margin-left: 0.5rem;
        white-space: nowrap;
      }
    }
  }
}
</style>
