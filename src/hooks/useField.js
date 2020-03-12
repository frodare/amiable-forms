import { useEffect, useCallback, useRef } from 'react'
import useForm from './useForm'
import get from '../util/get'
import valueChangedInState from '../util/valueChangedInState'
import errorWillChangeInState from '../util/errorWillChangeInState'
import normalizeEmpty from '../util/normalizeEmpty'
import validate from '../util/validate'
import deepEqual from '../util/deepEqual'

const DEFAULT_PARSE = v => v || v === 0 ? v : undefined
const DEFAULT_FORMAT = v => v || v === 0 ? v : ''
const DEFAULT_FIELD = {}

const createShouldUpdate = ({ name, validators, requestUpdateValueRef }) => {
  const errorCheck = errorWillChangeInState({ name, validators, requestUpdateValueRef })
  const valueCheck = valueChangedInState(name)
  return state => errorCheck(state) || valueCheck(state)
}

export default ({ name, validators = [], parse = DEFAULT_PARSE, format = DEFAULT_FORMAT, parseWhenFocused = true, custom }) => {
  const requestUpdateValueRef = useRef()
  const shouldUpdate = useCallback(createShouldUpdate({ name, validators, requestUpdateValueRef }), [name, validators, requestUpdateValueRef])

  const { setField, setValue, removeField, stateRef } = useForm({ shouldUpdate, name })
  const { fields, values, cleanValues, meta } = stateRef.current

  useEffect(() => () => removeField(name), [name])

  const field = fields[name] || DEFAULT_FIELD
  const value = normalizeEmpty(get(values, name, undefined))
  const cleanValue = normalizeEmpty(get(cleanValues, name, undefined))
  const prevValue = useRef()
  const bypassParseDueToFocus = field.focused && parseWhenFocused === false

  const _setValue = (val, { touch = false } = {}) => {
    requestUpdateValueRef.current = undefined
    const value = bypassParseDueToFocus ? val : parse(val, name)
    const error = validate({ value, values, validators })
    const valid = !error
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    const dirty = cleanValue !== value
    const focused = field.focused

    const newField = { error, valid, touched, visited, dirty, focused, custom, registered: true }

    if (!deepEqual(newField, field)) {
      setField(name, newField)
    }

    prevValue.current = value
    setValue(name, value)
  }

  if (value !== prevValue.current || requestUpdateValueRef.current || !field.registered) {
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
