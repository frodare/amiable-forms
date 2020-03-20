/*
 * code from stackoverflow answer by trincot
 * reference: https://stackoverflow.com/questions/54733539/javascript-implementation-of-lodash-set-method
 */

const f = (path, a) => (a, c, i) => (
  Object(a[c]) === a[c]
    ? a[c]
    : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1])
      ? []
      : {}
)

const set = (obj, path, value) => {
  if (Object(obj) !== obj) return obj
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
  path.slice(0, -1).reduce(f, obj)[path[path.length - 1]] = value
  return obj
}

export default set
