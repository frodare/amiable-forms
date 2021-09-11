import { useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'
import normalizeEmpty from '../util/normalizeEmpty'

const shouldUpdateName = (name: string): ShouldUpdateHandler => ({ previous, current }) => {
  if (previous.fields === current.fields) return false
  const currValue = get(current.fields, name)
  const prevValue = get(previous.fields, name)
  const changed = currValue !== prevValue
  return changed
}

export interface Args {
  name: string
}

const useFieldCustomMeta = ({ name }: Args): any => {
  const shouldUpdate = useCallback(shouldUpdateName(name), [name])
  const { fields } = useForm({ shouldUpdate })
  return normalizeEmpty(get(fields, name + '.custom', undefined))
}

export default useFieldCustomMeta
