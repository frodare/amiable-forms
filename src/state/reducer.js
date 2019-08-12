import * as actions from './actions'
import set from '../util/set'
import clone from '../util/clone'

export const initialState = {
  cleanValues: {},
  values: {},
  fields: {},
  meta: {
    touched: false,
    submitted: false,
    visited: false,
    valid: true,
    dirty: false
  }
}

const metaIsDifferent = (a, b) => {
  if (a.submitted !== b.submitted) return true
  if (a.touched !== b.touched) return true
  if (a.dirty !== b.dirty) return true
  if (a.visited !== b.visited) return true
  if (a.valid !== b.valid) return true
  if (a.error !== b.error) return true
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

  const isValueChanging = action => action.type === actions.SET_VALUE || action.type === actions.SET_VALUES

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
        error: action.error || '',
        valid: !!action.valid,
        touched: !!action.touched,
        visited: !!action.visited,
        dirty: !!action.dirty,
        registered: true
      }
    }
  })

  const setValue = (state, action) => ({
    ...state,
    values: set(clone(state.values), action.name, action.value)
  })

  const setMeta = (state, action) => ({
    ...state,
    meta: {
      ...state.meta,
      [action.key]: action.value
    }
  })

  const removeField = (state, action) => {
    const values = { ...state.values }
    const fields = { ...state.fields }

    delete values[action.name]
    delete fields[action.name]

    return {
      ...state,
      values,
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
    return state
  }

  return postProcess((state, action) => {
    switch (action.type) {
      case actions.SET_FIELD: return setField(state, action)
      case actions.SET_VALUE: return setValue(state, action)
      case actions.SET_META: return setMeta(state, action)
      case actions.REMOVE_FIELD: return removeField(state, action)
      case actions.SET_VALUES: return setValues(state, action)
      case actions.RESET: return reset(state, action)
      default: return state
    }
  })
}
