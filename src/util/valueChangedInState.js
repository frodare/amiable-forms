import get from './get'

const singleFieldChanged = name => ({ previous, current }) => {
  if (previous.meta !== current.meta) return true
  if (previous.fields[name] !== current.fields[name]) return true
  if (previous.values === current.values) return false
  const currValue = get(current.values, name)
  const prevValue = get(previous.values, name)
  const changed = currValue !== prevValue
  return changed
}

const anyFieldHasChanged = names => state => {
  const changed = names.reduce((changed, name) => changed || singleFieldChanged(name)(state), false)
  return changed
}

export default name => {
  if (Array.isArray(name)) {
    return anyFieldHasChanged(name)
  } else {
    return singleFieldChanged(name)
  }
}
