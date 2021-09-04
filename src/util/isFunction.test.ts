import isFunction from './isFunction'

test('isFunction', () => {
  expect(isFunction(() => null)).toBe(true)
  expect(isFunction({})).toBe(false)
  expect(isFunction('')).toBe(false)
  expect(isFunction(null)).toBe(false)
  expect(isFunction(undefined)).toBe(false)
  expect(isFunction(true)).toBe(false)
})
