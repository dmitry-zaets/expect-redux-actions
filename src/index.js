import expect from 'expect';
import { registerMiddlewares } from './mockStore';
import withState from './withState';
import toDispatchActions from './toDispatchActions';

function registerAssertions() {
  expect.extend({
    toDispatchActions,
    withState
  });
}

export default {
  registerAssertions,
  registerMiddlewares
};
