import { useContext, useEffect } from 'react'
import { formContext } from '../components/AmiableForm'
import useRender from '../hooks/useRender'

const ALWAYS_UPDATE = () => true

export default ({ shouldUpdate = ALWAYS_UPDATE } = {}) => {
  const render = useRender()
  const formGetterRef = useContext(formContext)
  if (!formGetterRef.current) throw new Error('amiable-form hooks must be use inside a <AmiableForm>')

  const form = formGetterRef.current
  const { addUpdateHandler, removeUpdateHandler } = form

  const onStateUpdate = event => {
    if (shouldUpdate(event)) render()
  }

  addUpdateHandler(onStateUpdate)

  useEffect(() => {
    return () => removeUpdateHandler(onStateUpdate)
  }, [])

  return {
    ...form.stateRef.current,
    ...form
  }
}
