# redux.io

Redux binding for Socket.io

Currently in development.

## Installation

```bash
npm install redux.io
```

### Basic Usage:

Set it up with your store however you like:

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxIO from 'redux.io';

// if you're bundling the client:
import io from 'socket.io-client';

// or if you're having the file served:
const io = window.io;

const socket = reduxIO(io);

const reducers = combineReducers({
  ...yourOtherReducers, socket: socket.reducer
});

const middleware = applyMiddleware(
  socket.middleware, ...(thunk, logger, etc)
);

const store = createStore(reducers, middleware);
```

### API:

No assumptions are made about how socket.io is delivered to the client.
The only requirement is to pass socket.io to the redux.io constructor as the first parameter. The optional extensions parameter is a reservation for future implementation.

```javascript
import reduxIO from 'redux.io';

const socket = reduxIO(io [, extensions]);
const reducer = socket.reducer;
const middleware = socket.middleware;
```

This is the composition of the socket branch within your store state.

```javascript
const state = store.getState();
const socket = state.socket;

// if you ever want direct access to the socket.io object,
const io = socket.io;

const {
  open,
  close,
  connect,
  disconnect,
  send,
  emit,
} = socket;

// with a given namespace that you connect to, you can interface with the socket:
// socket.namespaces contains the socket instance returned by io.connect().
const sock = socket.namespaces[ns];
const abstraction = socket[ns];

const {
  open,
  close,
  destroy,
  send,
  emit,
  on,
} = abstraction;
```

Both events and acknowledgement callbacks come with dispatch, the socket abstraction and the data associated with the invocation.

```javascript
socket['/namespace'].on('event',
  function (dispatch, socket, ...data) {...});

socket['/namespace'].emit('new message', 'wassup',
  function (dispatch, socket, ...data) {...});
```

### Example

Usage with a connected React component is straightforward:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import store from './dudeWhereIsMyStore?';

class Messenger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      typing: [],
      content: '',
      whoami: '',
      handle: true
    };
    this.onTyping = this.onTyping.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount() {
    this.socket = this.props.socket.connect('/messenger');
    this.socket
      .on('newMessage', data => this.setState(state => ({
        messages: state.messages.concat(data.message)
      })))
      .on('isTyping', data => {
        const { typing, whoami } = data;
        if (this.state.typing.indexOf(whoami) >= 0) {
          if (!typing) return this.setState(state => ({
            typing: state.typing.filter(who => who !== whoami)
          }));
        }
        else if (typing) return this.setState(state => ({
          typing: state.typing.concat(whoami)
        }));
      });
  }
  componentWillUnmount() {
    this.props.socket['/messenger'].close();
  }
  onTyping(typing) {
    this.socket.emit('isTyping', { typing, whoami: this.state.whoami });
  }
  onSubmit(event) {
    event.preventDefault();
    switch (event.target.id) {
      default: this.socket.emit('sendMessage', { content: this.state.content });
      case: 'identity': return this.setState({ handle: true });
    }
  }
  onChange(event) { return this.setState({ [event.target.id]: event.target.value }); }
  render() {
    const { whoami, handle, content, messages, typing } = this.state;

    return whoami && handle ? (<div>
      <ul>{messages.map(msg => (
        <li key={msg.id}>{msg.content}</li>
      ))}</ul>
      <p>Typing: {typing.join(', ') || 'no one.'}</p>
      <form id="message" onSubmit={this.onSubmit}>
        <textarea
          id="content"
          value={content}
          onBlur={event => this.onTyping(false)}
          onFocus={event => this.onTyping(true)}
          onChange={this.onChange} />
        <button type="submit">Send</button>
      </form>
    </div>) : (<div>
      <h1>Hey there!</h1>
      <p>To start, please provide a handle to start chatting.</p>
      <form id="identity" onSubmit={this.onSubmit}>
        <input
          id="whoami"
          type="text"
          value={handle}
          onChange={this.onChange} />
        <button type="submit">Send</button>
      </form>
    </div>);
  }
}

const RealTimeMessengerApp = connect(state => state)(Messenger);

ReactDOM.render(<Provider store={store}>
  <RealTimeMessengerApp />
</Provider>, document.getElementById('root'));

```

### History:
0.1.0 - Initial Implementation.
