import deepEqual from './deepEqual'

test('deepEqual', () => {
  expect(deepEqual('1', '1')).toBe(true)
  expect(deepEqual({ a: '1' }, { a: '1' })).toBe(true)
  expect(deepEqual({ a: { b: '1' } }, { a: { b: '1' } })).toBe(true)
  expect(deepEqual({ a: { b: '1' } }, { a: { b: '2' } })).toBe(false)
})
