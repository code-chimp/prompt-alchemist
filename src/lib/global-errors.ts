import { logError } from '@/lib/logger';

let handlersInstalled = false;

function setupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (handlersInstalled) {
    return;
  }

  window.addEventListener('error', event => {
    logError(event.error ?? event.message, {
      source: 'window',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', event => {
    logError(event.reason, {
      source: 'unhandledrejection',
    });
  });

  handlersInstalled = true;
}

setupGlobalErrorHandlers();
