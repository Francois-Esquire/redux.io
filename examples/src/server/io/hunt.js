export default function zombieLand(io) {
  const hunt = io.of('/hunt');

  const players = new Map();
  const positions = new Map();
  const infected = new Set();

  hunt.on('connect', socket => {
    players.set(socket.id, [0, 0]);

    hunt.emit('count', players.size);

    socket
      .on('position', (x, y) => {
        const coords = [x, y];

        const infectious = infected.has(socket.id);

        if (positions.has(coords)) {
          const position = positions.get(coords);

          if (infectious) {
            const victims = (position || []).filter(
              id => infected.has(id) === false,
            );

            victims.forEach(id => {
              infected.add(id);
              hunt.to(id).emit('infectious', true);
            });

            if (victims.length) hunt.emit('infected', infected.size);
          } else {
            const vermin = (position || []).filter(id => infected.has(id));

            if (vermin.length) {
              infected.add(socket.id);

              socket.emit('infectious', true);
              hunt.emit('infected', infected.size);
            }
          }

          position.push(socket.id);

          positions.set(coords, position);
        } else positions.set(coords, [socket.id]);

        const current = players.get(socket.id);
        const position = positions.get(current);

        positions.set(
          current,
          (position || []).filter(id => id !== socket.id),
        );

        players.set(socket.id, coords);
      })
      .on('disconnect', () => {
        const current = players.get(socket.id);
        const position = positions.get(current);

        if (position) {
          position.splice(position.indexOf(socket.id), 1);

          positions.set(current, position);
        }

        infected.delete(socket.id);

        players.delete(socket.id);

        hunt.emit('count', players.size);
      });
  });

  return hunt;
}
