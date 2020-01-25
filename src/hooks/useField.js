import { useEffect, useCallback, useRef } from 'react'
import useForm from './useForm'
import get from '../util/get'
import valueChangedInState from '../util/valueChangedInState'

const DEFAULT_PARSE = v => v || v === 0 ? v : undefined
const DEFAULT_FORMAT = v => v || v === 0 ? v : ''
const DEFAULT_FIELD = {}

const normalizeEmpty = v => v || v === 0 ? v : undefined
const DEFAULT_RELATED_FIELDS = []

const useRelatedValueChanged = ({ relatedFields, values }) => {
  const prevValues = useRef()

  const changed = Object.entries(values)
    .filter(([name]) => relatedFields.includes(name), {})
    .reduce((changed, [name, value]) => {
      if (changed) return changed
      const currValue = get(values, name)
      const prevValue = get(prevValues.current, name)
      return currValue !== prevValue
    }, false)

  prevValues.current = values

  return changed
}

const validate = ({ value, values, validators }) =>
  validators.reduce((error, validator) => error || validator(value, values), '') || ''

const createShouldUpdateWork = ({ name, validators, errorChangedRef }) => ({ previous, current }) => {
  console.log('run', name)

  // run through all validators
  const value = normalizeEmpty(get(current.values, name, undefined))

  const currentError = validators.reduce((error, validator) => error || validator(value, current.values), '')
  const prevError = current.fields[name].error

  console.log(value, { previous, current, currentError, prevError })
  const shouldUpdate = (currentError || '') !== prevError || ''
  errorChangedRef.current = shouldUpdate
  return shouldUpdate || valueChangedInState(name)({ previous, current })
}

export default ({ name, validators = [], parse = DEFAULT_PARSE, format = DEFAULT_FORMAT, parseWhenFocused = true, custom, relatedFields = DEFAULT_RELATED_FIELDS }) => {
  const errorChangedRef = useRef()
  const shouldUpdate = useCallback(createShouldUpdateWork({ name, validators, errorChangedRef }), [name, validators, errorChangedRef])
  // const shouldUpdate = useCallback(valueChangedInState([name, ...relatedFields]), [name, relatedFields])

  const { values, fields, setField, setValue, removeField, meta, cleanValues } = useForm({ shouldUpdate })
  useEffect(() => () => removeField(name), [name])

  // const relatedValues = Object.entries(values)
  //   .filter(([name]) => relatedFields.includes(name), {})
  //   .reduce((relatedValues, [name, value]) => ({ ...relatedValues, [name]: value }), {})

  // console.log('related values', relatedValues)

  // const relatedFieldChanged = false //= useRelatedValueChanged({ relatedFields, values })

  const field = fields[name] || DEFAULT_FIELD
  const value = normalizeEmpty(get(values, name, undefined))
  const cleanValue = normalizeEmpty(get(cleanValues, name, undefined))
  const prevValue = useRef()
  const bypassParseDueToFocus = field.focused && parseWhenFocused === false

  const _setValue = (val, { touch = false } = {}) => {
    errorChangedRef.current = undefined
    const value = bypassParseDueToFocus ? val : parse(val, name)
    const error = validators.reduce((error, validator) => error || validator(value, values), '')
    const valid = !error
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    const dirty = cleanValue !== value
    const focused = field.focused
    setField(name, { error, valid, touched, visited, dirty, focused, custom })
    prevValue.current = value
    setValue(name, value)
  }

  if (value !== prevValue.current || errorChangedRef.current || !field.registered) {
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
