import WebSocket from 'ws';

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
  ws.on('message', message => {
    if (message === 'Error')
      ws.send(new Error('Error'), error => console.log(error));
    else {
      console.log('received: %s', message);

      ws.send('I read you');
    }
  });

  ws.send('something');
});

export default wss;
