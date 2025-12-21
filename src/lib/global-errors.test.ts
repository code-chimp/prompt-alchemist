import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}));

const { logError } = await import('@/lib/logger');

// Import side-effect module after mocking logger
await import('./global-errors');

describe('global-errors', () => {
  beforeEach(() => {
    (logError as ReturnType<typeof vi.fn>).mockClear();
  });

  it('logs window errors', () => {
    const error = new Error('window boom');
    const event = new ErrorEvent('error', { error, message: error.message });

    window.dispatchEvent(event);

    expect(logError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        source: 'window',
      }),
    );
  });

  it('logs unhandled promise rejections', () => {
    const reason = new Error('unhandled');
    const promise = Promise.resolve();
    const event = new PromiseRejectionEvent('unhandledrejection', {
      promise,
      reason,
    });

    window.dispatchEvent(event);

    expect(logError).toHaveBeenCalledWith(
      reason,
      expect.objectContaining({
        source: 'unhandledrejection',
      }),
    );
  });
});
