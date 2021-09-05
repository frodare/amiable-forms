import normalizeEmpty from './normalizeEmpty'

test('normalizeEmpty', () => {
  expect(normalizeEmpty('')).toBe('')
  expect(normalizeEmpty(0)).toBe(0)
  expect(normalizeEmpty(NaN)).toBe(undefined)
  expect(normalizeEmpty(undefined)).toBe(undefined)
  expect(normalizeEmpty(null)).toBe(undefined)
  expect(normalizeEmpty(false)).toBe(false)
  expect(normalizeEmpty(true)).toBe(true)
})
