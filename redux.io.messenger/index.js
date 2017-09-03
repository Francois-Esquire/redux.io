const cluster = require('cluster');
const os = require('os');

(async function startup() {
  const server = require('./server');

  if (cluster.isMaster) {
    let count = os.cpus().length;

    while (count > 0) {
      cluster.fork();
      // eslint-disable-next-line no-plusplus
      --count;
    }
  } else await server();
}());
