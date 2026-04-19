/**
 * Dashy's custom zero-dependency v-tooltip directive for Vue 3
 * Supports strings or object bindings, HTML content, auto-positioning
 * and is designed to be accessible, responsive, performant and configurable.
 *
 * Usage: it's registered globally already, so no need to import.
 * Just add the v-tooltip attribute to any element, passing in text or options
 *
 * Examples:
 * <button v-tooltip="I like big buttons and I cannot lie">Sir Mix Alot says..</button>
 * <span v-tooltip="{ content: '<b>Bold</b> & safe', html: true }">?</span>
 * <a v-tooltip="{ content: 'nothing at all', disabled: true }">y no tooltip?</a>
 * <i v-tooltip="{ content: 'I am a pretty tooltip', popperClass: 'in-modal-tt' }" />
 * <i v-tooltip="{ content: 'Focus me', triggers: ['focus'], delay: { show: 500, hide: 200 }}" />
 */
import DOMPurify from 'dompurify';

const DEFAULTS = {
  triggers: ['hover', 'focus'],
  placement: 'auto',
  delay: { show: 250, hide: 0 },
};
const GAP = 8;
const ARROW_SIZE = 6;
const TRANSITION_MS = 150;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.id = 'dashy-tooltip-styles';
  style.textContent = `
.dashy-tooltip {
  position: absolute;
  top: 0; left: 0;
  z-index: 5;
  max-width: var(--tooltip-width, 250px);
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  transition: opacity ${TRANSITION_MS}ms, visibility ${TRANSITION_MS}ms;
  font-size: 0.8rem;
}
.dashy-tooltip.is-visible {
  visibility: visible;
  opacity: 1;
}
.dashy-tooltip .tooltip-inner {
  background: var(--description-tooltip-background, #1a1a2e);
  border: 1px solid var(--description-tooltip-color, #7efff5);
  border-radius: var(--curve-factor-small, 2px);
  color: var(--description-tooltip-color, #7efff5);
  padding: var(--tooltip-padding, 0.2rem);
  overflow: hidden;
  word-wrap: break-word;
}
.dashy-tooltip .tooltip-arrow {
  position: absolute;
  width: 0; height: 0;
  border-style: solid;
  border-color: transparent;
  border-width: ${ARROW_SIZE}px;
}
.dashy-tooltip[data-placement^="top"] .tooltip-arrow {
  bottom: -${ARROW_SIZE}px;
  border-bottom-width: 0;
  border-top-color: var(--description-tooltip-color, #7efff5);
}
.dashy-tooltip[data-placement^="bottom"] .tooltip-arrow {
  top: -${ARROW_SIZE}px;
  border-top-width: 0;
  border-bottom-color: var(--description-tooltip-color, #7efff5);
}
.dashy-tooltip[data-placement^="left"] .tooltip-arrow {
  right: -${ARROW_SIZE}px;
  border-right-width: 0;
  border-left-color: var(--description-tooltip-color, #7efff5);
}
.dashy-tooltip[data-placement^="right"] .tooltip-arrow {
  left: -${ARROW_SIZE}px;
  border-left-width: 0;
  border-right-color: var(--description-tooltip-color, #7efff5);
}
.dashy-tooltip.in-modal-tt { z-index: 999; }
@media (prefers-reduced-motion: reduce) {
  .dashy-tooltip { transition: none; }
}
  `;
  document.head.appendChild(style);
}

const PLACEMENTS = ['top', 'bottom', 'right', 'left'];
const FLIP = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function computeCoords(target, tip, placement, sx, sy) {
  const cx = target.left + target.width / 2 + sx;
  const cy = target.top + target.height / 2 + sy;
  switch (placement) {
    case 'top': return { left: cx - tip.width / 2, top: target.top + sy - tip.height - GAP };
    case 'bottom': return { left: cx - tip.width / 2, top: target.bottom + sy + GAP };
    case 'bottom-end': return { left: target.right + sx - tip.width, top: target.bottom + sy + GAP };
    case 'left': return { left: target.left + sx - tip.width - GAP, top: cy - tip.height / 2 };
    case 'right': return { left: target.right + sx + GAP, top: cy - tip.height / 2 };
    default: return { left: cx - tip.width / 2, top: target.top + sy - tip.height - GAP };
  }
}

