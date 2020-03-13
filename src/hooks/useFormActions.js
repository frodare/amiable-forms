import { useMemo } from 'react'
import * as actionTypes from '../state/actions'
import isFunction from '../util/isFunction'
import get from '../util/get'

export default ({ dispatch, formRef }) => {
  const actions = useMemo(() => {
    const _setValue = (name, value) =>
      dispatch({ type: actionTypes.SET_VALUE, name, value })

    const _setValues = (values, options) =>
      dispatch({ type: actionTypes.SET_VALUES, values, options })

    const setField = (name, field) =>
      dispatch({ type: actionTypes.SET_FIELD, name, ...field })

    const setMetaValue = (key, value) =>
      dispatch({ type: actionTypes.SET_META, key, value })

    const removeField = name =>
      dispatch({ type: actionTypes.REMOVE_FIELD, name })

    const reset = () =>
      dispatch({ type: actionTypes.RESET })

    const clear = () =>
      dispatch({ type: actionTypes.SET_VALUES, values: {} })

    const setValue = (name, value) => {
      const currentValues = formRef.current().values
      const updatedValue = isFunction(value) ? value(get(currentValues, name)) : value
      _setValue(name, updatedValue)
    }

    const setValues = (values, options) => {
      const currentValues = formRef.current().values
      const updatedValues = isFunction(values) ? values(currentValues) : values
      _setValues(updatedValues, options)
    }

    return { setField, setValue, setMetaValue, removeField, reset, setValues, clear }
  }, [dispatch, formRef])

  return actions
}
