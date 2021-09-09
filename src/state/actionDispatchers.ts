import * as actionTypes from '../state/actions'
import isFunction from '../util/isFunction'
import get from '../util/get'

const EMPTY_OPTIONS: SetValuesOptions = {
  merge: false
}

const actionDispatchers = (formRef: FormRef, dispatch: Dispatch): FormDispatchers => {
  const setField: SetFieldDispatcher = (name, field) => {
    const action: SetFieldAction = {
      type: actionTypes.SET_FIELD,
      name,
      field
    }
    dispatch(action)
  }

  const setMetaValue: SetMetaValueDispatcher = (key, value) => {
    const action: SetMetaValueAction = {
      type: actionTypes.SET_META,
      key,
      value
    }
    dispatch(action)
  }

  const removeField: RemoveFieldDispatcher = name => {
    const action: RemoveFieldAction = {
      type: actionTypes.REMOVE_FIELD,
      name
    }
    dispatch(action)
  }

  const reset: ResetDispatcher = () => {
    const action: Action = {
      type: actionTypes.RESET
    }
    dispatch(action)
  }

  const clear: ClearDispatcher = () => {
    const action: SetValuesAction = {
      type: actionTypes.SET_VALUES,
      values: {},
      options: EMPTY_OPTIONS
    }
    dispatch(action)
  }

  const setValue: SetValueDispatcher = (name, valueOrValueGetter) => {
    const currentValues = formRef.current.stateRef.current.values
    const value = isFunction(valueOrValueGetter) ? valueOrValueGetter(get(currentValues, name)) : valueOrValueGetter
    const action: SetValueAction = {
      type: actionTypes.SET_VALUE,
      name,
      value
    }
    dispatch(action)
  }

  const setValueWithField: SetValueWithFieldDispatcher = (name, valueOrValueGetter, field) => {
    const currentValues = formRef.current.stateRef.current.values
    const value = isFunction(valueOrValueGetter) ? valueOrValueGetter(get(currentValues, name)) : valueOrValueGetter
    const action: SetValueWithFieldAction = {
      type: actionTypes.SET_VALUE_WITH_FIELD,
      name,
      value,
      field
    }
    dispatch(action)
  }

  const setValues: SetValuesDispatcher = (valuesOrValuesGetter, options) => {
    const currentValues = formRef.current.stateRef.current.values
    const values = isFunction(valuesOrValuesGetter) ? valuesOrValuesGetter(currentValues) : valuesOrValuesGetter
    const action: SetValuesAction = {
      type: actionTypes.SET_VALUES,
      values,
      options: options === undefined ? EMPTY_OPTIONS : options
    }
    dispatch(action)
  }

  return {
    setField,
    setMetaValue,
    removeField,
    reset,
    clear,
    setValue,
    setValueWithField,
    setValues
  }
}

export default actionDispatchers
