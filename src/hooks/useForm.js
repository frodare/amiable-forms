import { useContext } from 'react'
import { formContext } from '../components/Form'

export default () => {
  const formGetterRef = useContext(formContext)
  if (!formGetterRef.current) throw new Error('amiable-form hooks must be use inside a <Form>')
  return formGetterRef.current()
}
