# redux.io

Redux / React binding for Socket.io

<!-- [![Build Status](https://travis-ci.org/Francois-Esquire/redux.io.svg?branch=master)](https://travis-ci.org/Francois-Esquire/redux.io) -->

## Installation

```bash
npm install redux.io --save
```

---

### Quick Start:

#### Making The Killer App:

/store.js

```javascript
import { createStore, combineReducers } from 'redux';

import { reducer as socket } from 'redux.io';

/* Get your reference to Socket.io. */

/* Whether you're bundling with the client: */
import io from 'socket.io-client';

/* Or if you're having the file served: */
const io = window.io;

const rootReducer = combineReducers({
  socket: socket(io),
});

const store = createStore(rootReducer);
```

/app.js

```javascript
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import { withSocket as io } from 'redux.io';

import store from './store';

// Playing in the dark.
class ZombieLand extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      players: 0,
      infected: 0,
      infectious: false,
      x: 0,
      y: 0,
    };

    this.keyUp = this.keyUp.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;

    socket
      .on('count', players => this.setState({ players }))
      .on('infected', infected => this.setState({ infected }))
      .on('infectious', infectious => this.setState({ infectious }))
      .connect();

    document.body.addEventListener('keydown', this.keyUp);
  }

  componentDidUpdate(_props, _state) {
    const { x, y } = this.state;

    if (_state.x !== x || _state.y !== y) this.move();
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.keyUp);
  }

  move() {
    const { socket } = this.props;
    const { x, y } = this.state;

    socket.emit('position', x, y);
  }

  keyUp(event) {
    event.preventDefault();

    const { keyCode } = event;

    const { x, y } = this.state;

    switch (keyCode) {
      default:
        break;
      case 37: /* Arrow Left */
      case 39: /* Arrow Right */
      case 65: /* a */
      case 68: /* d */ {
        if ([39, 68].includes(keyCode)) {
          if (x + 1 <= 100) this.setState({ x: x + 1 });
        } else if ([37, 65].includes(keyCode)) {
          if (x - 1 >= 0) this.setState({ x: x - 1 });
        }
        break;
      }
      case 38: /* Arrow Up */
      case 40: /* Arrow Down */
      case 87: /* w */
      case 83: /* s */ {
        if ([40, 83].includes(keyCode)) {
          if (y + 1 <= 100) this.setState({ y: y + 1 });
        } else if ([38, 87].includes(keyCode)) {
          if (y - 1 >= 0) this.setState({ y: y - 1 });
        }
        break;
      }
    }
  }

  render() {
    const { socket } = this.props;
    const { x, y, players, infected, infectious } = this.state;

    return socket.connected ? (
      <section>
        <header>
          <h2>Welcome To Zombie Land</h2>

          <p>Players: {players}</p>
        </header>

        <p>
          X: <span>{x}</span>, Y: <span>{y}</span>
        </p>

        <code>[PLACE GAME VIEW HERE]</code>

        <footer>
          <p>Infected: {infected}</p>
          <p>
            Are You Infected?{' '}
            {infectious ? 'EAT BRAIN...' : 'Naaa You Still Good! RUN!'}
          </p>

          <button type="button" onClick={() => socket.disconnect()}>
            Get Me Out Of Here...!
          </button>
        </footer>
      </section>
    ) : (
      <button type="button" onClick={() => socket.connect()}>
        Step Inside, But Tread Lightly..
      </button>
    );
  }
}

const ManHunt = io('/hunt', {
  autoConnect: false,
})(ZombieLand);

const Root = () => (
  <Provider store={store}>
    <ManHunt />
  </Provider>
);

render(<Root />, document.getElementById('root'));
```

#### Connect Everyone With The Back End:

/server.js

```javascript
const http = require('http');

const server = http.createServer();

server.listen(process.env.PORT, error => {
  if (error === undefined) {
    const io = require('socket.io')(server);

    const hunt = io.of('/hunt');

    const players = new Map();
    const positions = new Map();
    const infected = new Set();

    hunt.on('connect', socket => {
      players.set(socket.id, [0, 0]);

      hunt.emit('count', players.size);

      socket
        .on('position', (x, y) => {
          const coords = [x, y];

          const infectious = infected.has(socket.id);

          if (positions.has(coords)) {
            const position = positions.get(coords);

            if (infectious) {
              const victims = (position || []).filter(
                id => infected.has(id) === false,
              );

              victims.forEach(id => {
                infected.add(id);
                hunt.to(id).emit('infectious', true);
              });

              if (victims.length) hunt.emit('infected', infected.size);
            } else {
              const vermin = (position || []).filter(id => infected.has(id));

              if (vermin.length) {
                infected.add(socket.id);

                socket.emit('infectious', true);
                hunt.emit('infected', infected.size);
              }
            }

            position.push(socket.id);

            positions.set(coords, position);
          } else positions.set(coords, [socket.id]);

          const current = players.get(socket.id);
          const position = positions.get(current);

          positions.set(
            current,
            (position || []).filter(id => id !== socket.id),
          );

          players.set(socket.id, coords);
        })
        .on('disconnect', () => {
          const current = players.get(socket.id);
          const position = positions.get(current);

          if (position) {
            position.splice(position.indexOf(socket.id), 1);

            positions.set(current, position);
          }

          infected.delete(socket.id);

          players.delete(socket.id);

          hunt.emit('count', players.size);
        });
    });
  }
});
```

---

### API:

This is what comes out of the box:

```javascript
import { reducer, withSocket } from 'redux.io';
// or
const { reducer, withSocket } = require('redux.io');
```

#### reducer ( io [, defaultOptions] )

* io (socket.io)
* defaultOptions (Object)

It's up to you on how socket.io is delivered to the client.
The only requirement is to pass socket.io to the redux.io reducer as the first parameter.

The complete of options as well as the defaultOptions list can be found [here.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md#new-managerurl-options)

#### withSocket ( url [, options] ) ( Component [, wrapperConfig] )

* url (String)
* options (Object || Function (ownProps))

* Component (React element) _optional_
* wrapperConfig (object) _optional_

it's worthwhile to explore the socket.io library if you're new to it.
[check it out.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md)

---

### TODO:

* [ ] Complete Test Cases
* [ ] Complete Documentation

### History:

0.2.0 - Breaking API changes, HoC Implementation.

0.1.0 - Initial Implementation.
