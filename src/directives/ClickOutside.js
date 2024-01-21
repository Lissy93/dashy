/**
 * A Vue directive to trigger an event when the user
 * clicks anywhere other than the specified elements
 * Used to close context menus popup modals and tips
 * Dashy: Licensed under MIT - (C) Alicia Sykes 2022
 */

const instances = []; // List of click event instances

/* Trigger action when click anywhere, except target elem */
function onDocumentClick(event, elem, action) {
  const { target } = event;
  if (elem !== target && !elem.contains(target)) {
    action(event);
  }
}

export default {
  /* Add event listeners */
  bind(element, binding) {
    const elem = element;
    elem.dataset.outsideClickIndex = instances.length;

    const action = binding.value;
    const click = (event) => {
      onDocumentClick(event, elem, action);
    };

    document.addEventListener('click', click);
    document.addEventListener('touchstart', click);
    instances.push(click);
  },
  /* Remove event listeners */
  unbind(elem) {
    if (!elem.dataset) return;
    const index = elem.dataset.outsideClickIndex;
    const handler = instances[index];
    document.removeEventListener('click', handler);
    instances.splice(index, 1);
  },
};
