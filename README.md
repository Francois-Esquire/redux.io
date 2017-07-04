# redux.io

Redux binding for Socket.io

### Installation

```bash
npm install redux.io --save
```

## Usage Example:

### Integrating with your app.

/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider,
  connect
} from 'react-redux';
import {
  createStore,
  combineReducers,
  applyMiddleware,
  bindActionCreators
} from 'redux';

//
import reduxIO, { connect as connectSocket } from 'redux.io';

// if you're bundling the client:
import io from 'socket.io-client';
// or if you're having the file served:
const io = window.io;

const socket = reduxIO(io);

const reducers = combineReducers({
  ...yourOtherReducers,
  socket: socket.reducer,
});

const middleware = applyMiddleware(
  socket.middleware,
  ...(thunk, etc)
);

const store = createStore(reducers, middleware);

const RealTimeMessenger = connect(
  (state, ownProps) => Object.assign({}, state, ownProps),
  dispatch => bindActionCreators({
    // bind dispatch to the connectSocket
    connect: connectSocket,
  }, dispatch)
)(..Application);

ReactDOM.render(<Provider store={store}>
  <RealTimeMessenger />
</Provider>, document.getElementById('root'));
```

#### Consumption using React.

/components/app.js
```javascript
import React from 'react';

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {...};

    props.connect('/chat', { autoconnect: false });
  }
  componentWillUnmount() { this.props.socket['/chat'].close(); }
  componentWillReceiveProps(Props) {
    if (Props.channel !== this.props.channel) {
      this.setState({ channel: Props.channel },
        () => sock.emit('channel:change',
        Props.channel,
        this.props.channel,
        this.state.whoami));
    }
  }
  componentWillUpdate(Props, State) {
    const { whoami, handle } = State;
    if (whoami && handle) Props.socket.open('/chat');
    else Props.socket.close('/chat');
  }
  componentDidMount() {
    const { socket, channel } = this.props;

    // once connect is called, a socket connection is available on the socket object
    // you can access the socket abstraction by selecting it by its namespace
    socket['/chat'].on('connect', (dispatch, sock) => {
      // in the occurrence of an event, the callback will contain:
      // dispatch, the socket abstraction and any data passed to the event.

      // when emitting or sending messages, it carries the same usage behavior as expected.
      sock.emit('channel', channel);
      this.setState({ connected: true });
    });

    socket['/chat'].on('disconnect', (dispatch, sock) =>
      this.setState({ connected: false }));

    // alternatively, you can interface with your socket connection using the top level helpers.
    // The only addition is the namespace as the first argument.
    socket.on('/chat', 'channel:join',
      (d, s, whoami) => this.setState(
        state => ({ party: state.party.concat(whoami) })));

    socket.on('/chat', 'channel:leave',
      (d, s, whoami) => this.setState(
        state => ({ party: state.party.filter(m => m !== whoami) })));

    socket.on('/chat', 'message:new',
      (d, s, ({ message })) => this.setState(
        state => ({ messages: state.messages.concat(data.message) })));

    socket.on('/chat', 'typing', (dispatch, sock, data) => {
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
  sendMessage() {
    const { content, whoami, channel } = this.state;
    this.props.socket.emit('/chat', 'message:send',
      { whoami, content, channel }, (dispatch, sock, data) => {
      // by socket.io convention, acknowledgements (acks) are passed a function
      // as the last parameter to an emit/send call.
      // acks, just like events, are considered the same and passed the same arguments.

      return this.setState(
        state => ({ messages: state.messages.concat(data.message) }));
    });
  }
  onTyping(typing) {
    this.props.socket['/chat'].emit('typing:state', typing, this.state.whoami);
  }
  onSubmit(event) {
    event.preventDefault();
    switch (event.target.id) {
      default: this.sendMessage();
      case: 'identity': return this.setState({ handle: true },
        () => localStorage && localStorage.setItem('whoami', this.state.whoami));
    }
  }
  render() {
    return (<div>{ ... }</div>);
  }
}
```
The full example can be found within /app-starter.

## API:

No assumptions are made about how socket.io is delivered to the client.
The only requirement is to pass socket.io to the redux.io constructor as the first parameter. The optional extensions parameter is reserved for future implementation.

```javascript
import reduxIO, { connect as connectSocket } from 'redux.io';

const socket = reduxIO(io [, extensions]);

const reducer = socket.reducer;
const middleware = socket.middleware;

const connectIO = (url [, options]) => dispatch(connectSocket(url, options));
```

The complete options list can be found [here.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md#new-managerurl-options)

#### Socket Anatomy

```javascript
const state = store.getState();
const socket = state.socket;
```

If you ever need direct access to the socket.io global:
it's worthwhile to explore the socket.io library if you're new to it.
[check it out.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md)

```javascript
const io = socket.io;

// use as you normally would:
// note - this eclipses any association with the store.

const home = io.connect('/', { autoConnect: false });
home.open();
```

```javascript
// with a given namespace that you connect to, you can interface with the socket:
// socket.namespaces contains the socket instance returned by io.connect().
const sock = socket.namespaces[ns];

// the remaining properties are top layer methods to perform on your namespaced connections.
// the first parameter for each of theses methods is the namespace = '/chat' || '/' - default.
const {
  connect,
  disconnect,
  destroy,
  send,
  emit,
  on,
  once,
  off,
} = socket;
```

#### Socket Abstraction
Whenever you connect to a namespace, an abstraction is created to drive home the core utility of the socket.
All the calls are intercepted by the middleware, where it operates on the actual socket.io Socket instance.

```javascript
const abstraction = socket[ns];
const {
  id,
  open,
  close,
  destroy,
  send,
  emit,
  on,
  once,
  off,
} = abstraction;
```

Both events and acknowledgement callbacks come with dispatch, the socket abstraction and the respective data passed with the invocation.

```javascript
socket['/namespace'].send('a message for my peeps',
  ['with', props.message, 'or'], 011001,
  function (dispatch, socket, ...data) {...});

socket['/namespace'].emit('message:new', 'wassup',
  function (dispatch, socket, ...data) {...});

socket['/namespace'].on('event',
  function (dispatch, socket, ...data) {...});

socket['/namespace'].once('connect',
  function (dispatch, socket) {
    return socket['/namespace'].emit('authentication', session.token);
  });
```

Conversely, you can detach listeners.

```javascript
socket['/namespace'].off('same.event', fn);
```

### History:
0.1.0 - Initial Implementation.