function fitsViewport(target, tip, vw, vh, placement) {
  switch (placement) {
    case 'top': return target.top - tip.height - GAP >= 0;
    case 'bottom': return target.bottom + tip.height + GAP <= vh;
    case 'left': return target.left - tip.width - GAP >= 0;
    case 'right': return target.right + tip.width + GAP <= vw;
    default: return true;
  }
}

function positionTooltip(targetEl, tipEl, requested) {
  const target = targetEl.getBoundingClientRect();
  if (target.width === 0 && target.height === 0) {
    const owner = targetEl;
    if (owner._tooltip) hide(owner);
    return;
  }
  const tipEl2 = tipEl;
  tipEl2.style.visibility = 'hidden';
  tipEl2.style.display = 'block';
  const tip = tipEl2.getBoundingClientRect();
  const sx = window.scrollX;
  const sy = window.scrollY;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  let placement = requested;
  if (placement === 'auto') {
    placement = PLACEMENTS.find(p => fitsViewport(target, tip, vw, vh, p)) || 'top';
  } else if (!placement.includes('-') && !fitsViewport(target, tip, vw, vh, placement)) {
    placement = FLIP[placement] || placement;
  }

  const coords = computeCoords(target, tip, placement, sx, sy);
  coords.left = clamp(coords.left, sx + GAP, sx + vw - tip.width - GAP);
  coords.top = clamp(coords.top, sy + GAP, sy + vh - tip.height - GAP);

  tipEl2.style.left = `${coords.left}px`;
  tipEl2.style.top = `${coords.top}px`;
  tipEl2.setAttribute('data-placement', placement);

  // Arrow: point at target center, clamped within tooltip
  const arrow = tipEl2.querySelector('.tooltip-arrow');
  if (!arrow) return;
  if (placement === 'top' || placement === 'bottom' || placement === 'bottom-end') {
    const targetCx = target.left + target.width / 2 + sx;
    const arrowLeft = clamp(targetCx - coords.left - ARROW_SIZE, ARROW_SIZE, tip.width - ARROW_SIZE * 3);
    arrow.style.left = `${arrowLeft}px`;
    arrow.style.top = '';
  } else {
    const targetCy = target.top + target.height / 2 + sy;
    const arrowTop = clamp(targetCy - coords.top - ARROW_SIZE, ARROW_SIZE, tip.height - ARROW_SIZE * 3);
    arrow.style.top = `${arrowTop}px`;
    arrow.style.left = '';
  }

  tipEl2.style.visibility = '';
  tipEl2.style.display = '';
}

let idCounter = 0;

function normalize(value) {
  if (!value && value !== 0) return null;
  if (typeof value === 'string' || typeof value === 'number') return { content: String(value) };
  if (typeof value === 'object') {
    if (value.disabled || !value.content) return null;
    return value;
  }
  return null;
}

function resolveDelay(raw) {
  if (raw == null) return DEFAULTS.delay;
  if (typeof raw === 'number') return { show: raw, hide: 0 };
  return { show: raw.show ?? DEFAULTS.delay.show, hide: raw.hide ?? DEFAULTS.delay.hide };
}

/* Show / hide */
function show(el) {
  const state = el._tooltip;
  if (!state || state.visible) return;
  const opts = state.options;
  if (!opts) return;
  clearTimeout(state.hideTimer);

  state.showTimer = setTimeout(() => {
    injectStyles();

    const tip = document.createElement('div');
    tip.className = 'dashy-tooltip tooltip';
    tip.id = state.id;
    tip.setAttribute('role', 'tooltip');

    // Apply popperClass
    if (opts.popperClass) {
      const classes = Array.isArray(opts.popperClass) ? opts.popperClass : opts.popperClass.split(' ');
      classes.forEach(c => { if (c) tip.classList.add(c); });
    }

    const inner = document.createElement('div');
    inner.className = 'tooltip-inner';
    if (opts.html) {
      inner.innerHTML = DOMPurify.sanitize(opts.content);
    } else {
      inner.textContent = opts.content;
    }

    const arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';

    tip.appendChild(inner);
    tip.appendChild(arrow);
    document.body.appendChild(tip);
    state.tooltipEl = tip;

    positionTooltip(el, tip, opts.placement || DEFAULTS.placement);

    requestAnimationFrame(() => { tip.classList.add('is-visible'); });
    state.visible = true;

    // Reposition on scroll/resize
    state.reposition = () => {
      if (state.tooltipEl) positionTooltip(el, state.tooltipEl, opts.placement || DEFAULTS.placement);
    };
    window.addEventListener('scroll', state.reposition, { passive: true, capture: true });
    window.addEventListener('resize', state.reposition, { passive: true });
  }, resolveDelay(opts.delay).show);
}

