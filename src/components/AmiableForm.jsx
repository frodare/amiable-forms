import React, { useRef, createContext, useMemo, useEffect } from 'react'
import notifier from '../util/notifier'
import actionDispatchers from '../state/actionDispatchers'
import useFormStore from '../state/useFormStore'
import buildSubmitHandlers from '../util/buildSubmitHandlers'

export const formContext = createContext({})

const useSetInitialValues = (initialValues, setValues) => {
  useEffect(() => {
    if (initialValues) {
      setValues(initialValues)
    }
  }, [initialValues, setValues])
}

const AmiableForm = props => {
  const { validate, transform, initialValues } = props
  const formRef = useRef()

  const [notifyStateUpdate, addUpdateHandler, removeUpdateHandler] = useMemo(notifier, [])
  const [stateRef, dispatch] = useFormStore({ transform, validate, notifyStateUpdate })
  const actions = useMemo(() => actionDispatchers(formRef, dispatch), [formRef, dispatch])
  const { submit, onSubmit } = buildSubmitHandlers({ stateRef, actions, props })

  useSetInitialValues(initialValues, actions.setValues)

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
