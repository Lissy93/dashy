// A list of mutation names
const KEY_NAMES = [
  'UPDATE_CONFIG',
  'SET_MODAL_OPEN',
];

// Convert array of key names into an object, and export
const MUTATIONS = {};
KEY_NAMES.forEach((key) => { MUTATIONS[key] = key; });
export default MUTATIONS;
