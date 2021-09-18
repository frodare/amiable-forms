import get from './get'
import validate from './validate'
import normalizeEmpty from './normalizeEmpty'

const errorWillChangeInState = (name: string, validators: Validator[], comm: FieldCommRef): ShouldUpdateHandler => ({ current }) => {
  const currentValue = normalizeEmpty(get(current.values, name, undefined))
  const currentError = validate(validators)(currentValue, current.values)

  const prevError = current.fields[name]?.error
  const errorHasChanged = currentError !== prevError
  comm.current.requestRerun = errorHasChanged

  return errorHasChanged
}

export default errorWillChangeInState
