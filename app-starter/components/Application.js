import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const Login = ({ onSubmit, onChange, handle }) => {
  return (<div>
    <h1>Hey there!</h1>
    <p>To start, please provide a handle to start chatting.</p>
    <form id="identity" onSubmit={onSubmit}>
      <input
        id="whoami"
        type="text"
        value={handle}
        onChange={onChange} />
      <button type="submit">Send</button>
    </form>
  </div>);
};

Login.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  handle: PropTypes.string,
};

const Composer = ({ onSubmit, onChange, content }) => {
  return (<form id="message" onSubmit={onSubmit}>
    <textarea
      id="content"
      value={content}
      onBlur={event => this.onTyping(false)}
      onFocus={event => this.onTyping(true)}
      onChange={onChange} />
    <button type="submit">Send</button>
  </form>);
};

Composer.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  content: PropTypes.string,
};

const Messages = (props) => {
  return props.messages.map(msg => (<li key={msg.id}>{msg.content}</li>));
};

Messages.propTypes = {
  messages: PropTypes.array,
};

export default class Application extends PureComponent {
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
      whoami: whoami,
      handle: !!whoami,
      connected: false,
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    props.connect('/chat', { autoconnect: !!whoami });
  }
  componentWillUnmount() { this.props.socket['/chat'].close(); }
  componentWillReceiveProps(Props) {
    if (Props.channel !== this.props.channel) {
      this.setState({ channel: Props.channel },
        () => sock.emit('channel:change', Props.channel, this.props.channel, this.state.whoami));
    }
  }
  componentWillUpdate(Props, State) {
    const { whoami, handle } = State;
    if (whoami && handle) Props.socket.open('/chat');
    else Props.socket.close('/chat');
  }
  componentDidMount() {
    const { socket, channel } = this.props;
    socket['/chat'].on('connect', (dispatch, sock) => {
      sock.emit('channel', channel);
      this.setState({ connected: true });
    });
    socket['/chat'].on('disconnect', (dispatch, sock) =>
      this.setState({ connected: false }));

    socket.on('/chat', 'channel:join',
      (d, s, whoami) => this.setState(
        state => ({ party: state.party.concat(whoami) })));
    socket.on('/chat', 'channel:leave',
      (d, s, whoami) => this.setState(
        state => ({ party: state.party.filter(m => m !== whoami) })));
    socket.on('/chat', 'messages',
      (d, s, { messages }) => this.setState({ messages }));
    socket.on('/chat', 'message:new',
      (d, s, ({ message })) => this.setState(
        state => ({ messages: state.messages.concat(data.message) })));
    socket.on('/chat', 'typing', (dispatch, sock, data) => {
      const { typing, whoami } = data;
      if (this.state.typing.indexOf(whoami) >= 0) {
        if (!typing) return this.setState(state => ({
          typing: state.typing.filter(who => who !== whoami)
        }));
      }
      else if (typing) return this.setState(state => ({
        typing: state.typing.concat(whoami)
      }));
    });
  }
  sendMessage() {
    const { content, whoami, channel } = this.state;
    this.props.socket.emit('/chat', 'message:send', { whoami, content, channel });
  }
  onTyping(typing) {
    this.props.socket['/chat'].emit('typing:state', typing, this.state.whoami);
  }
  onSubmit(event) {
    event.preventDefault();
    switch (event.target.id) {
      default: this.sendMessage();
      case: 'identity': return this.setState({ handle: true },
        () => localStorage && localStorage.setItem('whoami', this.state.whoami));
    }
  }
  onChange(event) { return this.setState({ [event.target.id]: event.target.value }); }
  render() {
    const { whoami, handle, content, messages, typing } = this.state;
    return (<main id="view">{whoami && handle ? [
        <ul>{[
          <Messages messages={messages} />,
          <li>Typing: {typing.join(', ') || 'no one.'}</li>
        ]}</ul>,
        <Composer
          content={content}
          onChange={this.onChange}
          onSubmit={this.onSubmit} />
      ] : (<Login
        handle={whoami}
        onChange={this.onChange}
        onSubmit={this.onSubmit} />)
    }</main>);
  }
}

Application.propTypes = {
  channel: PropTypes.string,
  connect: PropTypes.func,
  socket: PropTypes.shape({
    io: PropTypes.shape({
      connect: PropTypes.func,
    }),
    namespaces: PropTypes.array,
    connect: PropTypes.func,
    disconnect: PropTypes.func,
    destroy: PropTypes.func,
    send: PropTypes.func,
    emit: PropTypes.func,
    on: PropTypes.func,
    once: PropTypes.func,
    off: PropTypes.func,
  }),
};
