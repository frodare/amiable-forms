import { useContext, useEffect } from 'react'
import { formContext } from '../components/AmiableForm'
import useRender from '../hooks/useRender'

const ALWAYS_UPDATE = (): boolean => true

interface UseFormOptions {
  shouldUpdate?: ShouldUpdateHandler
}

const useForm = ({ shouldUpdate = ALWAYS_UPDATE }: UseFormOptions = {}): UseFormReturn => {
  const render = useRender()
  const formGetterRef = useContext(formContext)

  if (formGetterRef?.current === undefined) throw new Error('amiable-form hooks must be use inside a <AmiableForm>')

  const form = formGetterRef.current
  const { addUpdateHandler, removeUpdateHandler } = form

  const onStateUpdate: Handler = event => {
    if (shouldUpdate(event)) render()
  }

  useEffect(() => {
    addUpdateHandler(onStateUpdate)
    return () => removeUpdateHandler(onStateUpdate)
  }, [])

  return {
    ...form.stateRef.current,
    ...form
  }
}

export default useForm
