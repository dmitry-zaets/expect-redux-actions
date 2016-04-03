import flattenDeep from 'lodash.flattendeep';
import expect from 'expect';
import { isFunction, isObject, toArray } from './utils';
import getMockStore from './mockStore';

function getDispatchedActions(getState = {}, action) {
  return new Promise((resolve, reject) => {
    const store = getMockStore()(getState);
    const dispatchResult = store.dispatch(action);

    if (dispatchResult instanceof Promise) {
      dispatchResult.then(() => {
        resolve(store.getActions());
      }).catch((result) => {
        reject(result);
      });
    } else {
      resolve(store.getActions());
    }
  });
}

function unrollActions(getState, expectedActions) {
  const promises = [];
  const actions = toArray(expectedActions);

  for (let index = 0; index < actions.length; index++) {
    promises.push(getDispatchedActions(getState, actions[index]));
  }

  return Promise.all(promises).then((resultActions) => {
    return flattenDeep(resultActions);
  });
}

function assertActions(getState, actionUnderTest, expectedActions, done) {
  getDispatchedActions(getState, actionUnderTest).then((dispatchedActions) => {
    unrollActions(getState, expectedActions).then((expectedUnrolledActions) => {
      for (let index = 0; index < expectedUnrolledActions.length; index++) {
        expect(dispatchedActions).toInclude(
          expectedUnrolledActions[index],
          expect.assert.deepEqual,
          `Expected action ${JSON.stringify(expectedUnrolledActions[index])} was not dispatched.`);
      }
      done();
    }).catch((err) => {
      done(err);
    });
  });
}

function toDispatchActions(expectedActions, done) {
  expect.assert(
    isFunction(this.actual) || isObject(this.actual),
    'The "actualAction" argument in ' +
    'expect(actualAction).toDispatchActions(expectedActions) ' +
    'must be a function or object'
  );

  expect.assert(
    isFunction(this.actual) || isObject(this.actual),
    'The "expectedActions" argument in ' +
    'expect(actualAction).toDispatchActions(expectedActions) ' +
    'must be a function or object'
  );

  assertActions(this.state, this.actual, expectedActions, done);
}

export default toDispatchActions;
