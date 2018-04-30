import React from 'react';
import { Switch, Route, NavLink, withRouter } from 'react-router-dom';

import Home from './Home';
// import Zombies from '../examples/Zombie.io';
import Zombies from '../examples/ZombieLand';
import Websocket from '../examples/Websocket.Native';

function RootLayer({ children }) {
  return (
    <>
      {children}
      <main>
        <header>
          <h1>redux.io</h1>

          <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/zombies">Zombies</NavLink>
          </nav>
        </header>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/zombies" component={Zombies} />
          <Route path="/websocket" component={Websocket} />
        </Switch>
      </main>
    </>
  );
}

const Root = withRouter(RootLayer);

export default class Application extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    console.error(error, errorInfo);
  }

  render() {
    const {
      state: { error },
    } = this;

    return <Root>{error ? <p>there was an error: {error}</p> : null}</Root>;
  }
}
