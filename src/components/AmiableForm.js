import React, { useRef, createContext } from 'react'
import useObservable from '../hooks/useObservable'
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

  const [triggerStateUpdate, addUpdateHandler, removeUpdateHandler] = useObservable()

  const [stateRef, dispatch] = useFormReducer({ initialValues, transform, validate, triggerStateUpdate })

  const formRef = useRef()

  const actions = useFormActions({ dispatch, stateRef })

  const { submit, onSubmit } = buildSubmitHandlers({ stateRef, actions, props })

  // TODO: large form example: all fields validate when typing into one
  // TODO: does this need to be a function?
  // TODO: values is null on match form field
  formRef.current = () => ({
    ...actions,
    ...stateRef.current,
    stateRef,
    submit,
    onSubmit,
    addUpdateHandler,
    removeUpdateHandler
  })

  return (
    <formContext.Provider value={formRef}>
      {children}
    </formContext.Provider>
  )
}

export default AmiableForm
