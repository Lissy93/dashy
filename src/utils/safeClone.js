/* Deep-clone that tolerates reactive proxies. `structuredClone` throws
 * `DataCloneError` on Vue's proxies in some browsers (Firefox); JSON
 * round-trip is a safe fallback for plain JSON-shaped data. */
import ErrorHandler from '@/utils/logging/ErrorHandler';

export default function safeClone(val, fallback = null) {
  if (val == null) return fallback;
  try {
    return structuredClone(val);
  } catch {
    try {
      return JSON.parse(JSON.stringify(val));
    } catch (e) {
      ErrorHandler('safeClone failed', e);
      return fallback ?? (Array.isArray(val) ? [] : {});
    }
  }
}
