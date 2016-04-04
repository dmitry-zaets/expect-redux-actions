# expect-redux-actions

Expect assertions for redux actions testing

This library extends [expect](https://github.com/mjackson/expect) library with assertions for [redux actions](http://redux.js.org/docs/advanced/AsyncActions.html) testing. It use [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) to mock redux store.

## Installation

Using [npm](https://www.npmjs.org/):

    $ npm install --save expect-redux-actions

Then, before executing first tests:

```js
// using ES6 modules
import expectReduxActions from 'expect-redux-actions';

// using CommonJS modules
var expectReduxActions = require('expect-redux-actions');

// initialization
expectReduxActions.registerMiddlewares([
  /*Here you need to list your middlewares*/
]);
expectReduxActions.registerAssertions();
```

## Assertions

### toDispatchActions

> `expect(action).toDispatchActions(expectedActions)`

Asserts that when given `actionCreator` is dispatched it will dispatch `expectedActions`. `action` can be plain object (action) or function (action creator). `expectedActions` can be can be plain object (action) or function (action creator) or array of objects/functions.

```js
expect(myActionCreator())
  .toDispatchActions([
    {type: 'MY_ACTION_START'},
    myStartActionCreator(),
    myFinishActionCreator()
  ], callback);
```

### withState

> `expect(action).withState(state).toDispatchActions(expectedActions)`

Asserts that store initialised with `state` before `action` is dispatched.

```js
expect(myActionCreator())
  .withState({property: 'value'})
  .toDispatchActions([myStartActionCreator(), myFinishActionCreator()], callback);
```
