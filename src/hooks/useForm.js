import { useContext, useEffect, useCallback } from 'react'
import { formContext } from '../components/AmiableForm'
import useRender from '../hooks/useRender'

const alwaysUpdate = () => true

export default ({ shouldUpdate = alwaysUpdate } = {}) => {
  const render = useRender()
  const formGetterRef = useContext(formContext)
  if (!formGetterRef.current) throw new Error('amiable-form hooks must be use inside a <AmiableForm>')
  const form = formGetterRef.current()

  const registration = useCallback((...args) => {
    if (shouldUpdate(...args)) {
      render()
    }
  }, [shouldUpdate, render])

  useEffect(() => {
    form.register(registration)
    return () => form.deregister(registration)
  }, [form.register, form.deregister])

  return form
}
