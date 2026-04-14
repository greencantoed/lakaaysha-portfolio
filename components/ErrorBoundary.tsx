import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
          <p className="text-jelly-accent text-[11px] uppercase tracking-[0.2em] font-semibold mb-6">
            Something went wrong
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-jelly-text leading-[0.95] mb-6">
            An unexpected error occurred.
          </h1>
          <p className="text-sm text-jelly-muted mb-8 max-w-md">
            Try refreshing the page. If the problem persists, return to the home page.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center border border-jelly-accent bg-jelly-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-jelly-accent-2"
            >
              Refresh Page
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center justify-center border border-jelly-line px-6 py-3 text-xs uppercase tracking-[0.16em] text-jelly-text transition-colors hover:border-jelly-accent hover:text-jelly-accent"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
