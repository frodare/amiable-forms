import * as actions from './actions'
import * as metaKeys from './metaKeys'
import set from '../util/set'
import clone from '../util/clone'

export const initialState = {
  cleanValues: {},
  values: {},
  fields: {},
  meta: {
    touched: false,
    submitted: false,
    submitCount: 0,
    submitting: false,
    visited: false,
    valid: true,
    dirty: false
  }
}

const metaIsDifferent = (a, b) => {
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

export default ({ transform, validate } = {}) => {
  const orFlag = (fields, key) => Object.values(fields).reduce((flag, field) => flag || field[key] || false, false)
  const andFlag = (fields, key) => Object.values(fields).reduce((flag, field) => flag && field[key], true)

  const updateMeta = state => {
    const meta = state.meta
    const touched = orFlag(state.fields, 'touched')
    const dirty = orFlag(state.fields, 'dirty')
    const visited = meta.visited || orFlag(state.fields, 'visited')
    const validFields = andFlag(state.fields, 'valid')
    const error = validate && validFields ? validate(state.values) : undefined

    const newMeta = {
      submitted: meta.submitted,
      submitting: meta.submitting,
      submitCount: meta.submitCount,
      touched,
      dirty,
      visited,
      valid: validFields && !error,
      error
    }

    if (metaIsDifferent(meta, newMeta)) {
      return { ...state, meta: newMeta }
    } else {
      return state
    }
  }

  const runTransform = (state, nextState, action) => {
    if (!transform || !isValueChanging(action)) return nextState
    return transform({ current: state, next: nextState })
  }

  const saveCleanValues = (state, action) => {
    if (state.meta.visited || !isValueChanging(action)) return state
    return {
      ...state,
      cleanValues: { ...state.values }
    }
  }

  const isValueChanging = action =>
    action.type === actions.SET_VALUE ||
    action.type === actions.SET_VALUES ||
    action.type === actions.SET_VALUE_WITH_FIELD

  const postProcess = reduceFn => (state, action) => {
    let nextState = reduceFn(state, action)
    nextState = runTransform(state, nextState, action)
    nextState = updateMeta(nextState)
    nextState = saveCleanValues(nextState, action)
    return nextState
  }

  const setField = (state, action) => ({
    ...state,
    fields: {
      ...state.fields,
      [action.name]: {
        error: action.field.error || '',
        valid: !!action.field.valid,
        touched: !!action.field.touched,
        visited: !!action.field.visited,
        dirty: !!action.field.dirty,
        focused: !!action.field.focused,
        registered: true,
        custom: action.field.custom
      }
    }
  })

  const setValue = (state, action) => ({
    ...state,
    values: set(clone(state.values), action.name, action.value)
  })

  const setValueWithField = (state, action) => {
    return setValue(setField(state, action), action)
  }

  const setMeta = (state, action) => {
    const meta = { ...state.meta }

    meta[action.key] = action.value

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

  const removeField = (state, action) => {
    const fields = { ...state.fields }
    delete fields[action.name]
    return {
      ...state,
      fields
    }
  }

  const deregister = fields => Object.entries(fields)
    .map(([name, data]) => [name, { ...data, registered: false }])
    .reduce((fields, [name, data]) => ({ ...fields, [name]: data }), {})

  const setValues = (state, action) => {
    const changedValues = action.values || {}
    const merge = (action.options || {}).merge
    const keepMeta = (action.options || {}).merge

    return {
      ...state,
      values: merge ? { ...state.values, ...changedValues } : changedValues,
      fields: keepMeta ? deregister(state.fields) : {}
    }
  }

  const reset = (state, action) => {
    return {
      ...state,
      values: state.cleanValues
    }
  }

  return postProcess((state, action) => {
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
