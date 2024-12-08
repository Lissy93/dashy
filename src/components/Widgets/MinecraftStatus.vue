<template>
  <div class="minecraft-wrapper">
    <a class="minecraft-link" :href="serverLinkEndpoint">
      <h3 class="minecraft-title">{{ title }}</h3>
    </a>
    <div class="minecraft-icon-wrapper">
      <img :src="icon" alt="server-icon" class="minecraft-icon" />
    </div>
    <div class="minecraft-content-wrapper">
      <StatusIndicator class="status-indicator" :statusSuccess="status ? online : undefined"
        :statusText="status ? statusTooltip : undefined" />
      <span v-if="title != server" class="minecraft-server">{{ server }}<br /></span>
      <span v-if="!online" class="minecraft-status">Server Offline</span>
      <span v-if="online" class="minecraft-version">
        {{ software || (bedrock ? "Bedrock" : "Minecraft") }} {{ version }}
      </span>
      <ul v-if="online" class="minecraft-motd">
        <li v-for="(line, idx) in motd" :key="idx">{{ line }}</li>
      </ul>
      <div v-if="showPlayers" class="player-list">
        <span>{{ onlinePlayers }}/{{ maxPlayers }} Players</span>
        <ul>
          <li v-for="{ name, uuid } in players" :key="uuid">
            <a :href="playerLinkEndpoint(uuid)">
              <img :src="playerIconEndpoint(uuid)" :alt="`${name}'s Head'`"/>{{ name }}
            </a>
          </li>
        </ul>
      </div>
      <div v-if="showMods" class="mod-list">
        <span>{{ mods.length }} Mods</span>
        <ul>
          <li v-for="{ name, version } in mods" :key="name">
            {{ name }}={{ version }}
          </li>
        </ul>
      </div>
      <div v-if="showPlugins" class="plugin-list">
        <span>{{ plugins.length }} Plugins</span>
        <ul>
          <li v-for="{ name, version } in plugins" :key="name">
            {{ name }}={{ version }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import StatusIndicator from '@/components/LinkItems/StatusIndicator.vue';

export default {
  mixins: [WidgetMixin],
  components: {
    StatusIndicator,
  },
  data() {
    return {
      status: false,
      online: false,
      ip: '',
      port: 0,
      hostname: '',
      iconData: null,
      motd: null,
      version: null,
      software: null,
      gamemode: null,
      mods: [],
      plugins: [],
      players: [],
      onlinePlayers: null,
      maxPlayers: null,
    };
  },
  computed: {
    title() {
      return this.options.title || this.options.server || this.error('options.server not set');
    },
    alt() {
      return this.title;
    },
    icon() {
      return `https://api.mcsrvstat.us/icon/${this.server}`;
    },
    server() {
      return this.options.server || this.error('options.server not set');
    },
    bedrock() {
      return this.options.bedrock === true;
    },
    statusTooltip() {
      if (!this.status) {
        return 'Loading...';
      }
      if (!this.online) {
        return `${this.server} Offline`;
      }
      return `${this.onlinePlayers}/${this.maxPlayers} Online`;
    },
    showPlayers() {
      return this.options.showPlayers && this.players.length > 0;
    },
    showMods() {
      return this.options.showMods && this.mods.length > 0;
    },
    showPlugins() {
      return this.options.showPlugins && this.plugins.length > 0;
    },
    endpoint() {
      return `${widgetApiEndpoints.minecraftStatus}${this.bedrock ? 'bedrock/' : ''}3/${this.server}`;
    },
    serverLinkEndpoint() {
      return `${widgetApiEndpoints.minecraftServerLink}${this.server}`;
    },
  },
  methods: {
    playerIconEndpoint(uuid) {
      return `${widgetApiEndpoints.minecraftPlayerIcon}${uuid}/32.png`;
    },
    playerLinkEndpoint(uuid) {
      return `${widgetApiEndpoints.minecraftPlayerLink}${uuid}`;
    },
    /* Make GET request to McSrvStat.US API endpoint */
    fetchData() {
      this.startLoading();
      fetch(this.endpoint)
        .then(response => {
          if (!response.ok) {
            this.error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.processData(data);
        })
        .catch(dataFetchError => {
          this.error('Unable to fetch data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.online = data.online;
      this.ip = data.ip;
      this.port = data.port;
      this.hostname = data.hostname;
      if (this.online) {
        this.version = data.version;
        this.iconData = data.icon;
        this.software = data.software;
        this.gamemode = data.gamemode;
        this.motd = data.motd.clean || [];
        this.players = data.players.list || [];
        this.onlinePlayers = data.players.online;
        this.maxPlayers = data.players.max;
        this.mods = data.mods || [];
        this.plugins = data.plugins || [];
      }
      this.status = true;
    },
    update() {
      this.fetchData();
    },
  },
};
</script>

<style scoped lang="scss">

.minecraft-wrapper {
  margin-top: -1em;
  display: grid;
  justify-content: center;
  grid-template-columns: 64px 1fr;
  color: var(--widget-text-color);
  padding-top: 0.5rem;

  .minecraft-link {
    grid-column:  1 / span 2;
    text-decoration: none;

    .minecraft-title {
      font-size: 1.2rem;
      margin: 0.25rem auto;
      border-bottom: 1px solid var(--widget-text-color);
      color: var(--widget-text-color);
    }
  }

  .minecraft-icon {
    display: flex;
    width: 100%;
    max-width: 64px;
    margin: 0.25rem auto 0;
    padding-top: 0.5rem;
    border-radius: var(--curve-factor);
  }

  .minecraft-content-wrapper {
    position: relative;
    padding: 0.5rem;

    ul.minecraft-motd {
      border-top: 1px dashed var(--widget-text-color);
      list-style-type: none;
      padding: 0.5rem 0;
      margin: 0.5rem 0 0 0;
    }

    .player-list,
    .mod-list,
    .plugin-list {
      span {
        font-size: 1.2rem;
        border-top: 1px dashed var(--widget-text-color);
        padding: 0.25rem 0;
        display: block;
      }
      ul {
        list-style-type: '- ';
        padding: 0;
        margin: 0;
        li {
          padding: 1rem 0;
          margin: 0;
        }
      }
    }

    .player-list {
      ul {
        li {
          padding: 0;
          list-style-type: none;
          img {
            width: 1rem;
            height: 1rem;
            float: left;
            position: relative;
            margin-right: 1em;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.minecraft-alt-tt {
  min-width: 20rem;
}
</style>
