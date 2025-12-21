import type React from 'react';
import { Component } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logError } from '@/lib/logger';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode);
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logError(error, {
      source: 'react-boundary',
      componentStack: info.componentStack,
    });
  }

  private renderDefaultFallback(): React.ReactNode {
    const { error } = this.state;

    return (
      <main className="bg-background flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              The application encountered an unexpected error.
            </p>
            {import.meta.env.DEV && error ? (
              <pre className="bg-muted mt-3 max-h-40 overflow-auto rounded p-2 text-xs">
                {error.message}
              </pre>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => window.location.reload()}>
              Reload app
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const error = this.state.error ?? new Error('Unknown error');

      if (typeof fallback === 'function') {
        return fallback(error);
      }

      if (fallback) {
        return fallback;
      }

      return this.renderDefaultFallback();
    }

    return this.props.children;
  }
}
