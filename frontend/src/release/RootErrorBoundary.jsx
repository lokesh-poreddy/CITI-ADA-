import React from 'react';

/** Last-resort UI boundary. It deliberately does not transmit error details or learner content. */
export default class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error) {
    // Do not send exception payloads off-device. Local dev diagnostics remain available in the console.
    if (import.meta.env?.DEV) console.error('UdaanSetu render boundary caught an error:', error?.message || 'Unknown rendering error');
  }

  render() {
    if (this.state.failed) {
      return <main className="root-error" role="alert"><div><span className="root-error__mark">!</span><h1>Something needs a fresh start</h1><p>Your saved local pocket has not been deliberately cleared. Reload the page to try again.</p><button type="button" onClick={() => window.location.reload()}>Reload UdaanSetu</button></div></main>;
    }
    return this.props.children;
  }
}
