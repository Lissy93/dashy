import { describe, it, expect } from 'vitest';

describe('ErrorHandler', () => {
  it('exports InfoKeys constants', async () => {
    const { InfoKeys } = await import('@/utils/logging/ErrorHandler');
    expect(InfoKeys.AUTH).toBe('Authentication');
    expect(InfoKeys.CLOUD_BACKUP).toBe('Cloud Backup & Restore');
    expect(InfoKeys.EDITOR).toBe('Interactive Editor');
    expect(InfoKeys.RAW_EDITOR).toBe('Raw Config Editor');
    expect(InfoKeys.VISUAL).toBe('Layout & Styles');
  });

  it('exports handler functions', async () => {
    const handlers = await import('@/utils/logging/ErrorHandler');
    expect(typeof handlers.ErrorHandler).toBe('function');
    expect(typeof handlers.InfoHandler).toBe('function');
    expect(typeof handlers.WarningInfoHandler).toBe('function');
  });

  it('ErrorHandler can be called without throwing', async () => {
    const { ErrorHandler } = await import('@/utils/logging/ErrorHandler');
    expect(() => ErrorHandler('Test error')).not.toThrow();
  });
});
