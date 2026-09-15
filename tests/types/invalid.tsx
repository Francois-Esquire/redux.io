import React from 'react';
import { withSocket, type SocketInterface, type SocketProps } from 'redux.io';

interface Incoming {
  greeting: (message: string) => void;
}
interface Outgoing {
  save: (value: number, acknowledge: (result: { id: string }) => void) => void;
}
declare const socket: SocketInterface<Incoming, Outgoing>;
socket.emit('unknown', 1, () => {});
socket.emit('save', 'wrong', () => {});
socket.emit('save', 1, (result: number) => result.toFixed());
socket.on('greeting', (message: number) => message.toFixed());
socket.send('not declared');
function View(_props: SocketProps<Incoming, Outgoing> & { title: string }) {
  return null;
}
const Connected = withSocket<Incoming, Outgoing>()(View);
export const missing = <Connected />;
export const injected = <Connected title="hello" socket={socket} />;
