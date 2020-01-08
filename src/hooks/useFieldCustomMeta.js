import { useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'

const normalizeEmpty = v => v || v === 0 ? v : undefined

const shouldUpdateName = name => ({ previous, current }) => {
  if (previous.fields === current.fields) return false
  const currValue = get(current.fields, name)
  const prevValue = get(previous.fields, name)
  const changed = currValue !== prevValue
  return changed
}

export default ({ name }) => {
  const shouldUpdate = useCallback(shouldUpdateName(name), [name])
  const { fields } = useForm({ shouldUpdate })
  return normalizeEmpty(get(fields, name + '.custom', undefined))
}
