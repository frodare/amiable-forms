import React, { useRef, createContext } from 'react'
import useFormReducer from '../hooks/useFormReducer'
import useRegister from '../hooks/useRegister'
import buildSubmitHandlers from '../util/buildSubmitHandlers'
import isFunction from '../util/isFunction'
import get from '../util/get'

export const formContext = createContext({})

const Form = props => {
  const {
    children,
    validate,
    transform,
    initialValues
  } = props

  const { actions, state } = useFormReducer({ transform, validate, initialValues })
  const { submit, onSubmit } = buildSubmitHandlers({ state, actions, props })
  const { register, deregister } = useRegister(state)

  const formRef = useRef()

  const setValueWithFunctionalUpdate = (name, value) => {
    const currentValues = formRef.current().values
    const updatedValue = isFunction(value) ? value(get(currentValues, name)) : value
    actions.setValue(name, updatedValue)
  }

  formRef.current = () => ({
    ...state,
    ...actions,
    setValue: setValueWithFunctionalUpdate,
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

export default Form
