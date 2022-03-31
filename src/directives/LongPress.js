/**
 * A Vue directive to call event when element is long-pressed
 * Used to open context menus on touch-enabled devices
 * Inspired by: FeliciousX/vue-directive-long-press
 * Dashy: Licensed under MIT - (C) Alicia Sykes 2022
 */

const LONG_PRESS_DEFAULT_DELAY = 750;
const longPressEvent = new CustomEvent('long-press');

export default {
  bind(element, binding, vnode) {
    const el = element;
    el.dataset.longPressTimeout = null;

    const swallowClick = (e) => {
      el.removeEventListener('click', swallowClick);
      if (!el.dataset.elapsed) return true;
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const complete = () => {
      if (vnode.componentInstance) vnode.componentInstance.$emit('long-press');
      else el.dispatchEvent(longPressEvent);
      el.dataset.elapsed = true;
    };

    const onPointerUp = () => {
      clearTimeout(parseInt(el.dataset.longPressTimeout, 10));
      document.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = () => {
      document.addEventListener('pointerup', onPointerUp);
      el.addEventListener('click', swallowClick);
      const timeoutDuration = binding.value || LONG_PRESS_DEFAULT_DELAY;
      const timeout = setTimeout(complete, timeoutDuration);
      el.dataset.elapsed = false;
      el.dataset.longPressTimeout = timeout;
    };

    el.$longPressHandler = onPointerDown;
    el.addEventListener('pointerdown', onPointerDown);
  },
  unbind(el) {
    clearTimeout(parseInt(el.dataset.longPressTimeout, 10));
    el.removeEventListener('pointerdown', el.$longPressHandler);
  },
};
