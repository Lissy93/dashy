/** Reusable mixin for items */
import axios from 'axios';
import router from '@/router';
import {
  openingMethod as defaultOpeningMethod,
  serviceEndpoints,
  localStorageKeys,
} from '@/utils/defaults';

export default {
  data() {
    return {
      statusResponse: undefined,
      contextMenuOpen: false,
      contextPos: {
        posX: undefined,
        posY: undefined,
      },
    };
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    accumulatedTarget() {
      return this.target || this.appConfig.defaultOpeningMethod || defaultOpeningMethod;
    },
    /* Convert config target value, into HTML anchor target attribute */
    anchorTarget() {
      if (this.isEditMode) return '_self';
      const target = this.accumulatedTarget;
      switch (target) {
        case 'sametab': return '_self';
        case 'newtab': return '_blank';
        case 'parent': return '_parent';
        case 'top': return '_top';
        default: return undefined;
      }
    },
    /* Get href for anchor, if not in edit mode, or opening in modal/ workspace */
    hyperLinkHref() {
      const nothing = '#';
      const url = this.url || nothing;
      if (this.isEditMode) return nothing;
      const noAnchorNeeded = ['modal', 'workspace', 'clipboard'];
      return noAnchorNeeded.includes(this.accumulatedTarget) ? nothing : url;
    },
    /* Pulls together all user options, returns URL + Get params for ping endpoint */
    makeApiUrl() {
      const {
        url, statusCheckUrl, statusCheckHeaders, statusCheckAllowInsecure, statusCheckAcceptCodes,
      } = this;
      const encode = (str) => encodeURIComponent(str);
      this.statusResponse = undefined;
      // Find base URL, where the API is hosted
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      // Find correct URL to check, and encode
      const urlToCheck = `?&url=${encode(statusCheckUrl || url)}`;
      // Get, stringify and encode any headers
      const headers = statusCheckHeaders
        ? `&headers=${encode(JSON.stringify(statusCheckHeaders))}` : '';
      // Deterimine if user disabled security
      const enableInsecure = statusCheckAllowInsecure ? '&enableInsecure=true' : '';
      const acceptCodes = statusCheckAcceptCodes ? `&acceptCodes=${statusCheckAcceptCodes}` : '';
      // Construct the full API endpoint's URL with GET params
      return `${baseUrl}${serviceEndpoints.statusCheck}/${urlToCheck}`
        + `${headers}${enableInsecure}${acceptCodes}`;
    },
    /* Checks if a given service is currently online */
    checkWebsiteStatus() {
      const endpoint = this.makeApiUrl();
      axios.get(endpoint)
        .then((response) => {
          if (response.data) this.statusResponse = response.data;
        })
        .catch(() => { // Something went very wrong.
          this.statusResponse = {
            statusText: 'Failed to make request',
            statusSuccess: false,
          };
        });
    },
  },
  methods: {
    /* Open item, using specified method */
    launchItem(method, link) {
      const url = link || this.url;
      this.contextMenuOpen = false;
      switch (method) {
        case 'newtab':
          window.open(url, '_blank');
          break;
        case 'sametab':
          window.open(url, '_self');
          break;
        case 'modal':
          this.$emit('triggerModal', url);
          break;
        case 'workspace':
          router.push({ name: 'workspace', query: { url } });
          break;
        case 'clipboard':
          navigator.clipboard.writeText(url);
          this.$toasted.show(this.$t('context-menus.item.copied-toast'));
          break;
        default: window.open(url, '_blank');
      }
    },
    /* Open custom context menu, and set position */
    openContextMenu(e) {
      this.contextMenuOpen = !this.contextMenuOpen;
      if (e && window) {
        // Calculate placement based on cursor and scroll position
        this.contextPos = {
          posX: e.clientX + window.pageXOffset,
          posY: e.clientY + window.pageYOffset,
        };
      }
    },
    /* Closes the context menu, called when user clicks literally anywhere */
    closeContextMenu() {
      this.contextMenuOpen = false;
    },
    /* Used for smart-sort when sorting items by most used apps */
    incrementMostUsedCount(itemId) {
      const mostUsed = JSON.parse(localStorage.getItem(localStorageKeys.MOST_USED) || '{}');
      let counter = mostUsed[itemId] || 0;
      counter += 1;
      mostUsed[itemId] = counter;
      localStorage.setItem(localStorageKeys.MOST_USED, JSON.stringify(mostUsed));
    },
    /* Used for smart-sort when sorting by last used apps */
    incrementLastUsedCount(itemId) {
      const lastUsed = JSON.parse(localStorage.getItem(localStorageKeys.LAST_USED) || '{}');
      lastUsed[itemId] = new Date().getTime();
      localStorage.setItem(localStorageKeys.LAST_USED, JSON.stringify(lastUsed));
    },
  },
};
