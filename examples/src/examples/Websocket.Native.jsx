import React from 'react';

import Socket from '../lib/Websocket';

export default class Connection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      subscription: null,
      closed: true,
    };
  }
  render() {
    const {
      state: { messages, subscription, closed },
    } = this;
    return (
      <Socket
        url="ws://localhost:3000/example"
        onOpen={() => this.setState({ closed: false })}
        onClose={() => this.setState({ closed: true })}
        onMessage={event => {
          this.setState({
            messages: messages.concat(event),
          });
        }}
        onError={event => {
          console.log(event);
        }}>
        {socket => (
          <div>
            <ul>
              {React.Children.toArray(
                messages.map(
                  message => (message.data ? <li>{message.data}</li> : null),
                ),
              )}
            </ul>

            <button type="button" onClick={() => socket.send('Hey')}>
              Say Hi
            </button>

            <button type="button" onClick={() => socket.send('Error')}>
              Send Error
            </button>

            <button
              type="button"
              onClick={() =>
                subscription
                  ? this.setState({ subscription: subscription() })
                  : this.setState({
                      subscription: socket.subscribe(event =>
                        this.setState({
                          messages: messages.concat(event),
                        }),
                      ),
                    })
              }>
              {subscription ? 'Unsubscribe' : 'Subscribe'}
            </button>

            <button
              type="button"
              onClick={() => (closed ? socket.open() : socket.close())}>
              {closed ? 'Greet' : 'Say Bye'}
            </button>
          </div>
        )}
      </Socket>
    );
  }
}
