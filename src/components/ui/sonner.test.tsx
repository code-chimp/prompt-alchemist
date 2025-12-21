import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { Toaster } from '@/components/ui/sonner';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ theme: 'system' })),
}));

vi.mock('sonner', () => {
  const TestToaster = (props: any) => <div data-testid="sonner-toaster" {...props} />;

  return {
    Toaster: TestToaster,
  };
});

const { useTheme } = await import('next-themes');

describe('Toaster wrapper', () => {
  beforeEach(() => {
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ theme: 'dark' });
  });

  it('passes the current theme from next-themes to Sonner', () => {
    render(<Toaster />);

    const toaster = screen.getByTestId('sonner-toaster') as HTMLDivElement;

    expect(toaster).toHaveAttribute('theme', 'dark');
  });

  it('applies CSS variables for normal toast styling', () => {
    render(<Toaster />);

    const toaster = screen.getByTestId('sonner-toaster') as HTMLElement;

    expect(toaster.style.getPropertyValue('--normal-bg')).toBe('var(--popover)');
    expect(toaster.style.getPropertyValue('--normal-text')).toBe('var(--popover-foreground)');
    expect(toaster.style.getPropertyValue('--normal-border')).toBe('var(--border)');
    expect(toaster.style.getPropertyValue('--border-radius')).toBe('var(--radius)');
  });

  it('falls back to system theme when none is provided', () => {
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({});

    render(<Toaster />);

    const toaster = screen.getByTestId('sonner-toaster') as HTMLDivElement;

    expect(toaster).toHaveAttribute('theme', 'system');
  });
});
