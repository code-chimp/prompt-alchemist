/**
 * Tests for ThemeToggle component
 */

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { useThemeStore } from '../stores/themeStore';

import { ThemeToggle } from './ThemeToggle';

// Reset theme store before each test
beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('should render a button', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    const initialTheme = useThemeStore.getState().theme;

    await user.click(button);

    const newTheme = useThemeStore.getState().theme;
    expect(newTheme).not.toBe(initialTheme);
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole('button');

    // Tab to button
    await user.tab();
    expect(button).toHaveFocus();

    // Press Enter
    const initialTheme = useThemeStore.getState().theme;
    await user.keyboard('{Enter}');

    const newTheme = useThemeStore.getState().theme;
    expect(newTheme).not.toBe(initialTheme);
  });

  it('should support Space key', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.tab();
    const initialTheme = useThemeStore.getState().theme;

    await user.keyboard(' ');

    const newTheme = useThemeStore.getState().theme;
    expect(newTheme).not.toBe(initialTheme);
  });

  it('should have proper ARIA attributes', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('type', 'button');
  });
});
