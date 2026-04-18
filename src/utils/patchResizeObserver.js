/* Patch `ResizeObserver.prototype.unobserve` to no-op on non-Element args.
 * Works around @febe95/vue-js-modal@3.2.0 passing a stale/null ref during
 * component unmount. Safe to apply globally: `unobserve(null)` has no valid use. */
if (typeof ResizeObserver !== 'undefined') {
  const original = ResizeObserver.prototype.unobserve;
  ResizeObserver.prototype.unobserve = function unobserve(target) {
    if (target instanceof Element) return original.call(this, target);
    return undefined;
  };
}
