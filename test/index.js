import expect from 'expect';
import thunk from 'redux-thunk';
import expectReduxActions from '../src/';
import getMockStore from '../src/mockStore';

expectReduxActions.registerMiddlewares([thunk]);
expectReduxActions.registerAssertions();

function asyncFunction() {
  return Promise.resolve();
}

const start = () => { return { type: 'test-action-start' }; };
const anotherStart = () => { return { type: 'test-action-another-start' }; };
const finish = () => { return { type: 'test-action-finish' }; };
const fail = () => { return { type: 'test-action-fail' }; };

const actionWithGetState = (data) => { return { type: 'test-action-with-get-state', data }; };

function actionCreatorWithGetState() {
  return (dispatch, getState) => {
    dispatch(actionWithGetState(getState()));
  };
}

function asyncActionCreator() {
  return dispatch => {
    dispatch(start());
    dispatch(anotherStart());
    return asyncFunction().then(() => {
      dispatch(finish());
    }).catch(() => {
      dispatch(fail());
    });
  };
}

const parentStart = () => { return { type: 'parent-test-action-start' }; };
const parentFinish = () => { return { type: 'parent-test-action-finish' }; };
const parentFail = () => { return { type: 'parent-test-action-fail' }; };

function parentAsyncActionCreator() {
  return dispatch => {
    dispatch(parentStart());
    return asyncFunction().then(() => {
      dispatch(asyncActionCreator());
      dispatch(parentFinish());
    }, () => {
      dispatch(parentFail());
    });
  };
}

const expectedActions = [
  start(),
  anotherStart(),
  finish()
];


const parentActions = [
  parentStart(),
  asyncActionCreator(),
  parentFinish()
];

describe('default redux-mock-store way', () => {
  it('should dispatch actions', (done) => {
    const store = getMockStore()({});
    store.dispatch(asyncActionCreator()).then(() => {
      const actualActions = store.getActions();
      expect(actualActions).toEqual(expectedActions);
      done();
    });
  });
});

describe('expect extensions', () => {
  describe('.withState', () => {
    it('should accept object and setup getState', (done) => {
      expect(actionCreatorWithGetState())
        .withState({ property: 'value' })
        .toDispatchActions(actionWithGetState({ property: 'value' }), done);
    });

    it('should accept function and setup getState', (done) => {
      expect(actionCreatorWithGetState())
        .withState(() => { return { property: 'value' };})
        .toDispatchActions(actionWithGetState({ property: 'value' }), done);
    });
  });

  describe('.toDispatchActions', () => {
    it('should accept single action', (done) => {
      expect(start()).toDispatchActions(start(), done);
    });

    it('should accept array with one action', (done) => {
      expect(start()).toDispatchActions([start()], done);
    });

    it('should accept array with multiple actions', (done) => {
      expect(asyncActionCreator())
        .toDispatchActions(expectedActions, done);
    });

    it('should accept array with nested async action creators', (done) => {
      expect(parentAsyncActionCreator())
        .toDispatchActions(parentActions, done);
    });
  });
});
