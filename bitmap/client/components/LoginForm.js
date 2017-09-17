import React from 'react';
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
      <button type="submit">Sign Up</button>
    </form>
  </div>);
};

Login.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  handle: PropTypes.string,
};

export default Login;
