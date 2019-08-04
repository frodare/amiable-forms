import flatten from './flatten'

describe('flatten', () => {
  it('exists', () => expect(flatten).toBeDefined())
  it('can flatten simple objects', () => {
    expect(flatten({
      o: {
        a: 'a',
        b: 2,
        c: null,
        d: {
          e: {
            f: 'g'
          }
        }
      }
    })).toEqual({
      'o.a': 'a',
      'o.b': 2,
      'o.c': null,
      'o.d.e.f': 'g'
    })
  })
  it('can flatten simple arrays', () => {
    expect(flatten({
      o: {
        a: [1, 2, 'a', 'b']
      }
    })).toEqual({
      'o.a[0]': 1,
      'o.a[1]': 2,
      'o.a[2]': 'a',
      'o.a[3]': 'b'
    })
  })
  it('can flatten an array at root', () => {
    expect(flatten({
      a: [1, 2]
    })).toEqual({
      'a[0]': 1,
      'a[1]': 2
    })
  })
  it('can flatten compound arrays and objects', () => {
    expect(flatten({
      a: [{ b: [{ c: 'bar' }] }, 'foo']
    })).toEqual({
      'a[0].b[0].c': 'bar',
      'a[1]': 'foo'
    })
  })
  it('can flatten compound arrays', () => {
    expect(flatten({
      a: [1, [2, [3, 4]]]
    })).toEqual({
      'a[0]': 1,
      'a[1][0]': 2,
      'a[1][1][0]': 3,
      'a[1][1][1]': 4
    })
  })
  it('can flatten example', () => {
    expect(flatten({
      fullname: 'Charles Howard',
      phone: '850-877-8804',
      users: [
        'User 1',
        'User 2'
      ],
      name: {
        first: 'Charles',
        last: 'Howard'
      }
    })).toEqual({
      'fullname': 'Charles Howard',
      'phone': '850-877-8804',
      'users[0]': 'User 1',
      'users[1]': 'User 2',
      'name.first': 'Charles',
      'name.last': 'Howard'
    })
  })
})
