import set from './set'

const equals = (a, b) => {
  const matched = JSON.stringify(a) === JSON.stringify(b)
  if (!matched) console.log('a: ', JSON.stringify(a, null, 2), 'b: ', JSON.stringify(b, null, 2))
  return matched
}

describe('set', () => {
  it('will ignore non objects, returning what was given', () => {
    expect(set(null, 'test', 'foo')).toBe(null)
    expect(set(undefined, 'test', 'foo')).toBe(undefined)
    expect(set(1, 'test', 'foo')).toBe(1)
    expect(set('noway', 'test', 'foo')).toBe('noway')
  })

  it('will handle missing or invalid paths', () => {
    expect(set({}, null, 'foo')).toEqual({})
    expect(set({}, undefined, 'foo')).toEqual({})
    expect(set({}, 1, 'foo')).toEqual({ 1: 'foo' })
    expect(set({}, -1, 'foo')).toEqual({ '-1': 'foo' })
    expect(set({}, 0, 'foo')).toEqual({ 0: 'foo' })
    expect(set({}, false, 'foo')).toEqual({ false: 'foo' })
    expect(set({}, NaN, 'foo')).toEqual({ NaN: 'foo' })
  })

  it('can set empty object', () => {
    let test = { test: 'foo' }
    expect(equals(test, set({}, 'test', 'foo'))).toBe(true)

    test = { test: { test: 'foo' } }
    expect(equals(test, set({}, 'test.test', 'foo'))).toBe(true)

    test = { test: ['foo'] }
    expect(equals(test, set({}, 'test[0]', 'foo'))).toBe(true)

    test = { test: [null, null, 'foo'] }
    expect(equals(test, set({}, 'test[2]', 'foo'))).toBe(true)

    test = { test: [null, null, { foo: { bar: 'baz' } }] }
    expect(equals(test, set({}, 'test[2].foo.bar', 'baz'))).toBe(true)
  })

  it('can overwrite', () => {
    const start = { test: [null, null, { foo: { bar: 'baz' } }] }
    const result = { test: [null, null, { foo: { bar: 'baz2' } }] }
    expect(equals(result, set(start, 'test[2].foo.bar', 'baz2'))).toBe(true)
  })
})
