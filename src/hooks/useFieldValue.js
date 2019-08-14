import { useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'

const normalizeEmpty = v => v || v === 0 ? v : undefined

const shouldUpdateName = name => ({ previous, current }) => {
  if (previous.values === current.values) return false
  const currValue = get(current.values, name)
  const prevValue = get(previous.values, name)
  const changed = currValue !== prevValue
  return changed
}

export default ({ name }) => {
  const shouldUpdate = useCallback(shouldUpdateName(name), [name])
  const { values } = useForm({ shouldUpdate })
  return normalizeEmpty(get(values, name, undefined))
}
