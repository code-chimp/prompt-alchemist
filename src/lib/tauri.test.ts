import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { commands, greet, invokeCmd } from './tauri';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}));

const { invoke } = await import('@tauri-apps/api/core');
const { logError } = await import('@/lib/logger');

describe('tauri invoke helpers', () => {
  beforeEach(() => {
    (invoke as ReturnType<typeof vi.fn>).mockReset();
    (logError as ReturnType<typeof vi.fn>).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('greet calls invoke with correct command and args', async () => {
    (invoke as ReturnType<typeof vi.fn>).mockResolvedValue('Hello, Alice!');

    const result = await greet('Alice');

    expect(invoke).toHaveBeenCalledWith(commands.greet, { name: 'Alice' });
    expect(result).toBe('Hello, Alice!');
  });

  it('logs and rethrows errors from invokeCmd', async () => {
    const error = new Error('invoke failed');
    (invoke as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(invokeCmd('greet', { name: 'Bob' })).rejects.toThrowError('invoke failed');

    expect(logError).toHaveBeenCalledWith(error, {
      source: 'tauri-command',
      cmd: 'greet',
      args: { name: 'Bob' },
    });
  });

  it('logs and rethrows non-Error reasons from invokeCmd', async () => {
    (invoke as ReturnType<typeof vi.fn>).mockRejectedValue('boom');

    await expect(invokeCmd('greet', { name: 'Eve' })).rejects.toBe('boom');

    expect(logError).toHaveBeenCalledWith('boom', {
      source: 'tauri-command',
      cmd: 'greet',
      args: { name: 'Eve' },
    });
  });
});