function hide(el) {
  const state = el._tooltip;
  if (!state) return;
  clearTimeout(state.showTimer);

  const doHide = () => {
    if (state.tooltipEl) {
      state.tooltipEl.classList.remove('is-visible');
      const tipEl = state.tooltipEl;
      setTimeout(() => { tipEl.remove(); }, TRANSITION_MS);
      state.tooltipEl = null;
    }
    state.visible = false;
    if (state.reposition) {
      window.removeEventListener('scroll', state.reposition, { capture: true });
      window.removeEventListener('resize', state.reposition);
      state.reposition = null;
    }
  };

  const delay = resolveDelay(state.options?.delay).hide;
  if (delay > 0) {
    state.hideTimer = setTimeout(doHide, delay);
  } else {
    doHide();
  }
}

/* Global click-to-dismiss */
let globalClickBound = false;
function ensureGlobalClick() {
  if (globalClickBound) return;
  globalClickBound = true;
  document.addEventListener('click', () => {
    document.querySelectorAll('.dashy-tooltip.is-visible').forEach((tip) => {
      // Find the owner element via the tooltip id
      const owner = document.querySelector(`[aria-describedby="${tip.id}"]`);
      if (owner) hide(owner);
      else tip.remove(); // Orphan — owner no longer in DOM
    });
  }, { capture: true });
}

/* Event binding */
function bind(el) {
  const state = el._tooltip;
  const triggers = state.options?.triggers || DEFAULTS.triggers;

  state.onShow = () => show(el);
  state.onHide = () => hide(el);

  if (triggers.includes('hover')) {
    el.addEventListener('mouseenter', state.onShow);
    el.addEventListener('mouseleave', state.onHide);
  }
  if (triggers.includes('focus')) {
    el.addEventListener('focusin', state.onShow);
    el.addEventListener('focusout', state.onHide);
  }
  // Always hide on click (e.g. opening a modal)
  el.addEventListener('click', state.onHide);
  ensureGlobalClick();
}

function unbind(el) {
  const state = el._tooltip;
  if (!state || !state.onShow) return;
  el.removeEventListener('mouseenter', state.onShow);
  el.removeEventListener('mouseleave', state.onHide);
  el.removeEventListener('focusin', state.onShow);
  el.removeEventListener('focusout', state.onHide);
  el.removeEventListener('click', state.onHide);
}

/* Directive hooks */
export default {
  mounted(el, binding) {
    const opts = normalize(binding.value);
    const id = `dashy-tt-${idCounter++}`;
    el._tooltip = { options: opts, id, tooltipEl: null, visible: false };
    if (!opts) return;
    el.setAttribute('aria-describedby', id);
    bind(el);
  },

  updated(el, binding) {
    const opts = normalize(binding.value);
    const state = el._tooltip;
    if (!state) return;

    const wasEnabled = !!state.options;
    state.options = opts;

    if (!opts) {
      if (state.visible) hide(el);
      el.removeAttribute('aria-describedby');
      if (wasEnabled) unbind(el);
      return;
    }

    if (!wasEnabled) {
      el.setAttribute('aria-describedby', state.id);
      bind(el);
    }

    // Update visible tooltip content/position
    if (state.visible && state.tooltipEl) {
      const inner = state.tooltipEl.querySelector('.tooltip-inner');
      if (inner) {
        if (opts.html) {
          inner.innerHTML = DOMPurify.sanitize(opts.content);
        } else {
          inner.textContent = opts.content;
        }
      }
      positionTooltip(el, state.tooltipEl, opts.placement || DEFAULTS.placement);
    }
  },

  unmounted(el) {
    unbind(el);
    const state = el._tooltip;
    if (state) {
      clearTimeout(state.showTimer);
      clearTimeout(state.hideTimer);
      if (state.tooltipEl) state.tooltipEl.remove();
      if (state.reposition) {
        window.removeEventListener('scroll', state.reposition, { capture: true });
        window.removeEventListener('resize', state.reposition);
      }
    }
    delete el._tooltip;
  },
};
