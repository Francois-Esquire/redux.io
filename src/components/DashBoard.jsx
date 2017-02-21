import React, { PureComponent, PropTypes } from 'react';

export default class DashBoard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ns: '/',
      type: 'method',
      name: 'user',
      action: 'authenticate',
      data: { message: 'from react, to io.' },
      response: null
    };

    this.NameSpace = this.NameSpace.bind(this);
  }

  render() {
    const { props, state, NameSpace } = this;
    const { socket = {} } = props;
    const { io, connect, namespaces, rooms } = socket;
    const { ns, type, name, action, data, response } = state;

    return (<section>
      <header>
        <h2>io Messenger Dashboard</h2>
        <div>
          <input type="text" value={ns} placeholder="type" onChange={({ target }) => this.setState({ ns: target.value })} />
          <button type="button" onClick={event => connect(ns)} >Connect</button>
        </div>
        <hr />
      </header>
      <div>{namespaces.map(ns => (<NameSpace key={socket[ns].id} {...socket[ns]} />))}</div>
      <footer>
        <hr />
        <h5>{
          `socket namespaces:\n ${namespaces.join('\n')}.`
        }</h5>
      </footer>
    </section>);
  }

  NameSpace(props) {
    const { type, name, action, data, response } = this.state;
    const {
      ns, id, connected, disconnected, emit, send, open, close, connect, disconnect, destroy
    } = props;
    return (
      <section>
        <p>ns: {ns},</p>
        <p>id: {id},</p>
        <p>connected: {`${connected}`}.</p>
        <div>
          <input type="text" value={type} placeholder="type" onChange={({ target }) => this.setState({ type: target.value })} />
        </div>
        <div>
          <input type="text" value={name} placeholder="name" onChange={({ target }) => this.setState({ name: target.value })} />
        </div>
        <div>
          <input type="text" value={action} placeholder="action" onChange={({ target }) => this.setState({ action: target.value })} />
        </div>
        <button type="button" onClick={event => send({
          type, name, action, data
        }, response => {
          this.setState({ response })
        })}>Send</button>
        <h3>Response: {`${JSON.stringify(response)}`}</h3>
        <div>
          <h4>io api</h4>
          <button type="button" onClick={connect}>connect</button>
          <button type="button" onClick={open}>open</button>
          <button type="button" onClick={close}>close</button>
          <button type="button" onClick={disconnect}>disconnect</button>
        </div>
      </section>
    )
  }
}

DashBoard.propTypes = {};
