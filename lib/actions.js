import CONSTANTS from './constants';

const [
  CONNECT,
  LISTEN,
  EVENT,
  EMIT,
  OPEN,
  CLOSE,
  DESTROY,
  DISCONNECT,
  ACKNOWLEDGE,
  INITIALIZED
] = CONSTANTS;

function dispatchAction(type, ns, o) {
  return { type, ns, ...o };
}

const connect = (ns, options) => dispatchAction(CONNECT, ns, { options });

export { connect };
