import { useSocket } from 'redux.io/react';

interface Incoming {
  greeting: (text: string) => void;
}
interface Outgoing {
  save: (text: string, ack: (id: number) => void) => void;
}

export function View() {
  const { socket } = useSocket<Incoming, Outgoing>();
  socket.emit('save', 'hello', () => {});
  socket?.emit('unknown', 'hello', () => {});
  socket?.emit('save', 42, () => {});
  socket?.emit('save', 'hello', (id: string) => id.toUpperCase());
  socket?.on('greeting', (text: number) => text.toFixed());
  useSocket('http://localhost', { autoConnect: 'yes' });
  return null;
}
