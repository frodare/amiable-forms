import { useRef } from 'react'
import * as actionTypes from '../state/actions'
import isFunction from '../util/isFunction'
import get from '../util/get'

export default ({ dispatch, stateRef }) => {
  const memoRef = useRef()
  if (memoRef.current) return memoRef.current

  const setField = (name, field) => dispatch({ type: actionTypes.SET_FIELD, name, ...field })

  const setMetaValue = (key, value) => dispatch({ type: actionTypes.SET_META, key, value })

  const removeField = name => dispatch({ type: actionTypes.REMOVE_FIELD, name })

  const reset = () => dispatch({ type: actionTypes.RESET })

  const clear = () => dispatch({ type: actionTypes.SET_VALUES, values: {} })

  const setValue = (name, valueOrValueGetter) => {
    const currentValues = stateRef.current.values
    const value = isFunction(valueOrValueGetter) ? valueOrValueGetter(get(currentValues, name)) : valueOrValueGetter
    dispatch({ type: actionTypes.SET_VALUE, name, value })
  }

  const setValues = (valuesOrValuesGetter, options) => {
    const currentValues = stateRef.current.values
    const values = isFunction(valuesOrValuesGetter) ? valuesOrValuesGetter(currentValues) : valuesOrValuesGetter
    dispatch({ type: actionTypes.SET_VALUES, values, options })
  }

  memoRef.current = { setField, setValue, setMetaValue, removeField, reset, setValues, clear }
  return memoRef.current
}
