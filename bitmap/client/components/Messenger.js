import React from 'react';
import PropTypes from 'prop-types';

const Composer = ({ onSubmit, onChange, onTyping, content }) => (<form id="message" onSubmit={onSubmit}>
  <textarea
    id="content"
    value={content}
    onBlur={() => onTyping(false)}
    onFocus={() => onTyping(true)}
    onChange={onChange} />
  <button type="submit">Send</button>
</form>);

Composer.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onTyping: PropTypes.func,
  content: PropTypes.string,
};

Composer.defaultProps = {
  onSubmit: () => undefined,
  onChange: () => undefined,
  onTyping: () => undefined,
  content: '',
};

const Messages = (props) => {
  const { messages } = props;
  return <ul>{
    messages.map(msg => (<li key={msg.id}>{msg.content}</li>)) || null
  }</ul>;
};

Messages.propTypes = {
  messages: PropTypes.array,
};

const Messenger = (props) => {
  const { onSubmit, onChange, onTyping, content, messages, typing } = props;
  return (<div>
    <Messages messages={messages} />
    <p>Typing: {typing.join(', ') || 'no one.'}</p>
    <Composer
      content={content}
      onTyping={onTyping}
      onChange={onChange}
      onSubmit={onSubmit} />
  </div>);
};

Messenger.propTypes = Object.assign({
  typing: PropTypes.array,
}, Composer.propTypes, Messages.propTypes);

export default Messenger;
