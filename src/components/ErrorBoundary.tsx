import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary — catches render errors in any child component tree
 * and displays a recovery UI instead of crashing the entire app.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center' as const,
        }}>
          <div style={{
            background: '#141414',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: '#fafafa',
            }}>
              Something went wrong
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#a1a1aa',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}>
              An unexpected error occurred. You can try again or return to the dashboard.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '8px',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => { window.location.href = '/dashboard'; }}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '8px',
                  background: '#1a1a1a',
                  color: '#a1a1aa',
                  border: '1px solid #27272a',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
