import { describe, it, expect } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges simple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    const showBar = false;

    expect(cn('foo', showBar && 'bar', undefined, null as unknown as string)).toBe('foo');
  });

  it('handles arrays and objects', () => {
    expect(cn(['foo', 'bar'], { baz: true, qux: false })).toBe('foo bar baz');
  });

  it('applies tailwind-merge semantics for conflicting classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
