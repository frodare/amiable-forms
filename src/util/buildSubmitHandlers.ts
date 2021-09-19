import * as metaKeys from '../state/metaKeys'
import get from '../util/get'
import set from '../util/set'

const NOOP: Processor = () => { }

const reduceFieldValue = (allValues: Values) => (fieldValues: Values, fieldName: string) => {
  const value = get(allValues, fieldName)
  if (value === undefined || value === null) return fieldValues
  return set(fieldValues, fieldName, value)
}

const getFieldValues = (allValues: Values, fields: Fields): string[] =>
  Object.keys(fields).reduce(reduceFieldValue(allValues), {})

const determineProcess = (process: Processor | undefined, processInvalid: Processor | undefined, stateRef: StateRef): Processor => {
  const valid = stateRef.current.meta.valid
  if (valid && process !== undefined) return process
  if (processInvalid !== undefined) return processInvalid
  return NOOP
}

const buildSubmitHandlers = (stateRef: StateRef, actions: FormDispatchers, process: any, processInvalid: any): SubmitHandlers => {
  const submit: Submit = (...args) => {
    const state = stateRef.current
    const processFn = determineProcess(process, processInvalid, stateRef)

    const fieldValues = getFieldValues(state.values, state.fields)
    const { submitting } = state.meta

    if (submitting) {
      return
    }

    const setSubmitted = (): void => {
      actions.setMetaValue(metaKeys.SUBMITTED, true)
    }

    const result = processFn(fieldValues, { ...state, ...actions }, ...args)

    if (result instanceof Promise) {
      actions.setMetaValue(metaKeys.SUBMITTING, true)
      result.then(setSubmitted).catch(setSubmitted)
    } else {
      setSubmitted()
    }
  }

  const onSubmit: OnSubmit = ev => submit(ev)

  return { submit, onSubmit }
}

export default buildSubmitHandlers
