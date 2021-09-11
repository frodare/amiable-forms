import { useCallback } from 'react'
import useForm from './useForm'

const bool = (b: any): boolean => {
  if (b === null || b === undefined) return true
  return b
}

const shouldUpdateName = (name: string): ShouldUpdateHandler => ({ previous, current }) => {
  if (previous.fields === current.fields) return false
  const currValue = bool((current.fields[name]).valid)
  const prevValue = bool((previous.fields[name]).valid)
  const changed = currValue !== prevValue
  return changed
}

export interface Args {
  name: string
}

const useFieldIsValid = ({ name }: Args): boolean => {
  const shouldUpdate = useCallback(shouldUpdateName(name), [name])
  const { fields } = useForm({ shouldUpdate })
  return bool((fields[name]).valid)
}

export default useFieldIsValid
