import { useEffect, useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'

const defaultParse = value => !value && value !== 0 ? undefined : value

const DEFAULT_FORMAT = value => value || ''
const DEFAULT_FIELD = {}

const valueChanged = name => ({ previous, current }) => {
  if (previous.fields[name] !== current.fields[name]) return true
  if (previous.values === current.values) return false
  const currValue = get(current.values, name)
  const prevValue = get(previous.values, name)
  const changed = currValue !== prevValue
  return changed
}

export default ({ name, validators = [], parse = defaultParse, format = DEFAULT_FORMAT }) => {
  const shouldUpdate = useCallback(valueChanged(name), [name])
  const { values, fields, setField, setValue, removeField, meta, cleanValues } = useForm({ shouldUpdate })
  useEffect(() => () => removeField(name), [name])

  const field = fields[name] || DEFAULT_FIELD
  const value = get(values, name)
  const cleanValue = get(cleanValues, name)

  const _setValue = (val, { touch = false } = {}) => {
    const value = parse(val, name)
    const error = validators.reduce((error, validator) => error || validator(value), '')
    const valid = !error
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    const dirty = cleanValue !== value
    setField(name, { error, valid, touched, visited, dirty })
    setValue(name, value)
  }

  if (!field.registered) {
    _setValue(value)
  }

  const setVisited = () => {
    setField(name, { ...field, visited: true })
  }

  const onChange = event => {
    _setValue(event.target.value, { touch: true })
  }

  return {
    ...field,
    value: format(value),
    submitted: meta.submitted,
    setValue: _setValue,
    setVisited,
    onChange,
    onBlur: setVisited
  }
}
