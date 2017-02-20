'use strict';

module.exports = (ctx) => ({
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: {
    'postcss-cssnext': {
      features: {
        autoprefixer: {}
      }
    }
  }
});
