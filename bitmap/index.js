const cluster = require('cluster');
const os = require('os');

const debug = process.env.NODE_ENV !== 'production';

try {
  (async function startup() {
    if (debug) {
      await require('./server')();
    } else if (cluster.isMaster) {
      let count = os.cpus().length;

      while (count > 0) {
        cluster.fork();
        // eslint-disable-next-line no-plusplus
        --count;
      }
    } else await require('./server')();
  }());
} catch (error) {
  console.log(error);
}
