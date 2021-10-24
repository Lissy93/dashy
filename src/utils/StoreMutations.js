// A list of mutation names
const KEY_NAMES = [
  'INITIALIZE_CONFIG',
  'UPDATE_CONFIG',
  'SET_MODAL_OPEN',
  'SET_LANGUAGE',
  'SET_EDIT_MODE',
  'UPDATE_ITEM',
  'UPDATE_PAGE_INFO',
  'UPDATE_APP_CONFIG',
  'UPDATE_SECTION',
  'COPY_ITEM',
];

// Convert array of key names into an object, and export
const MUTATIONS = {};
KEY_NAMES.forEach((key) => { MUTATIONS[key] = key; });
export default MUTATIONS;
