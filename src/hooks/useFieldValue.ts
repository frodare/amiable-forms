import { useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'
import normalizeEmpty from '../util/normalizeEmpty'

const shouldUpdateName = (name: string): ShouldUpdateHandler => ({ previous, current }) => {
  if (previous.values === current.values) return false
  const currValue = get(current.values, name)
  const prevValue = get(previous.values, name)
  const changed = currValue !== prevValue
  return changed
}

export interface Args {
  name: string
}

export default ({ name }: Args): any => {
  const shouldUpdate = useCallback(shouldUpdateName(name), [name])
  const { values } = useForm({ shouldUpdate })
  return normalizeEmpty(get(values, name, undefined))
}
