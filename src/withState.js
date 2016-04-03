import expect from 'expect';
import { isFunction, isObject } from './utils';

function withState(state) {
  expect.assert(
    isFunction(this.actual) || isObject(this.actual),
    'The "action" argument in expect(action).withState() must be a function'
  );

  this.state = state;

  return this;
}


export default withState;
