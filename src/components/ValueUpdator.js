import { useEffect } from 'react'
import useForm from '../hooks/useForm'

const NOPE = () => false
const DEFAULT_MERGE = true
const DEFAULT_VALUES = {}

export default ({ values = DEFAULT_VALUES, merge = DEFAULT_MERGE }) => {
  const { setValues } = useForm({ shouldUpdate: NOPE })
  useEffect(() => {
    setValues(values, { merge })
  }, [setValues, values])
  return null
}
