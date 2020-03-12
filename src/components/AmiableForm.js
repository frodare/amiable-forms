import React, { useRef, createContext, useCallback } from 'react'
import useFormReducer from '../hooks/useFormReducer'
import buildSubmitHandlers from '../util/buildSubmitHandlers'
import isFunction from '../util/isFunction'
import get from '../util/get'

export const formContext = createContext({})

const AmiableForm = props => {
  const {
    children,
    validate,
    transform,
    initialValues
  } = props

  const { actions, stateRef, register, deregister } = useFormReducer({ transform, validate, initialValues })
  const { submit, onSubmit } = buildSubmitHandlers({ stateRef, actions, props })

  const formRef = useRef()

  const setValueWithFunctionalUpdate = useCallback((name, value) => {
    const currentValues = formRef.current().values
    const updatedValue = isFunction(value) ? value(get(currentValues, name)) : value
    actions.setValue(name, updatedValue)
  }, [formRef, actions])

  const setValuesWithFunctionalUpdate = useCallback((values, options) => {
    const currentValues = formRef.current().values
    const updatedValues = isFunction(values) ? values(currentValues) : values
    actions.setValues(updatedValues, options)
  }, [formRef, actions])

  formRef.current = () => ({
    stateRef,
    ...actions,
    setValue: setValueWithFunctionalUpdate,
    setValues: setValuesWithFunctionalUpdate,
    submit,
    onSubmit,
    register,
    deregister
  })

  return (
    <formContext.Provider value={formRef}>
      {children}
    </formContext.Provider>
  )
}

export default AmiableForm
