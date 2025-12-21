import { render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AppErrorBoundary } from './AppErrorBoundary';

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}));

const { logError } = await import('@/lib/logger');

function ThrowingComponent(): JSX.Element {
  throw new Error('test error');
}

describe('AppErrorBoundary', () => {
  beforeEach(() => {
    (logError as ReturnType<typeof vi.fn>).mockClear();
  });

  it('renders children when there is no error', () => {
    render(
      <AppErrorBoundary>
        <div>ok</div>
      </AppErrorBoundary>,
    );

    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('renders fallback UI and logs error when child throws', () => {
    render(
      <AppErrorBoundary>
        <ThrowingComponent />
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(logError).toHaveBeenCalledTimes(1);
  });

  it('renders custom fallback when provided as function', () => {
    render(
      <AppErrorBoundary fallback={error => <div>Custom: {error.message}</div>}>
        <ThrowingComponent />
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Custom: test error')).toBeInTheDocument();
  });

  it('renders custom fallback node when provided', () => {
    render(
      <AppErrorBoundary fallback={<div>Static fallback</div>}>
        <ThrowingComponent />
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Static fallback')).toBeInTheDocument();
  });
});
