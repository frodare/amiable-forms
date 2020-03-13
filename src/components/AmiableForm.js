import React, { useRef, createContext } from 'react'
import useUpdateRegistration from '../hooks/useUpdateRegistration'
import useFormActions from '../hooks/useFormActions'
import useFormReducer from '../hooks/useFormReducer'
import buildSubmitHandlers from '../util/buildSubmitHandlers'

export const formContext = createContext({})

const AmiableForm = props => {
  const {
    children,
    validate,
    transform,
    initialValues
  } = props

  const { onUpdate, register, deregister } = useUpdateRegistration({ transform, validate, initialValues })

  const [stateRef, dispatch] = useFormReducer({ initialValues, transform, validate, onUpdate })

  const formRef = useRef()

  const actions = useFormActions({ dispatch, formRef })

  const { submit, onSubmit } = buildSubmitHandlers({ stateRef, actions, props })

  formRef.current = () => ({
    ...actions,
    stateRef,
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
