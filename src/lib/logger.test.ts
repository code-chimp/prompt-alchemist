import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { logError, logInfo, logWarn, type LogContext } from './logger';

const originalConsole = globalThis.console;

describe('logger', () => {
  let consoleInfo: ReturnType<typeof vi.fn>;
  let consoleWarn: ReturnType<typeof vi.fn>;
  let consoleError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    consoleInfo = vi.fn();
    consoleWarn = vi.fn();
    consoleError = vi.fn();

    globalThis.console = {
      ...originalConsole,
      info: consoleInfo as unknown as Console['info'],
      warn: consoleWarn as unknown as Console['warn'],
      error: consoleError as unknown as Console['error'],
    } as Console;
  });

  afterEach(() => {
    globalThis.console = originalConsole;
    vi.clearAllMocks();
  });

  it('logs info messages with context', () => {
    const context: LogContext = { source: 'test', foo: 'bar' };

    logInfo('hello', context);

    expect(consoleInfo).toHaveBeenCalledTimes(1);
    const [, payload] = consoleInfo.mock.calls[0] ?? [];
    expect(payload.level).toBe('info');
    expect(payload.message).toBe('hello');
    expect(payload.context).toMatchObject(context);
  });

  it('logs warnings with logWarn', () => {
    const context: LogContext = { source: 'warn-test' };

    logWarn('watch out', context);

    expect(consoleWarn).toHaveBeenCalledTimes(1);
    const [, payload] = consoleWarn.mock.calls[0] ?? [];
    expect(payload.level).toBe('warn');
    expect(payload.message).toBe('watch out');
    expect(payload.context).toMatchObject(context);
  });

  it('normalizes Error objects in logError', () => {
    const error = new Error('boom');

    logError(error, { source: 'test' });

    expect(consoleError).toHaveBeenCalledTimes(1);
    const [, payload] = consoleError.mock.calls[0] ?? [];
    expect(payload.level).toBe('error');
    expect(payload.error).toMatchObject({
      name: 'Error',
      message: 'boom',
    });
  });

  it('normalizes string messages in logError', () => {
    logError('oops');

    expect(consoleError).toHaveBeenCalledTimes(1);
    const [, payload] = consoleError.mock.calls[0] ?? [];
    expect(payload.level).toBe('error');
    expect(payload.error).toMatchObject({
      name: 'Error',
      message: 'oops',
    });
  });

  it('normalizes non-error values and attaches raw to context', () => {
    const context: LogContext = { source: 'non-error' };

    logError({ foo: 'bar' }, context);

    expect(consoleError).toHaveBeenCalledTimes(1);
    const [, payload] = consoleError.mock.calls[0] ?? [];
    expect(payload.error?.name).toBe('Error');
    expect(payload.context).toMatchObject({ source: 'non-error', raw: { foo: 'bar' } });
  });

  it('does not overwrite existing raw on context', () => {
    const context: LogContext = { source: 'context', raw: 'keep-me' };

    logError({ foo: 'bar' }, context);

    expect(consoleError).toHaveBeenCalledTimes(1);
    const [, payload] = consoleError.mock.calls[0] ?? [];
    expect(payload.context).toMatchObject({ source: 'context', raw: 'keep-me' });
  });
});
