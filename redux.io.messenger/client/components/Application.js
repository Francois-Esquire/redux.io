import React from 'react';
import PropTypes from 'prop-types';

import ChatClient from './ChatClient';

class Application extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
  }
  onConnect(dispatch, socket) {}
  onDisconnect(dispatch, socket, reason) {}
  render() {
    return (<main id="view">
      <ChatClient
        transports={['polling', 'websocket']}
        onConnect={this.onConnect}
        onDisconnect={this.onDisconnect} />
    </main>);
  }
}

export default Application;
