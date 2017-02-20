'use strict';

import React, { PureComponent, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { push, replace, go, goForward, goBack } from 'react-router-redux';
import { connect, Provider } from 'react-redux';
import { bindActionCreators } from 'redux';

class Application extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {};
  }

  render () {
    const { props, state } = this;
    const { children, grandChildren = children.props.children } = props;

    return (<main id="main" role="main" ref={m => m ? this.main = m : null}>
      <header className="navigator" id="nav">
        <h1>redux.io</h1>
      </header>
      <section className="main-content">{
        children ? React.cloneElement(props.children, {

        }) : null
      }</section>
      <footer>
        <h6>{`redux.io`}</h6>
      </footer>
    </main>);
  }
}

Application.propTypes = {
  children: PropTypes.element,
  history: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  route: PropTypes.object,
  routes: PropTypes.array,
  routeParams: PropTypes.object,
  routing: PropTypes.object,
  router: PropTypes.object
};

Application.defaultProps = {};

const App = connect(
  function mapStateToProps (state, ownProps) {
    return { ...ownProps, ...state };
  },
  function mapDispatchToProps (dispatch) {
    return {
      router: bindActionCreators({
         push, replace, go, goForward, goBack
      }, dispatch)
    };
  },
  function mergeProps (stateProps, dispatchers) {
    return { ...Object.keys(dispatchers).reduce((a,b) => {
      return a[b] ? { ...a, [b]: { ...a[b], ...dispatchers[b]} } : { ...a, [b]: dispatchers[b] };
    }, { ...stateProps }) };
  }, { pure: true, withRef: false }
)(Application);

const Dashboard = props => {
  const {  } = props;
  return (<div>welcome home</div>);
};

const Root = ({ store, history = browserHistory }) => (
  <Provider store={store}>
    <Router history={history} createElement={(Component, props) => <Component {...props}/>}>
      <Route path="/" component={App}>
        <IndexRoute component={Dashboard} />
        <Route path=":room" />
      </Route>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;
