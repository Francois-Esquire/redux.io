# redux.io

[![npm](https://img.shields.io/npm/v/redux.io.svg)](https://www.npmjs.com/package/redux.io)
[![Build Status](https://travis-ci.org/Francois-Esquire/redux.io.svg?branch=master)](https://travis-ci.org/Francois-Esquire/redux.io)

Redux / React binding for Socket.io

**This Is Still Alpha :exclamation:**

Please do not use in production. There are many moving parts missing.

---

## Installation

```bash
npm install redux.io --save
```

### Usage

**An Example Can Be Found [Here](examples/README.md)**

This is what comes out of the box:

```javascript
import { reducer, withSocket } from 'redux.io';
// or
const { reducer, withSocket } = require('redux.io');
```

**reducer ( io _[, defaultOptions]_ )**

* io (socket.io)
* defaultOptions (Object)

It's up to you on how socket.io is delivered to the client.
The only requirement is to pass socket.io to the redux.io reducer as the first parameter.

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

The complete of options as well as the defaultOptions list can be found [here.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md#new-managerurl-options)

**withSocket ( url _[, options]_ ) ( Component _[, wrapperConfig]_ )**

* url (String)
* options (Object || Function (ownProps))

* Component (React element) _optional_
* wrapperConfig (object) _optional_

it's worthwhile to explore the socket.io library if you're new to it.
[check it out.](https://github.com/socketio/socket.io-client/blob/master/docs/API.md)

---

**TODO:**

* [ ] Complete Test Cases
* [ ] Complete Documentation

**History:**

* 0.2.0 - Breaking API changes, HoC Implementation.

* 0.1.0 - Initial Implementation.

**License**

MIT
