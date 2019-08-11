import React, { useRef, createContext } from 'react'
import useFormReducer from '../hooks/useFormReducer'
import useRegister from '../hooks/useRegister'
import buildSubmitHandlers from '../util/buildSubmitHandlers'

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

  formRef.current = () => ({
    register,
    deregister,
    fields: state.fields,
    values: state.values,
    cleanValues: state.cleanValues,
    meta: state.meta,
    ...actions,
    submit,
    onSubmit
  })

  return (
    <formContext.Provider value={formRef}>
      {children}
    </formContext.Provider>
  )
}

export default Form
