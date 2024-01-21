/** Reusable mixin for items */
import axios from 'axios';
import router from '@/router';
import longPress from '@/directives/LongPress';
import ErrorHandler from '@/utils/ErrorHandler';
import {
  openingMethod as defaultOpeningMethod,
  serviceEndpoints,
  localStorageKeys,
  iconSize as defaultSize,
} from '@/utils/defaults';

export default {
  directives: {
    longPress,
  },
  props: {
    item: Object,
    isAddNew: Boolean,
  },
  data() {
    return {
      statusResponse: undefined,
      contextMenuOpen: false,
      intervalId: undefined, // status-check setInterval() id
      contextPos: {
        posX: undefined,
        posY: undefined,
      },
      customStyles: {
        color: this.item.color,
        background: this.item.backgroundColor,
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
    size() {
      const validSizes = ['small', 'medium', 'large'];
      if (this.itemSize && validSizes.includes(this.itemSize)) return this.itemSize;
      return this.$store.getters.iconSize || defaultSize;
    },
    /* Determines if user has enabled online status checks */
    enableStatusCheck() {
      const globalPref = this.appConfig.statusCheck || false;
      const itemPref = this.item.statusCheck;
      return typeof itemPref === 'boolean' ? itemPref : globalPref;
    },
    /* Determine how often to re-fire status checks */
    statusCheckInterval() {
      let interval = this.item.statusCheckInterval || this.appConfig.statusCheckInterval;
      if (!interval) return 0;
      if (interval > 60) interval = 60;
      if (interval < 1) interval = 0;
      return interval;
    },
    accumulatedTarget() {
      return this.item.target || this.appConfig.defaultOpeningMethod || defaultOpeningMethod;
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
      const url = this.url || this.item.url || nothing;
      if (this.isEditMode) return nothing;
      const noAnchorNeeded = ['modal', 'workspace', 'clipboard'];
      return noAnchorNeeded.includes(this.accumulatedTarget) ? nothing : url;
    },
    /* Pulls together all user options, returns URL + Get params for ping endpoint */
    statusCheckApiUrl() {
      const {
        url,
        statusCheckUrl,
        statusCheckHeaders,
        statusCheckAllowInsecure,
        statusCheckAcceptCodes,
        statusCheckMaxRedirects,
      } = this.item;
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
      const maxRedirects = statusCheckMaxRedirects ? `&maxRedirects=${statusCheckMaxRedirects}` : '';
      // Construct the full API endpoint's URL with GET params
      return `${baseUrl}${serviceEndpoints.statusCheck}/${urlToCheck}`
        + `${headers}${enableInsecure}${acceptCodes}${maxRedirects}`;
    },
    customStyle() {
      return `--open-icon:${this.unicodeOpeningIcon};`
        + `color:${this.item.color};`
        + `background:${this.item.backgroundColor}`;
    },
  },
  methods: {
    /* Checks if a given service is currently online */
    checkWebsiteStatus() {
      const endpoint = this.statusCheckApiUrl;
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
    /* Called when an item is clicked, manages the opening of modal & resets the search field */
    itemClicked(e) {
      const url = this.url || this.item.url;
      if (this.isEditMode) {
        // If in edit mode, open settings, and don't launch app
        e.preventDefault();
        this.openItemSettings();
        return;
      }
      // For certain opening methods, prevent default and manually navigate
      if (e.ctrlKey) {
        e.preventDefault();
        window.open(url, '_blank');
      } else if (e.altKey || this.accumulatedTarget === 'modal') {
        e.preventDefault();
        this.$emit('triggerModal', url);
      } else if (this.accumulatedTarget === 'workspace') {
        e.preventDefault();
        router.push({ name: 'workspace', query: { url } });
      } else if (this.accumulatedTarget === 'clipboard') {
        e.preventDefault();
        this.copyToClipboard(url);
      }
      // Emit event to clear search field, etc
      this.$emit('itemClicked');
      // Update the most/ last used ledger, for smart-sorting
      if (!this.appConfig.disableSmartSort) {
        this.incrementMostUsedCount(this.item.id);
        this.incrementLastUsedCount(this.item.id);
      }
    },
    /* Open item, using specified method */
    launchItem(method, link) {
      const url = link || this.item.url;
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
          this.copyToClipboard(url);
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
    /* Copies a string to the users clipboard / shows error if not possible  */
    copyToClipboard(content) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content);
        this.$toasted.show(
          this.$t('context-menus.item.copied-toast'),
          { className: 'toast-success' },
        );
      } else {
        ErrorHandler('Clipboard access requires HTTPS. See: https://bit.ly/3N5WuAA');
        this.$toasted.show('Unable to copy, see log', { className: 'toast-error' });
      }
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
