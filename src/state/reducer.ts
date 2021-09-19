import * as actions from './actions'
import * as metaKeys from './metaKeys'
import set from '../util/set'
import clone from '../util/clone'
import version from '../version'

export const initialMeta: FormMeta = {
  version,
  touched: false,
  submitted: false,
  submitCount: 0,
  submitting: false,
  visited: false,
  valid: true,
  dirty: false,
  error: undefined,
  custom: undefined
}

export const initialState: FormState = {
  cleanValues: {},
  values: {},
  fields: {},
  meta: initialMeta
}

const metaIsDifferent = (a: FormMeta, b: FormMeta): boolean => {
  if (a.submitted !== b.submitted) return true
  if (a.submitCount !== b.submitCount) return true
  if (a.submitting !== b.submitting) return true
  if (a.touched !== b.touched) return true
  if (a.dirty !== b.dirty) return true
  if (a.visited !== b.visited) return true
  if (a.valid !== b.valid) return true
  if (a.error !== b.error) return true
  if (a.custom !== b.custom) return true
  return false
}

const toBool = (o: any): boolean => {
  return o !== false && o !== undefined && o !== null && o !== 0
}

const reduceOrFlag = (key: keyof Field) => (flag: boolean, field: Field) => {
  if (flag) return true
  return toBool(field[key])
}

const orFlag = (fields: Fields, key: keyof Field): boolean => {
  return Object.values(fields).reduce(reduceOrFlag(key), false)
}

const reduceAndFlag = (key: keyof Field) => (flag: boolean, field: Field) => {
  if (!flag) return false
  return flag && toBool(field[key])
}

const andFlag = (fields: Fields, key: keyof Field): boolean => {
  return Object.values(fields).reduce(reduceAndFlag(key), true)
}

const updateMeta = (state: FormState, validate: FormValidator | undefined): FormState => {
  const meta = state.meta
  const touched = orFlag(state.fields, 'touched')
  const dirty = orFlag(state.fields, 'dirty')
  const visited = meta.visited || orFlag(state.fields, 'visited')
  const validFields = andFlag(state.fields, 'valid')
  // FIXME this validate function doesn't seem to be wired up correctly, it only affects error, maybe that is ok?
  const error = validFields && validate !== undefined ? validate(state.values) : undefined

  const newMeta: FormMeta = {
    version,
    submitted: meta.submitted,
    submitting: meta.submitting,
    submitCount: meta.submitCount,
    touched,
    dirty,
    visited,
    valid: validFields,
    error,
    custom: undefined
  }

  if (metaIsDifferent(meta, newMeta)) {
    return { ...state, meta: newMeta }
  } else {
    return state
  }
}

const isValueChanging = (action: Action): boolean =>
  action.type === actions.SET_VALUE ||
  action.type === actions.SET_VALUES ||
  action.type === actions.SET_VALUE_WITH_FIELD

const runTransform = (transform: Transform) => (state: FormState, nextState: FormState, action: Action) => {
  if (!isValueChanging(action)) return nextState
  return transform({ current: state, next: nextState })
}

const postProcess = (transform: Transform | undefined, validate: FormValidator | undefined, reduceFn: Reducer): Reducer => {
  const transformRunner = transform === undefined ? undefined : runTransform(transform)

  const saveCleanValues: Reducer = (state, action) => {
    if (state.meta.visited || !isValueChanging(action)) return state
    return {
      ...state,
      cleanValues: { ...state.values }
    }
  }

  return (state, action) => {
    let nextState = reduceFn(state, action)
    if (transformRunner !== undefined) {
      nextState = transformRunner(state, nextState, action)
    }
    nextState = updateMeta(nextState, validate)
    nextState = saveCleanValues(nextState, action)
    return nextState
  }
}

const stripEmptyString = (s: FormError): FormError =>
  s === '' ? undefined : s

const setField: Reducer = (state, action: SetFieldAction) => ({
  ...state,
  fields: {
    ...state.fields,
    [action.name]: {
      error: stripEmptyString(action.field.error),
      valid: action.field.valid,
      touched: action.field.touched,
      visited: action.field.visited,
      dirty: action.field.dirty,
      focused: action.field.focused,
      registered: true,
      custom: action.field.custom
    }
  }
})

const setValue: Reducer = (state, action: SetValueAction) => ({
  ...state,
  values: set(clone(state.values), action.name, action.value)
})

const setValueWithField: Reducer = (state, action: SetValueWithFieldAction) => {
  return setValue(setField(state, action), action)
}

const setMeta: Reducer = (state, action: SetMetaValueAction) => {
  const meta: FormMeta = { ...state.meta }

  const key: keyof FormMeta = action.key

  // FIXME find a better way to set a meta field from an action
  ;(meta as any)[key] = action.value

  if (action.key === metaKeys.SUBMITTED && action.value === true) {
    meta[metaKeys.SUBMITTING] = false
    meta[metaKeys.SUBMIT_COUNT] = meta[metaKeys.SUBMIT_COUNT] + 1
  }

  if (action.key === metaKeys.SUBMITTING && action.value === true) {
    meta[metaKeys.SUBMITTED] = false
  }

  return {
    ...state,
    meta
  }
}

/* eslint-disable @typescript-eslint/no-dynamic-delete */
const removeField: Reducer = (state, action: RemoveFieldAction) => {
  const fields = { ...state.fields }
  delete fields[action.name]
  return {
    ...state,
    fields
  }
}

const deregister = (fields: Fields): Fields =>
  Object.entries(fields)
    .map(([name, data]): [string, Field] => ([name, { ...data, registered: false }]))
    .reduce((fields, [name, data]) => ({ ...fields, [name]: data }), {})

const setValues: Reducer = (state, action: SetValuesAction) => {
  const changedValues = action.values
  const merge = action.options.merge
  const keepMeta = action.options.merge // FIXME was this a bug? use options.keepMeta?

  return {
    ...state,
    values: merge ? { ...state.values, ...changedValues } : changedValues,
    fields: keepMeta ? deregister(state.fields) : {}
  }
}

const reset: Reducer = (state, action) => {
  return {
    ...state,
    values: state.cleanValues
  }
}
// FIXME changed the input parameters of this function
const reducer = (transform: Transform | undefined, validate: FormValidator | undefined): Reducer => {
  return postProcess(transform, validate, (state, action) => {
    console.log('DISPATCH ', action)
    switch (action.type) {
      case actions.SET_FIELD: return setField(state, action)
      case actions.SET_VALUE: return setValue(state, action)
      case actions.SET_VALUE_WITH_FIELD: return setValueWithField(state, action)
      case actions.SET_META: return setMeta(state, action)
      case actions.REMOVE_FIELD: return removeField(state, action)
      case actions.SET_VALUES: return setValues(state, action)
      case actions.RESET: return reset(state, action)
      default: return state
    }
  })
}

export default reducer
