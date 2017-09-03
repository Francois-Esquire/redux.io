import React from 'react';
import PropTypes from 'prop-types';

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

const Messenger = ({ onSubmit, onChange, content }) => {
  return (<div>
    <ul>{[
      <Messages messages={messages} />,
      <li>Typing: {typing.join(', ') || 'no one.'}</li>
    ]}</ul>
    <Composer
      content={content}
      onChange={onChange}
      onSubmit={onSubmit} />
  </div>);
};

Messenger.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  content: PropTypes.string,
};

export default Messenger;
