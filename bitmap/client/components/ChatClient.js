import React from 'react';
import PropTypes from 'prop-types';

import { connect as withSocket } from 'redux.io';

import LoginForm from './LoginForm';
import Messenger from './Messenger';

class ChatClient extends React.PureComponent {
  constructor(props) {
    super(props);

    const whoami = localStorage !== undefined ?
      localStorage.getItem('whoami') : '';

    this.state = {
      messages: [],
      party: [],
      typing: [],
      channel: props.channel || '',
      content: '',
      whoami: whoami || '',
      handle: !!whoami,
      connected: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    const socket = this.props.socket;
    const { channel } = this.state;

    socket
      .on('connect', () => socket.emit('channel', channel))
      .on('channel:join', (dispatch, whoami) =>
        this.setState(state => ({ party: state.party.concat(whoami) })))
      .on('channel:leave', (dispatch, whoami) =>
        this.setState(state => { party: state.party.filter(m => m !== whoami) }))
      .on('messages', (dispatch, { messages }) =>
        this.setState({ messages }))
      .on('messages:new', (dispatch) =>
        this.setState(state => ({ messages: state.messages.concat(data.message) })))
      .on('typing', (dispatch, { typing, whoami }) =>
        this.setState(state => {
          if (this.state.typing.indexOf(whoami) >= 0) {
            if (!typing) return { typing: state.typing.filter(who => who !== whoami) };
          } else if (typing) return { typing: state.typing.concat(whoami) };
        }));
  }
  onChange(event) {
    const { id, value } = event.target;
    return this.setState({ [id]: value });
  }
  onSubmit(event) {
    event.preventDefault();
    switch (event.target.id) {
      default: this.sendMessage();
      case 'identity': return this.setState({ handle: true },
        () => localStorage && localStorage.setItem('whoami', this.state.whoami));
    }
  }
  onTyping(typing) {
    this.props.socket.emit('typing:state', typing, this.state.whoami);
  }
  sendMessage() {
    const { content, whoami, channel } = this.state;
    console.log('sending Message');
    this.props.socket.emit('message:send', { whoami, content, channel }, (dispatch, { message }) =>
      this.setState(({ messages }) => ({ messages: messages.concat(message) })));
  }
  render() {
    const { whoami, handle, content, messages, typing, party, channel } = this.state;
    const socket = this.props.socket;

    return (<main id="view">
      <header>
        <button
          onClick={() => socket.connected ? socket.close() : socket.open()}>{
            socket.connected ? 'Disconnect' : 'Connect'
          }</button>
      </header>
      <section>{whoami && handle ? (<Messenger
        channel={channel}
        party={party}
        typing={typing}
        messages={messages}
        content={content}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        onTyping={this.onTyping} />) : (<LoginForm
          handle={whoami}
          onChange={this.onChange}
          onSubmit={this.onSubmit} />)
      }</section>
    </main>);
  }
}

const Chat = withSocket('/chat')(ChatClient);

Chat.propTypes = {
  socket: PropTypes.shape({
    io: PropTypes.shape({
      connect: PropTypes.func,
    }),
    namespaces: PropTypes.array,
  }),
};

export default Chat;
