import { useContext } from 'react'
import { formContext } from '../components/Form'

export default () => {
  const form = useContext(formContext)
  if (!form.fields) throw new Error('must be in a FormProvider')
  return form
}
