import test from 'ava';
import { mount } from 'enzyme';

import React from 'react';
import client from 'socket.io-client';

import createDom from './helpers/dom';
import createStore from './helpers/store';
import createServer from './helpers/server';

import withSocket from '../lib/withSocket';

const port = 3000;

const dom = createDom(port);
const server = createServer(port);
const store = createStore(client);

test.after.always(() => server.close());

test('Ping Button', async t => {
  const host = `http://localhost:${port}`;

  const PingButton = withSocket(host)(props => {
    const { socket } = props;

    return <button onClick={() => socket.emit('ping')}>Ping</button>;
  });

  let wrapper;

  await new Promise(resolve => {
    wrapper = mount(
      <PingButton
        store={store}
        onMount={(dispatch, socket) => {
          socket.on('pong', latency => {
            resolve();
          });
        }}
        onConnect={(dispatch, socket) => {
          socket.emit('ping');
        }}
      />,
    );

    wrapper.find('button').simulate('click');
  });

  t.is(wrapper.text(), wrapper.text());
});
