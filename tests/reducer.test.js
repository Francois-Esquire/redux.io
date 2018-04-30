import test from 'ava';

import client from 'socket.io-client';

import {
  CREATE,
  MOUNT,
  DISMOUNT,
  CONNECT,
  DISCONNECT,
  SEND,
  ACK,
  ON,
  OFF,
  ONCE,
} from '../lib/constants';

import * as actionCreators from '../lib/actions';

import createStore from './helpers/store';

const store = createStore(client);

test.todo(`ACTION: ${CREATE}`);
test.todo(`ACTION: ${MOUNT}`);
test.todo(`ACTION: ${DISMOUNT}`);
test.todo(`ACTION: ${CONNECT}`);
test.todo(`ACTION: ${DISCONNECT}`);
test.todo(`ACTION: ${SEND}`);
test.todo(`ACTION: ${ACK}`);
test.todo(`ACTION: ${ON}`);
test.todo(`ACTION: ${OFF}`);
test.todo(`ACTION: ${ONCE}`);
