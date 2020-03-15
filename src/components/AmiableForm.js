import React, { useRef, createContext } from 'react'
import useObservable from '../hooks/useObservable'
import useFormActions from '../hooks/useFormActions'
import useFormReducer from '../hooks/useFormReducer'
import buildSubmitHandlers from '../util/buildSubmitHandlers'

export const formContext = createContext({})

// TODO: large form example: all fields validate when typing into one
// TODO: does this need to be a function?
// TODO: values is null on match form field

const AmiableForm = props => {
  const formRef = useRef()

  if (!formRef.current) {
    const { validate, transform, initialValues } = props

    const [triggerStateUpdate, addUpdateHandler, removeUpdateHandler] = useObservable()

    const [stateRef, dispatch] = useFormReducer({ initialValues, transform, validate, triggerStateUpdate })

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
