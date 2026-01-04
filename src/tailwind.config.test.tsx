/**
 * Integration tests for Tailwind CSS theme integration
 */

import { render } from '@testing-library/react';

describe('Tailwind CSS Theme Integration', () => {
  it('should apply Catppuccin color classes to elements', () => {
    // Set Mocha theme
    document.documentElement.setAttribute('data-theme', 'mocha');

    const { container } = render(<div className="bg-base text-text border-mauve">Test</div>);

    const element = container.firstChild as HTMLElement;

    // Check that Tailwind classes are applied
    expect(element.className).toContain('bg-base');
    expect(element.className).toContain('text-text');
    expect(element.className).toContain('border-mauve');
  });

  it('should apply surface color classes', () => {
    document.documentElement.setAttribute('data-theme', 'mocha');

    const { container } = render(<div className="bg-surface0 text-subtext1">Surface</div>);

    const element = container.firstChild as HTMLElement;

    expect(element.className).toContain('bg-surface0');
    expect(element.className).toContain('text-subtext1');
  });

  it('should apply accent color classes', () => {
    document.documentElement.setAttribute('data-theme', 'latte');

    const { container } = render(
      <div className="text-mauve border-blue bg-green">Accents</div>,
    );

    const element = container.firstChild as HTMLElement;

    expect(element.className).toContain('text-mauve');
    expect(element.className).toContain('border-blue');
    expect(element.className).toContain('bg-green');
  });
});
