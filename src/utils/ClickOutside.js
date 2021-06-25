/**
 * A simple Vue directive to trigger an event when the user
 * clicks anywhere other than the specified element.
 * Used to close context menu's popup menus and tips.
 */

const instances = [];

function onDocumentClick(e, el, fn) {
  const { target } = e;
  if (el !== target && !el.contains(target)) {
    fn(e);
  }
}

export default {
  bind(element, binding) {
    const el = element;
    el.dataset.outsideClickIndex = instances.length;

    const fn = binding.value;
    const click = (e) => {
      onDocumentClick(e, el, fn);
    };

    document.addEventListener('click', click);
    document.addEventListener('touchstart', click);
    instances.push(click);
  },
  unbind(el) {
    if (!el.dataset) return;
    const index = el.dataset.outsideClickIndex;
    const handler = instances[index];
    document.removeEventListener('click', handler);
    instances.splice(index, 1);
  },
};
