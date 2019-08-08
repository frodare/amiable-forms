import React, { useReducer, useMemo } from 'react'
import reducerCreator, { initialState } from '../state/reducer'
import * as actions from '../state/actions'
import * as metaKeys from '../state/metaKeys'

export const formContext = React.createContext({})

const Form = props => {
  const {
    children,
    process,
    processInvalid,
    validate,
    transform,
    initialValues
  } = props

  const reducer = useMemo(() => reducerCreator({ transform, validate }), [transform, validate])
  const init = useMemo(() => initialValues => initialValues ? reducer(initialState, { type: actions.SET_VALUES, values: initialValues }) : initialState, [reducer])
  const [state, dispatch] = useReducer(reducer, initialValues, init)

  // TODO: clean / dirty system
  // const cleanValuesContainer = useRef({})
  // const reset = () => setValues(cleanValuesContainer.current)
  // if (!visited) {
  //   cleanValuesContainer.current = { ...values }
  // }
  // const dirty = !isEqual(values, cleanValuesContainer.current)

  const setField = (name, field) => dispatch({ type: actions.SET_FIELD, name, ...field })
  const setValue = (name, value) => dispatch({ type: actions.SET_VALUE, name, value })
  const setMetaValue = (key, value) => dispatch({ type: actions.SET_META, key, value })
  const removeField = name => dispatch({ type: actions.REMOVE_FIELD, name })
  const reset = () => dispatch({ type: actions.RESET })
  const setValues = values => dispatch({ type: actions.SET_VALUES, values })
  const clear = () => setValues({})

  const submit = (...args) => {
    if (state.meta.valid) {
      if (process) process(state.values, ...args)
    } else {
      if (processInvalid) processInvalid(state.meta, state.fields)
    }
    setMetaValue(metaKeys.SUBMITTED, true)
  }

  const onSubmit = ev => submit(props, ev)

  return (
    <formContext.Provider value={{
      fields: state.fields,
      values: state.values,
      meta: state.meta,
      setField,
      setValue,
      removeField,
      setValues,
      reset,
      clear,
      submit,
      onSubmit
    }}>
      {children}
    </formContext.Provider>
  )
}

export default Form
