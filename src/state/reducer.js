import * as actions from './actions'
import set from '../util/set'

const clone = o => JSON.parse(JSON.stringify(o))

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

export default ({ transform, validate } = {}) => {
  const orFlag = (fields, key) => Object.values(fields).reduce((flag, field) => flag || field[key] || false, false)
  const andFlag = (fields, key) => Object.values(fields).reduce((flag, field) => flag && field[key], true)

  const updateMeta = state => {
    const meta = { ...state.meta }
    meta.touched = orFlag(state.fields, 'touched')
    meta.dirty = orFlag(state.fields, 'dirty')
    meta.visited = meta.visited || orFlag(state.fields, 'visited')
    meta.valid = andFlag(state.fields, 'valid')
    if (validate) meta.valid = meta.valid && validate(state.values)
    return {
      ...state,
      meta
    }
  }

  const runTransform = (state, nextState, action) => {
    if (!transform || !isValueChanging(action)) return nextState
    return {
      ...state,
      values: transform({ current: state.values, next: nextState.values })
    }
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
