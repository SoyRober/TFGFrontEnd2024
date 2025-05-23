import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          backgroundColor: '#fff3f3',
          color: '#b30000',
          border: '1px solid #ffa1a1',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '3rem auto',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '1.5rem' }}>💥 Something went wrong with this</h1>
          <p>There was a problem loading this section of the app</p>
          <pre style={{
            background: '#ffecec',
            padding: '1rem',
            borderRadius: '4px',
            overflowX: 'auto',
            fontSize: '0.85rem'
          }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
