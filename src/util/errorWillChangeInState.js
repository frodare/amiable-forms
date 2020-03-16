import get from './get'
import validate from './validate'
import normalizeEmpty from './normalizeEmpty'

export default ({ name, validators, fieldStateRef }) => ({ current }) => {
  const value = normalizeEmpty(get(current.values, name, undefined))
  const currentError = validate({ name, value, values: current.values, validators })
  const prevError = (current.fields[name] && current.fields[name].error) || ''
  const errorHasChanged = currentError !== prevError
  fieldStateRef.current.requestRerun = errorHasChanged || undefined
  return errorHasChanged
}
