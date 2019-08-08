import * as actions from './actions'

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

const initialField = {
  error: '',
  valid: true,
  touched: false,
  visited: false
}

const setField = (state, action) => ({
  ...state,
  fields: {
    ...state.fields,
    [action.name]: {
      ...initialField,
      error: action.error || initialField.error,
      valid: action.valid || initialField.valid,
      touched: action.touched || initialField.touched,
      visited: action.visited || initialField.visited
    }
  },
  values: {
    ...state.values,
    [action.name]: action.value
  }
})

const setValue = (state, action) => {
  // name value
  return state
}

const setMeta = (state, action) => {
  // key (consts), value
  return state
}

const removeField = (state, action) => {
  // name
  /*
  const newFields = { ...fields }
  delete newFields[name]
  return newFields
  */
  return state
}

const setValues = (state, action) => {
  // values
  return state
}

const reset = (state, action) => {
  return state
}

export default (state, action) => {
  console.log(state, action)
  switch (action.type) {
    case actions.SET_FIELD: return setField(state, action)
    case actions.SET_VALUE: return setValue(state, action)
    case actions.SET_META: return setMeta(state, action)
    case actions.REMOVE_FIELD: return removeField(state, action)
    case actions.SET_VALUES: return setValues(state, action)
    case actions.RESET: return reset(state, action)
    default: return state
  }
}
