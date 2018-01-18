//@flow

import {from, Stream} from 'most'
import {Act, Action} from '..'
import {fooStore, fooAction, getSend} from './fixtures'


test('should subscribe', () => {
  const fn = jest.fn()
  const store = fooStore()
  expect(store).toBeDefined()
  const action = {type: 'FOO', payload: {} }
  const probe = {...action}
  store.subscribe(fn)
  store.dispatch(probe)
  store.dispatch(probe)
  expect(fn).toHaveBeenCalledTimes(2)
  expect(action).toEqual(probe)
  expect(store.dispatch(probe)).toBe(probe)
})

test('actions', () => {
  const fn = jest.fn()
  const store = fooStore()
  const action = fooAction()
  expect(action({foo: 'bar'})).toBeDefined()
  expect(action({foo: 'bar'}) instanceof Act).toBe(true)
})
test(`most.from(action)`, () => {
  const action2 = fooAction()
  const action$2 = from(action2)
  expect(action$2 instanceof Stream).toBe(true)
})
test(`no autodispatch`, () => {
  const action = fooAction()
  const fn = jest.fn()
  const action$2 = from(action)
  action$2.observe(fn)
  action({foo: 'bar'})
  action({foo: 'bar'})
  expect(fn).not.toHaveBeenCalled()
})
test(
  `observable emits after dispatch
    from(action)`,
  () => {
    const action = fooAction()
    const fn = jest.fn()
    const store = fooStore()
    const action$2 = from(action)
    action$2.observe(fn)
    store.dispatch(action({foo: 'bar'}))
    store.dispatch(action({foo: 'bar'}))
    action({foo: 'bar'})
    expect(fn).toHaveBeenCalledTimes(2)
  }
)

test('compatible with plain actions', () => {
  const action = new Action(
    'CONST_ACTION',
    (typeId, type, payload) => ({
      typeId, type, payload
    }),
    e => e.payload
  )
  const store = fooStore()
  const send = getSend(store)
  const act = send(action({foo: 'bar'}))
  expect(act.type).toBe('CONST_ACTION')
})

describe('can be subscribed', () => {
  test('from(action)', () => {
    const action = fooAction()
    const fn = jest.fn()
    const store = fooStore()
    const send = getSend(store)
    const action$ = from(action)
    action$.observe(fn)
    send(action({foo: 'bar'}))
    expect(fn).toHaveBeenCalledTimes(1)
  })
  test('action.raw$()', () => {
    const action = fooAction()
    const fn = jest.fn()
    const store = fooStore()
    const send = getSend(store)
    const action$ = action.raw$()
    action$.observe(fn)
    const act = send(action({foo: 'bar'}))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(act)
  })
})

test('no double dispatch', () => {
  const action = fooAction()
  const fn = jest.fn()
  const fn1 = jest.fn()
  const store = fooStore()
  const send = getSend(store)
  const action$2 = from(action)
  action$2.observe(fn)
  store.subscribe(fn1)
  const act = action({foo: 'bar'})
  send(act)
  send(act)
  send(act)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn1).toHaveBeenCalledTimes(1)
})
