import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            padding: 24,
            maxWidth: 640,
            margin: '40px auto',
            background: '#fff0f0',
            border: '1px solid #f88',
            borderRadius: 8,
          }}
        >
          <h1 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Something went wrong</h1>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: 13,
              overflow: 'auto',
            }}
          >
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <p style={{ marginTop: 16, fontSize: 14 }}>
            Open the browser devtools console (F12) for more detail.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
