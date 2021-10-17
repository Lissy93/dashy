// A list of mutation names
const KEY_NAMES = [
  'INITIALIZE_CONFIG',
  'UPDATE_CONFIG',
  'SET_MODAL_OPEN',
  'SET_LANGUAGE',
  'UPDATE_ITEM',
  'SET_EDIT_MODE',
];

// Convert array of key names into an object, and export
const MUTATIONS = {};
KEY_NAMES.forEach((key) => { MUTATIONS[key] = key; });
export default MUTATIONS;
