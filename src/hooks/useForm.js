import { useContext, useEffect } from 'react'
import { formContext } from '../components/AmiableForm'
import useRender from '../hooks/useRender'

const ALWAYS_UPDATE = () => true

export default ({ shouldUpdate = ALWAYS_UPDATE, name } = {}) => {
  const render = useRender()
  const formGetterRef = useContext(formContext)
  if (!formGetterRef.current) throw new Error('amiable-form hooks must be use inside a <AmiableForm>')

  const form = formGetterRef.current
  const { addUpdateHandler, removeUpdateHandler } = form

  useEffect(() => {
    const onStateUpdate = (event) => {
      if (shouldUpdate(event)) render()
    }
    addUpdateHandler(onStateUpdate)
    return () => removeUpdateHandler(onStateUpdate)
  }, [addUpdateHandler, removeUpdateHandler, shouldUpdate])

  return {
    ...form.stateRef.current,
    ...form
  }
}
