import { describe, expect, it } from 'vitest';
import {
  RESOURCE_CATALOG,
  RESOURCE_COPY,
  RESOURCE_CATEGORIES,
  filterResources,
  validateResourceCatalog,
} from './resourceCatalog.js';

describe('curated resource hub catalogue', () => {
  it('has unique IDs, HTTPS URLs, known categories and required metadata', () => {
    expect(validateResourceCatalog()).toBe(true);
    expect(new Set(RESOURCE_CATALOG.map((item) => item.id)).size).toBe(RESOURCE_CATALOG.length);
    expect(RESOURCE_CATALOG.length).toBeGreaterThanOrEqual(26);
    expect(RESOURCE_CATALOG.every((item) => item.url.startsWith('https://'))).toBe(true);
    expect(RESOURCE_CATALOG.every((item) => RESOURCE_CATEGORIES.some((category) => category.id === item.category))).toBe(true);
  });

  it('prioritizes coding tutorial and practice resources for a coding search', () => {
    const items = filterResources(RESOURCE_CATALOG, { category: 'coding' });
    const ids = items.map((item) => item.id);
    expect(ids).toContain('w3schools');
    expect(ids).toContain('geeksforgeeks');
    expect(ids).toContain('gfg-practice');
    expect(items.every((item) => item.category === 'coding')).toBe(true);
  });

  it('includes Indian open-learning sources and coding practice destinations', () => {
    const ids = new Set(RESOURCE_CATALOG.map((item) => item.id));
    for (const id of ['khan-academy-india', 'ndli', 'ignou-online', 'code-org', 'leetcode-explore', 'hackerrank-tutorials']) expect(ids.has(id)).toBe(true);
  });

  it('searches title, provider, description, level and topic metadata', () => {
    expect(filterResources(RESOURCE_CATALOG, { query: 'Python' }).some((item) => item.id === 'python-docs')).toBe(true);
    expect(filterResources(RESOURCE_CATALOG, { query: 'scholarship' }).some((item) => item.id === 'national-scholarship-portal')).toBe(true);
  });

  it('shows saved bookmarks even though saved is not an audience category', () => {
    const saved = filterResources(RESOURCE_CATALOG, { audience: 'saved', savedIds: ['w3schools', 'nptel'] });
    expect(saved.map((item) => item.id)).toEqual(['w3schools', 'nptel']);
    expect(filterResources(RESOURCE_CATALOG, { audience: 'saved', savedIds: [] })).toEqual([]);
  });

  it('combines category, query and bookmark filters consistently', () => {
    expect(filterResources(RESOURCE_CATALOG, { category: 'coding', query: 'java' }).map((item) => item.id)).toContain('dev-java');
    expect(filterResources(RESOURCE_CATALOG, { category: 'courses', audience: 'saved', savedIds: ['w3schools'] })).toEqual([]);
  });

  it('provides four complete resource-hub language dictionaries', () => {
    const keys = Object.keys(RESOURCE_COPY.en).sort();
    for (const locale of ['hi', 'ta', 'te']) {
      expect(Object.keys(RESOURCE_COPY[locale]).sort()).toEqual(keys);
      expect(RESOURCE_COPY[locale].title).toBeTruthy();
      expect(RESOURCE_COPY[locale].searchLabel).toBeTruthy();
    }
  });
});
