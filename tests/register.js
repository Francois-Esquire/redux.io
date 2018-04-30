import register from '@babel/register';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

register({
  babelrc: false,
  sourceMaps: 'inline',
  extensions: ['.js', '.jsx'],
  presets: ['@babel/preset-react', ['@ava/stage-4', { modules: false }]],
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
});
