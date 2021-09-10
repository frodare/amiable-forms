import { useContext, useEffect } from 'react'
import { formContext } from '../components/AmiableForm'
import useRender from '../hooks/useRender'

const ALWAYS_UPDATE = (): boolean => true

type ShouldUpdateHandler = (event: StateUpdateEvent) => boolean

interface UseFormOptions {
  shouldUpdate?: ShouldUpdateHandler
}

const useForm = ({ shouldUpdate = ALWAYS_UPDATE }: UseFormOptions = {}): any => {
  const render = useRender()
  const formGetterRef = useContext(formContext)

  if (!formGetterRef.current) throw new Error('amiable-form hooks must be use inside a <AmiableForm>')

  const form = formGetterRef.current
  const { addUpdateHandler, removeUpdateHandler } = form

  const onStateUpdate = event => {
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
