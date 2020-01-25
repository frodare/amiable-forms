import get from './get'
import validate from './validate'
import normalizeEmpty from './normalizeEmpty'

export default ({ name, validators, requestUpdateValueRef }) => ({ current }) => {
  const value = normalizeEmpty(get(current.values, name, undefined))

  const currentError = validate({ value, values: current.values, validators })
  const prevError = (current.fields[name] && current.fields[name].error) || ''
  const errorHasChanged = currentError !== prevError

  requestUpdateValueRef.current = errorHasChanged || undefined
  return errorHasChanged
}
