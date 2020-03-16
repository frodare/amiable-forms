import get from './get'
import validate from './validate'
import normalizeEmpty from './normalizeEmpty'

export default ({ name, validators, fieldStateRef }) => ({ current }) => {
  const value = normalizeEmpty(get(current.values, name, undefined))
  const currentError = validate({ name, value, values: current.values, validators })
  const prevError = (current.fields[name] && current.fields[name].error) || ''
  const errorHasChanged = currentError !== prevError

  if (!fieldStateRef.current.noRerun) {
    console.log('errorWillChangeInState', { currentError, prevError, errorHasChanged })
    fieldStateRef.current.requestRerun = errorHasChanged || undefined
  } else {
    console.log('** ASKED TO STOP')
    fieldStateRef.current.noRerun = false
  }

  return errorHasChanged
}
