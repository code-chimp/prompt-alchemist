import { invoke } from '@tauri-apps/api/core';

import { logError } from '@/lib/logger';

// Centralized command names to avoid typos and enable discoverability
export const commands = {
  greet: 'greet',
} as const;

type CommandName = (typeof commands)[keyof typeof commands];

// Generic invoke wrapper with light typing and one place for error handling/logging
async function invokeCmd<T>(cmd: CommandName, args?: Record<string, unknown>): Promise<T> {
  try {
    return await invoke<T>(cmd, args);
  } catch (error) {
    logError(error, {
      source: 'tauri-command',
      cmd,
      args,
    });
    throw error;
  }
}

// Typed wrappers for each Tauri command
export async function greet(name: string): Promise<string> {
  return invokeCmd<string>(commands.greet, { name });
}

// Re-export utility if consumers want to add more commands elsewhere
export { invokeCmd };
