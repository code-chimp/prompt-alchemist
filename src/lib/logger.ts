export interface LogContext {
  source?: string;
  [key: string]: unknown;
}

interface NormalizedError {
  name: string;
  message: string;
  stack?: string;
}

type LogLevel = 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

function normalizeError(errorOrMessage: unknown, context?: LogContext): NormalizedError {
  if (errorOrMessage instanceof Error) {
    return {
      name: errorOrMessage.name,
      message: errorOrMessage.message,
      stack: errorOrMessage.stack,
    };
  }

  if (typeof errorOrMessage === 'string') {
    return {
      name: 'Error',
      message: errorOrMessage,
      stack: undefined,
    };
  }

  const fallback = new Error(String(errorOrMessage));

  if (context && !('raw' in context)) {
    context.raw = errorOrMessage;
  }

  return {
    name: fallback.name,
    message: fallback.message,
    stack: fallback.stack,
  };
}

function emitLog(
  level: LogLevel,
  message: string,
  error?: NormalizedError,
  context?: LogContext,
): void {
  const payload = {
    level,
    message,
    error,
    context,
    timestamp: new Date().toISOString(),
  };

  try {
    if (isDev || isProd) {
      (console as Console)[level]('[app]', payload);
    }

    if (isProd && typeof window !== 'undefined' && '__TAURI_IPC__' in window) {
      void (async () => {
        try {
          const { info, warn, error: pluginError } = await import('@tauri-apps/plugin-log');
          const line = JSON.stringify(payload);

          if (level === 'info') {
            info(line);
          } else if (level === 'warn') {
            warn(line);
          } else {
            pluginError(line);
          }
        } catch {
          // Ignore plugin logging errors
        }
      })();
    }
  } catch {
    // Swallow logging errors to avoid cascading failures
  }
}

export function logInfo(message: string, context?: LogContext): void {
  emitLog('info', message, undefined, context);
}

export function logWarn(message: string, context?: LogContext): void {
  emitLog('warn', message, undefined, context);
}

export function logError(errorOrMessage: unknown, context?: LogContext): void {
  const normalized = normalizeError(errorOrMessage, context);
  emitLog('error', normalized.message, normalized, context);
}
