import { describe, it, expect } from 'vitest';
import {
  makePageName,
  makePageSlug,
  formatConfigPath,
  componentVisibility,
  getCustomKeyShortcuts,
} from '@/utils/config/ConfigHelpers';

describe('ConfigHelpers - makePageName', () => {
  it('converts page name to lowercase', () => {
    expect(makePageName('My Page')).toBe('my-page');
  });

  it('replaces spaces with hyphens', () => {
    expect(makePageName('Multiple Word Page')).toBe('multiple-word-page');
  });

  it('removes .yml extension', () => {
    expect(makePageName('config.yml')).toBe('config');
  });

  it('removes special characters', () => {
    expect(makePageName('Page!@#$Name')).toBe('pagename');
  });

  it('handles undefined input', () => {
    expect(makePageName(undefined)).toBe('unnamed-page');
  });

  it('handles null input', () => {
    expect(makePageName(null)).toBe('unnamed-page');
  });

  it('handles empty string', () => {
    expect(makePageName('')).toBe('unnamed-page');
  });
});

describe('ConfigHelpers - makePageSlug', () => {
  it('creates correct slug format', () => {
    expect(makePageSlug('My Page', 'home')).toBe('/home/my-page');
  });

  it('handles page names with special chars', () => {
    expect(makePageSlug('Config! Page', 'admin')).toBe('/admin/config-page');
  });
});

describe('ConfigHelpers - formatConfigPath', () => {
  it('leaves http URLs unchanged', () => {
    const url = 'https://example.com/config.yml';
    expect(formatConfigPath(url)).toBe(url);
  });

  it('adds leading slash to relative paths', () => {
    expect(formatConfigPath('config.yml')).toBe('/config.yml');
  });

  it('keeps absolute paths unchanged', () => {
    expect(formatConfigPath('/config.yml')).toBe('/config.yml');
  });
});

describe('ConfigHelpers - componentVisibility', () => {
  it('returns all visible by default when no config', () => {
    const result = componentVisibility({});
    expect(result.pageTitle).toBe(true);
    expect(result.navigation).toBe(true);
    expect(result.searchBar).toBe(true);
    expect(result.settings).toBe(true);
  });

  it('hides components based on config', () => {
    const appConfig = {
      hideComponents: {
        hideHeading: true,
        hideNav: true,
      },
    };
    const result = componentVisibility(appConfig);
    expect(result.pageTitle).toBe(false);
    expect(result.navigation).toBe(false);
    expect(result.searchBar).toBe(true);
  });

  it('handles partial config correctly', () => {
    const appConfig = {
      hideComponents: {
        hideSettings: true,
      },
    };
    const result = componentVisibility(appConfig);
    expect(result.settings).toBe(false);
    expect(result.pageTitle).toBe(true);
  });
});

describe('ConfigHelpers - getCustomKeyShortcuts', () => {
  it('extracts hotkeys from sections', () => {
    const sections = [
      {
        items: [
          { hotkey: 1, url: 'https://example.com' },
          { url: 'https://example.org' },
        ],
      },
    ];
    const result = getCustomKeyShortcuts(sections);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ hotkey: 1, url: 'https://example.com' });
  });

  it('returns empty array when no hotkeys', () => {
    const sections = [{ items: [{ url: 'https://example.com' }] }];
    expect(getCustomKeyShortcuts(sections)).toEqual([]);
  });

  it('flattens hotkeys from multiple sections', () => {
    const sections = [
      { items: [{ hotkey: 1, url: 'https://a.com' }] },
      { items: [{ hotkey: 2, url: 'https://b.com' }] },
    ];
    const result = getCustomKeyShortcuts(sections);
    expect(result).toHaveLength(2);
  });
});
