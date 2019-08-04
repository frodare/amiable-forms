import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

const createKey = (prefix, key) => prefix ? `${prefix}.${key}` : key

const flatten = (result, value, key) => {
  if (isArray(value)) {
    return value.reduce((result, value, index) => flatten(result, value, `${key}[${index}]`), result)
  }

  if (isObject(value)) {
    return Object.entries(value)
      .reduce((result, [innerKey, value]) => flatten(result, value, createKey(key, innerKey)), result)
  }

  result[key] = value
  return result
}
export default o => flatten({}, o, '')
