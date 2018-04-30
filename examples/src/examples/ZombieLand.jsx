import React from 'react';

import { withSocket as io } from '../../../dist/redux.io.es';

class ZombieLand extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      players: 0,
      infected: 0,
      infectious: false,
      x: 0,
      y: 0,
    };

    this.keyUp = this.keyUp.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;

    socket
      .on('count', players => this.setState({ players }))
      .on('infected', infected => this.setState({ infected }))
      .on('infectious', infectious => this.setState({ infectious }))
      .connect();

    document.body.addEventListener('keydown', this.keyUp);
  }

  componentDidUpdate(_props, _state) {
    const { x, y } = this.state;

    if (_state.x !== x || _state.y !== y) this.move();
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.keyUp);
  }

  move() {
    const { socket } = this.props;
    const { x, y } = this.state;

    socket.emit('position', x, y);
  }

  keyUp(event) {
    event.preventDefault();

    const { keyCode } = event;

    const { x, y } = this.state;

    switch (keyCode) {
      default:
        break;
      case 37: /* Arrow Left */
      case 39: /* Arrow Right */
      case 65: /* a */
      case 68: /* d */ {
        if ([39, 68].includes(keyCode)) {
          if (x + 1 <= 100) this.setState({ x: x + 1 });
        } else if ([37, 65].includes(keyCode)) {
          if (x - 1 >= 0) this.setState({ x: x - 1 });
        }
        break;
      }
      case 38: /* Arrow Up */
      case 40: /* Arrow Down */
      case 87: /* w */
      case 83: /* s */ {
        if ([40, 83].includes(keyCode)) {
          if (y + 1 <= 100) this.setState({ y: y + 1 });
        } else if ([38, 87].includes(keyCode)) {
          if (y - 1 >= 0) this.setState({ y: y - 1 });
        }
        break;
      }
    }
  }

  render() {
    const { socket } = this.props;
    const { x, y, players, infected, infectious } = this.state;

    return socket.connected ? (
      <section>
        <header>
          <h2>Welcome To Zombie Land</h2>

          <p>Players: {players}</p>
        </header>

        <p>
          X: <span>{x}</span>, Y: <span>{y}</span>
        </p>

        <code>[PLACE GAME VIEW HERE]</code>

        <footer>
          <p>Infected: {infected}</p>
          <p>
            Are You Infected?{' '}
            {infectious ? 'EAT BRAIN...' : 'Naaa You Still Good! RUN!'}
          </p>

          <button type="button" onClick={() => socket.disconnect()}>
            Get Me Out Of Here...!
          </button>
        </footer>
      </section>
    ) : (
      <button type="button" onClick={() => socket.connect()}>
        Step Inside, But Tread Lightly..
      </button>
    );
  }
}

const ManHunt = io('/hunt', {
  autoConnect: false,
})(ZombieLand);

export default ManHunt;
