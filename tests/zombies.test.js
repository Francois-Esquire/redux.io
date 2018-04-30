import test from 'ava';
import React from 'react';
import { mount } from 'enzyme';

import client from 'socket.io-client';

import gameServer from './scaffolds/zombie';
import ManHunt from '../examples/src/examples/ZombieLand';

import createStore from './helpers/store';
import createDom from './helpers/dom';

const port = 3004;

const dom = createDom(port);

const zombieland = gameServer(port);

test.after.always(() => zombieland.close());

const store = createStore(client);

test('zombieland:launches', async t => {
  await new Promise(resolve => {
    const Hunt = mount(
      <ManHunt
        url={`http://localhost:${port}`}
        store={store}
        onConnect={() => {
          resolve();
        }}
      />,
    );

    const event = new dom.window.KeyboardEvent('keydown', { keyCode: 39 });

    const event2 = new dom.window.KeyboardEvent('keydown', { keyCode: 39 });

    const event3 = new dom.window.KeyboardEvent('keydown', { keyCode: 40 });

    dom.window.document.body.dispatchEvent(event);
    dom.window.document.body.dispatchEvent(event2);
    dom.window.document.body.dispatchEvent(event3);
  });

  t.pass();
});
