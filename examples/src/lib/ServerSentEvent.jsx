import React from 'react';
import PropTypes from 'prop-types';

export default class ServerSentEvent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      stream: null,
    };

    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
  }

  onOpen() {
    this.setState({ connected: true });
  }

  onError() {
    this.setState({ connected: false });
  }
  
  onMessage(event) {
    console.log(event);

    if (this.props.onMessage) this.props.onMessage(event);
  }

  initialize() {
    const { url } = this.props;

    const sse = new EventSource(url);

    sse.onopen = this.onOpen;
    sse.onmessage = this.onMessage;
    sse.onerror = this.onError;

    this.setState({ stream: sse });
  }

  render() {
    const {
      state: { connected, stream },
      props: { children },
    } = this;

    const payload = {
      connected,
      stream,
    };

    return typeof children === 'function'
      ? children(payload)
      : React.cloneElement(children, payload);
  }
}

ServerSentEvent.propTypes = {
  url: PropTypes.string.isRequired,
  onMessage: PropTypes.func,
};

ServerSentEvent.defaultProps = {
  onMessage: undefined,
};
