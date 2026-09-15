import { describe, expect, it, vi } from 'vitest';
import * as actions from '../lib/actions';
import * as types from '../lib/constants';

describe('legacy action creators', () => {
  it.each(['mount', 'dismount', 'connect', 'disconnect'])(
    '%s preserves the address',
    name => {
      expect(actions[name]('/chat', 'http://localhost/chat')).toEqual({
        type: types[name.toUpperCase()],
        nsp: '/chat',
        uri: 'http://localhost/chat',
      });
    },
  );
  it('creates with options', () => {
    expect(actions.create('/chat', { autoConnect: false })).toEqual({
      type: types.CREATE,
      nsp: '/chat',
      options: { autoConnect: false },
    });
  });
  it.each(['on', 'off', 'once'])('%s preserves listener identity', name => {
    const callback = vi.fn();
    expect(actions[name]('/chat', 'url', 'event', callback)).toEqual({
      type: types[name.toUpperCase()],
      nsp: '/chat',
      uri: 'url',
      event: 'event',
      callback,
    });
  });
  it('dispatches send and acknowledgement without mutating the payload', () => {
    const dispatch = vi.fn(action => action);
    const callback = vi.fn();
    const thunk = actions.send('/chat', 'url', 'hello', 42, callback);
    const sent = thunk(dispatch);
    expect(dispatch).toHaveBeenCalledWith(sent);
    expect(sent).toMatchObject({
      type: types.SEND,
      args: [42],
      event: 'hello',
    });
    sent.ack('ok', 1);
    expect(callback).toHaveBeenCalledWith(dispatch, 'ok', 1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: types.ACK,
      nsp: '/chat',
      uri: 'url',
      event: 'hello',
      args: ['ok', 1],
    });
    expect(thunk(dispatch).args).toEqual([42]);
  });
  it('defaults to message and supports sends without acknowledgements', () => {
    const dispatch = vi.fn(action => action);
    expect(actions.send('/chat', 'url')(dispatch)).toMatchObject({
      event: 'message',
      args: [],
      ack: undefined,
    });
  });
});
