import valueChangedInState from './valueChangedInState'
import { initialMeta } from '../state/reducer'
import set from './set'

let event: StateUpdateEvent

beforeEach(() => {
  event = genEvent()
})

test('initial', () => {
  expect(valueChangedInState('foo')(event)).toBe(false)
})

test('metaChange', () => {
  event.current = set(event.current, 'meta.dirty', true)
  expect(valueChangedInState('foo')(event)).toBe(true)
})

test('metaChange', () => {
  event.current = set(event.current, 'meta.dirty', true)
  expect(valueChangedInState('foo')(event)).toBe(true)
})

test('cloned', () => {
  event.current = { ...event.current }
  expect(valueChangedInState('foo')(event)).toBe(false)
})

test('different value', () => {
  event.current = set(event.current, 'values.test', 'bar')
  expect(valueChangedInState('foo')(event)).toBe(false)
})

test('value no change', () => {
  event = set(event, 'previous.values.foo', 'bar')
  event = set(event, 'current.values.foo', 'bar')
  expect(valueChangedInState('foo')(event)).toBe(false)
})

test('value change', () => {
  event = set(event, 'previous.values.foo', 'bar')
  event = set(event, 'current.values.foo', 'bar2')
  expect(valueChangedInState('foo')(event)).toBe(true)
})

test('sibling value change', () => {
  event = set(event, 'previous.values.foo', 'bar')
  event = set(event, 'current.values.foo', 'bar')
  event = set(event, 'current.values.foo2', 'bar2')
  expect(valueChangedInState('foo')(event)).toBe(false)
})

test('field no change', () => {
  const field = genField()
  event = set(event, 'previous.fields.foo', field)
  event = set(event, 'current.fields.foo', field)
  expect(valueChangedInState('foo')(event)).toBe(false)
})

const genState = (): FormState => ({
  cleanValues: {},
  fields: {},
  meta: initialMeta,
  values: {}
})

const genEvent = (): StateUpdateEvent => ({
  current: genState(),
  previous: genState()
})

const genField = (): Field => ({
  error: undefined,
  valid: false,
  touched: false,
  visited: false,
  dirty: false,
  focused: false,
  registered: false,
  custom: undefined
})
