import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
// import PropTypes from 'prop-types';

import { connect as withSocket } from 'redux.io';

const Register = (props) => {
  const { handleSubmit } = props;
  return (<section>
    <form onSubmit={handleSubmit}>
      <Field component="input" type="text" />
      <button type="submit">Register</button>
    </form>
  </section>);
};

Register.propTypes = {
};

export default compose(
  reduxForm({
    form: 'register',
  }),
  withSocket())(Register);
