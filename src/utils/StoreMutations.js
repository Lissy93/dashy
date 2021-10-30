// A list of mutation names
const KEY_NAMES = [
  'INITIALIZE_CONFIG',
  'SET_CONFIG',
  'SET_MODAL_OPEN',
  'SET_LANGUAGE',
  'SET_EDIT_MODE',
  'SET_ITEM_LAYOUT',
  'SET_ITEM_SIZE',
  'SET_THEME',
  'SET_CUSTOM_COLORS',
  'UPDATE_ITEM',
  'SET_PAGE_INFO',
  'SET_APP_CONFIG',
  'SET_SECTIONS',
  'UPDATE_SECTION',
  'INSERT_SECTION',
  'REMOVE_SECTION',
  'COPY_ITEM',
  'REMOVE_ITEM',
  'INSERT_ITEM',
  'UPDATE_CUSTOM_CSS',
];

// Convert array of key names into an object, and export
const MUTATIONS = {};
KEY_NAMES.forEach((key) => { MUTATIONS[key] = key; });
export default MUTATIONS;
