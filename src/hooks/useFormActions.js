import * as actionTypes from '../state/actions'
import isFunction from '../util/isFunction'
import get from '../util/get'

export default ({ dispatch, formRef }) => {
  const setField = (name, field) => dispatch({ type: actionTypes.SET_FIELD, name, field })

  const setMetaValue = (key, value) => dispatch({ type: actionTypes.SET_META, key, value })

  const removeField = name => dispatch({ type: actionTypes.REMOVE_FIELD, name })

  const reset = () => dispatch({ type: actionTypes.RESET })

  const clear = () => dispatch({ type: actionTypes.SET_VALUES, values: {} })

  const setValue = (name, valueOrValueGetter) => {
    const currentValues = formRef.current.values
    const value = isFunction(valueOrValueGetter) ? valueOrValueGetter(get(currentValues, name)) : valueOrValueGetter
    dispatch({ type: actionTypes.SET_VALUE, name, value })
  }

  const setValueWithField = (name, valueOrValueGetter, field) => {
    const currentValues = formRef.current.values
    const value = isFunction(valueOrValueGetter) ? valueOrValueGetter(get(currentValues, name)) : valueOrValueGetter
    dispatch({ type: actionTypes.SET_VALUE_WITH_FIELD, name, value, field })
  }

  const setValues = (valuesOrValuesGetter, options) => {
    const currentValues = formRef.current.values
    const values = isFunction(valuesOrValuesGetter) ? valuesOrValuesGetter(currentValues) : valuesOrValuesGetter
    dispatch({ type: actionTypes.SET_VALUES, values, options })
  }

  return { setField, setValue, setValueWithField, setMetaValue, removeField, reset, setValues, clear }
}
