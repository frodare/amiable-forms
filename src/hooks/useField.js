import { useEffect, useCallback, useRef } from 'react'
import useForm from './useForm'
import get from '../util/get'
import valueChangedInState from '../util/valueChangedInState'

const DEFAULT_PARSE = v => v || v === 0 ? v : undefined
const DEFAULT_FORMAT = v => v || v === 0 ? v : ''
const DEFAULT_FIELD = {}

const normalizeEmpty = v => v || v === 0 ? v : undefined

export default ({ name, validators = [], parse = DEFAULT_PARSE, format = DEFAULT_FORMAT, parseWhenFocused = true, custom }) => {
  const shouldUpdate = useCallback(valueChangedInState(name), [name])
  const { values, fields, setField, setValue, removeField, meta, cleanValues } = useForm({ shouldUpdate })
  useEffect(() => () => removeField(name), [name])

  const field = fields[name] || DEFAULT_FIELD
  const value = normalizeEmpty(get(values, name, undefined))
  const cleanValue = normalizeEmpty(get(cleanValues, name, undefined))
  const prevValue = useRef()
  const bypassParseDueToFocus = field.focused && parseWhenFocused === false

  const _setValue = (val, { touch = false } = {}) => {
    const value = bypassParseDueToFocus ? val : parse(val, name)
    const error = validators.reduce((error, validator) => error || validator(value), '')
    const valid = !error
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    const dirty = cleanValue !== value
    const focused = field.focused
    setField(name, { error, valid, touched, visited, dirty, focused, custom })
    prevValue.current = value
    setValue(name, value)
  }

  if (value !== prevValue.current) {
    prevValue.current = value
    _setValue(value)
  }

  if (!field.registered) {
    _setValue(value)
  }

  const setFocused = focused => {
    setField(name, { ...field, focused: true })
  }

  const setVisited = () => {
    setField(name, { ...field, visited: true })
  }

  const onChange = event => {
    _setValue(event.target.value, { touch: true })
  }

  const onBlur = () => {
    if (bypassParseDueToFocus) setValue(name, parse(value))
    setField(name, { ...field, visited: true, focused: false })
  }

  const onFocus = () => setFocused(true)

  return {
    ...field,
    value: format(value),
    submitted: meta.submitted,
    setValue: _setValue,
    setVisited,
    setFocused,
    cleanValue,
    onChange,
    onBlur,
    onFocus
  }
}
