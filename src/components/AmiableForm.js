import React, { useRef, createContext } from 'react'
import useFormReducer from '../hooks/useFormReducer'
import useRegister from '../hooks/useRegister'
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

  const { actions, state, stateRef } = useFormReducer({ transform, validate, initialValues })
  const { submit, onSubmit } = buildSubmitHandlers({ stateRef, actions, props })
  const { register, deregister } = useRegister(state)

  const formRef = useRef()

  const setValueWithFunctionalUpdate = (name, value) => {
    const currentValues = formRef.current().values
    const updatedValue = isFunction(value) ? value(get(currentValues, name)) : value
    actions.setValue(name, updatedValue)
  }

  const setValuesWithFunctionalUpdate = (values, options) => {
    const currentValues = formRef.current().values
    const updatedValues = isFunction(values) ? values(currentValues) : values
    actions.setValues(updatedValues, options)
  }

  formRef.current = () => ({
    ...state,
    ...actions,
    setValue: setValueWithFunctionalUpdate,
    setValues: setValuesWithFunctionalUpdate,
    submit,
    onSubmit,
    register,
    deregister
  })

  const r = (
    <formContext.Provider value={formRef}>
      {children}
    </formContext.Provider>
  )

  return r
}

export default AmiableForm
