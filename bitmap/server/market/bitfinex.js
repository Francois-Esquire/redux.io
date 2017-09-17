const WebSocket = require('ws');

const wss = new WebSocket('wss://api.bitfinex.com/ws/2');
wss.onmessage = msg => console.log(msg.data);
wss.onopen = () => {
  // API keys setup here (See "Authenticated Channels")
  const msg = ({
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tBTCUSD',
  });

  wss.send(msg);
};
