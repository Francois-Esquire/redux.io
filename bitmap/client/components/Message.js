import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
  const { by, content } = props;
  return (<article>
    <header>
      <p>{by}</p>
    </header>
    <p>{content}</p>
  </article>);
};

Message.propTypes = {
  by: PropTypes.string,
  content: PropTypes.string,
};
Message.defaultProps = {
  by: '',
  content: '',
};

export default Message;
