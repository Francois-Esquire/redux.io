if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./dist/redux.io');
} else {
  module.exports = require('./dist/redux.io');
}
