import get from './get'
import validate from './validate'
import normalizeEmpty from './normalizeEmpty'

const errorWillChangeInState = (name: string, validators: Validator[], comm: FieldCommRef): ShouldUpdateHandler => ({ current }) => {
  const value = normalizeEmpty(get(current.values, name, undefined))
  const currentError = validate(validators)(value, current.values)

  const prevError = current.fields[name]?.error // FIXME this use to not allow undefined
  const errorHasChanged = currentError !== prevError
  comm.current.requestRerun = errorHasChanged
  return errorHasChanged
}

export default errorWillChangeInState
