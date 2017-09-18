# redux.io

Redux binding for Socket.io

__In Development__

### Installation

```bash
npm install redux.io --save
```

## Quick Start:

#### Getting your reference to Socket.io.

```javascript
/* Whether you're bundling with the client: */
import io from 'socket.io-client';
/* Or if you're having the file served: */
const io = window.io;
```

#### Integrating with the store.

/store.js
```javascript
import { createStore, combineReducers } from 'redux';
import { reducer as reduxIo } from 'redux.io';

const socket = reduxIo(io);

export default function configureStore(initialState) {
  const rootReducer = combineReducers({
    ...yourOtherReducers,
    socket,
  });

  return createStore(rootReducer, initialState);
}
```

#### Wrapping your React component.

/chat-box.js
```javascript
import { connect as withSocket } from 'redux.io';

import ChatClient from './chat-client.js';

const url = '/chatter';
const options = { ...options } || ownProps => ({
  transports: ['polling', 'websocket'],
  autoConnect: ownProps.autoConnect,
});

const withChatSocket = withSocket(url, options);

const ChatBox = withChatSocket(ChatClient, {
  withRef: true,
});

export default ChatBox;
```

#### Declarative usage throughout your app.

/app.js
```javascript
import React from 'react';

import ChatBox from './chat-box';

export default class App extends React.Component {
  render() {
    return (<main>
      <ChatBox
        path="/ws"
        autoConnect={false}
        onError={(dispatch, socket, error) => { ... }}
        onConnect={(dispatch, socket) => { ... }} />
    </main>);
  }
}
```

#### Consuming the socket within your wrapped component.

/chat-client.js
```javascript
import React from 'react';

export default class ChatClient extends React.Component {
  constructor(props) { ... }
  componentDidMount() {
    const { socket, channel } = this.props;

    socket.once('connect', () => {
      socket
        .on('user:join', (dispatch, ...eventData) => { ... })
        .on('user:leave', ...)
        ...
        .on('chat:message', ...)
        .on('disconnect', (dispatch, reason) => { ... });
    });
  }
  sendMessage(msg) {
    this.props.socket.emit('message:send', msg, (dispatch, ...ackData) => { ... });
  }
  render() {
    return (<div>{ ... }</div>);
  }
}
```

## API:

__Much More Detail Coming Soon__

#### Setup

It's up to you on how socket.io is delivered to the client.
The only requirement is to pass socket.io to the redux.io reducer as the first parameter.

```javascript
import { reducer as reduxIo } from 'redux.io';

const socket = reduxIo(io [, defaultOptions]);
```
#### Priming

```javascript
import PropTypes from 'prop-types';
import { connect } from 'redux.io';

const options = (ownProps) => ({});

const withSocketPrimer = connect(uri [, options]);
```
connect  is the equivalent to:
```javascript
io.connect(uri, options);
```

The complete of options as well as the defaultOptions list can be found [here.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md#new-managerurl-options)

```javascript
 const HoCOptions = {
   withRef: false,
   alias: 'withSocket',
 };

const WithSocketHoC = withSocketPrimer(Component [, HoCOptions]);

WithSocketHoC.propTypes = { ... };
```

If you ever need direct access to the socket.io global:
it's worthwhile to explore the socket.io library if you're new to it.
[check it out.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md)

## TODO

- [ ] Finalize 0.2.0 API Implementation
- [ ] Finish Test Cases
- [ ] Complete Documentation
- [ ] Bitmap Example Project

__PRs Are Welcome__

## Development:

To start the project with the test runner, while watching for changes:

```bash
npm run dev
```

To build the project source:

```bash
npm run build
```

## History:

0.2.0 - Breaking API changes, HoC Implementation.

0.1.0 - Initial Implementation.
