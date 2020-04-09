import React, { useRef, createContext, useMemo } from 'react'
import notifier from '../util/notifier'
import useFormActions from '../hooks/useFormActions'
import useFormStore from '../state/useFormStore'
import buildSubmitHandlers from '../util/buildSubmitHandlers'

export const formContext = createContext({})

const AmiableForm = props => {
  const { validate, transform, initialValues } = props
  const formRef = useRef()

  const [notifyStateUpdate, addUpdateHandler, removeUpdateHandler] = useMemo(notifier, [])
  const [stateRef, dispatch] = useFormStore({ initialValues, transform, validate, notifyStateUpdate })
  const actions = useMemo(() => useFormActions({ dispatch, formRef }), [dispatch, formRef])
  const { submit, onSubmit } = buildSubmitHandlers({ stateRef, actions, props })

  formRef.current = {
    ...actions,
    stateRef,
    submit,
    onSubmit,
    addUpdateHandler,
    removeUpdateHandler
  }

  return (
    <formContext.Provider value={formRef}>
      {props.children}
    </formContext.Provider>
  )
}

export default AmiableForm
