import * as actions from './actions'
import set from 'lodash/set'

export const initialState = {
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
    meta.valid = andFlag(state.fields, 'valid')
    if (validate) meta.valid = meta.valid && validate(state.values)
    return {
      ...state,
      meta
    }
  }

  const postProcess = reduceFn => (state, action) => {
    let nextState = reduceFn(state, action)

    if (transform && (action.type === actions.SET_VALUE || action.type === actions.SET_VALUES)) {
      nextState = {
        ...nextState,
        values: transform({ current: state.values, next: nextState.values })
      }
    }

    return updateMeta(nextState)
  }

  const setField = (state, action) => ({
    ...state,
    fields: {
      ...state.fields,
      [action.name]: {
        error: action.error || '',
        valid: !!action.valid,
        touched: !!action.touched,
        visited: !!action.visited
      }
    }
  })

  const setValue = (state, action) => ({
    ...state,
    values: set({ ...state.values }, action.name, action.value)
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

  const setValues = (state, action) => ({
    ...state,
    values: action.values
  })

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
