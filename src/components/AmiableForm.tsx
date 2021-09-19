import React, { useRef, createContext, useMemo, useEffect, FC } from 'react'
import notifier from '../util/notifier'
import actionDispatchers from '../state/actionDispatchers'
import useFormStore from '../state/useFormStore'
import buildSubmitHandlers from '../util/buildSubmitHandlers'

export const formContext = createContext<AmiableFormStateRef | undefined>(undefined)

const useSetInitialValues = (initialValues: Values | undefined, setValues: SetValuesDispatcher): void => {
  useEffect(() => {
    if (initialValues !== undefined) {
      setValues(initialValues, undefined)
    }
  }, [initialValues, setValues])
}

const AmiableForm: FC<AmiableFormProps> = ({ process, processInvalid, validate, transform, initialValues, children }) => {
  const [notifyStateUpdate, addUpdateHandler, removeUpdateHandler] = useMemo(notifier, [])
  const [stateRef, dispatch] = useFormStore(transform, validate, notifyStateUpdate)
  const actions = useMemo(() => actionDispatchers(stateRef, dispatch), [stateRef, dispatch])
  const { submit, onSubmit } = buildSubmitHandlers(stateRef, actions, process, processInvalid)

  useSetInitialValues(initialValues, actions.setValues)

  const amiableFormState: AmiableFormState = {
    ...actions,
    stateRef,
    submit,
    onSubmit,
    addUpdateHandler,
    removeUpdateHandler
  }

  const formRef: FormRef = useRef(amiableFormState)
  formRef.current = amiableFormState

  return (
    <formContext.Provider value={formRef}>
      {children}
    </formContext.Provider>
  )
}

export default AmiableForm
