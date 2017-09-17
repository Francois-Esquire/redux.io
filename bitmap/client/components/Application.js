import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'redux.io';

import ChatClient from './ChatClient';

const Clicker = connect('/', { autoConnect: false })(
  ({ socket }) => (<div>
    <p>{socket.id}</p>
    <p>connected : {socket.connected ? 'true' : 'false'}</p>
    <button onClick={() => socket.connect()}>Connect</button>
    <button onClick={() => socket.close()}>Disconnect</button>
  </div>));
const Clanker = connect('/chat', { autoConnect: false })(
  ({ socket }) => (<div>
    <p>{socket.id}</p>
    <p>connected : {socket.connected ? 'true' : 'false'}</p>
    <button onClick={() => socket.connect()}>Connect</button>
    <button onClick={() => socket.close()}>Disconnect</button>
  </div>));

class Application extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
  }
  onConnect(dispatch, socket) {
    console.log('connected');
  }
  onDisconnect(dispatch, socket, reason) {
    console.log('disconnected');
  }
  render() {
    return (<main id="view">
      <header>
        <h1>
          Whats good!
        </h1>
      </header>
      {/* <Clicker autoConnect={false} onConnect={(dispatch, socket) => console.log('connected', socket)} /> */}
      <ChatClient
        transports={['polling', 'websocket']}
        onConnect={this.onConnect}
        onDisconnect={this.onDisconnect} />
    </main>);
  }
}

export default Application;
