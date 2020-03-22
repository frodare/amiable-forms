import React, { useRef, createContext } from 'react'
import notifier from '../util/notifier'
import useFormActions from '../hooks/useFormActions'
import createStore from '../state/createStore'
import buildSubmitHandlers from '../util/buildSubmitHandlers'

export const formContext = createContext({})

const AmiableForm = props => {
  const formRef = useRef()

  if (!formRef.current) {
    const { validate, transform, initialValues } = props

    const [notifyStateUpdate, addUpdateHandler, removeUpdateHandler] = notifier()
    const [stateRef, dispatch] = createStore({ initialValues, transform, validate, notifyStateUpdate })
    const actions = useFormActions({ dispatch, formRef })
    const { submit, onSubmit } = buildSubmitHandlers({ stateRef, actions, props })

    formRef.current = {
      ...actions,
      stateRef,
      submit,
      onSubmit,
      addUpdateHandler,
      removeUpdateHandler
    }
  }

  return (
    <formContext.Provider value={formRef}>
      {props.children}
    </formContext.Provider>
  )
}

export default AmiableForm
