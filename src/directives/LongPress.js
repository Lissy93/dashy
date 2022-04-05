/**
 * A Vue directive to call event when element is long-pressed
 * Used to open context menus on touch-enabled devices
 * Inspired by: FeliciousX/vue-directive-long-press
 * Dashy: Licensed under MIT - (C) Alicia Sykes 2022
 */

const LONG_PRESS_DEFAULT_DELAY = 750;
const longPressEvent = new CustomEvent('long-press');

let startTime = null;

export default {
  bind(element, binding, vnode) {
    const el = element;
    el.dataset.longPressTimeout = null;

    const swallowClick = (e) => {
      el.removeEventListener('click', swallowClick);
      if (!el.dataset.elapsed) return true;
      const totalTime = Date.now() - startTime;
      // If was long press, then cancel original action
      if (totalTime > LONG_PRESS_DEFAULT_DELAY) {
        e.preventDefault();
        e.stopPropagation();
      }
      return false;
    };

    /* Emit event to component */
    const triggerEvent = () => {
      if (vnode.componentInstance) vnode.componentInstance.$emit('long-press');
      else el.dispatchEvent(longPressEvent);
      el.dataset.elapsed = true;
    };

    const onPointerUp = () => {
      clearTimeout(parseInt(el.dataset.longPressTimeout, 10));
      document.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = (e) => {
      // If event was right-click, then immediately trigger
      if (e.button === 2) return;
      startTime = Date.now();
      document.addEventListener('pointerup', onPointerUp);
      el.addEventListener('click', swallowClick);
      const timeoutDuration = LONG_PRESS_DEFAULT_DELAY;
      const timeout = setTimeout(triggerEvent, timeoutDuration);
      el.dataset.elapsed = false;
      el.dataset.longPressTimeout = timeout;
      e.preventDefault();
    };
    el.$longPressHandler = onPointerDown;
    el.addEventListener('pointerdown', onPointerDown);
  },
  unbind(el) {
    startTime = null;
    clearTimeout(parseInt(el.dataset.longPressTimeout, 10));
    el.removeEventListener('pointerdown', el.$longPressHandler);
  },
};
