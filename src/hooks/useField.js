import { useEffect, useCallback, useRef } from 'react'
import useForm from './useForm'
import get from '../util/get'
import valueChangedInState from '../util/valueChangedInState'
import errorWillChangeInState from '../util/errorWillChangeInState'
import normalizeEmpty from '../util/normalizeEmpty'
import validate from '../util/validate'

const DEFAULT_PARSE = v => v || v === 0 ? v : undefined
const DEFAULT_FORMAT = v => v || v === 0 ? v : ''
const DEFAULT_FIELD = {}

const createShouldUpdate = ({ name, validators, rerunFieldValidationRef }) => {
  const errorCheck = errorWillChangeInState({ name, validators, rerunFieldValidationRef })
  const valueCheck = valueChangedInState(name)
  return state => errorCheck(state) || valueCheck(state)
}

const computeFieldState = ({ stateRef, name, parseWhenFocused }) => {
  const { fields, values, cleanValues, meta } = stateRef.current
  const field = fields[name] || DEFAULT_FIELD
  const value = normalizeEmpty(get(values, name, undefined))
  const cleanValue = normalizeEmpty(get(cleanValues, name, undefined))
  const bypassParseDueToFocus = field.focused && parseWhenFocused === false
  return { field, meta, value, cleanValue, bypassParseDueToFocus }
}

const useFieldSetup = ({ name, validators }) => {
  const rerunFieldValidationRef = useRef()
  const shouldUpdate = useCallback(createShouldUpdate({ name, validators, rerunFieldValidationRef }), [name, validators, rerunFieldValidationRef])
  const { setField, setValue, setValueWithField, removeField, stateRef } = useForm({ shouldUpdate, name })
  useEffect(() => () => removeField(name), [name])
  return { setField, setValue, setValueWithField, stateRef, rerunFieldValidationRef }
}

const useFieldActions = ({ name, validators, setValueWithField, setValue, setField, fieldStateRef, rerunFieldValidationRef, custom, parse, prevValueRef }) => {
  const memoRef = useRef()
  if (memoRef.current) return memoRef.current

  const setValueWithEffect = (val, { touch = false } = {}) => {
    const { bypassParseDueToFocus, values, field, cleanValue } = fieldStateRef.current

    const value = bypassParseDueToFocus ? val : parse(val, name)
    const error = validate({ value, values, validators })
    const valid = !error
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    const dirty = cleanValue !== value
    const focused = field.focused
    const newField = { error, valid, touched, visited, dirty, focused, custom, registered: true }

    rerunFieldValidationRef.current = undefined
    prevValueRef.current = value

    setValueWithField(name, value, newField)
  }

  const setFocused = focused => {
    const { field } = fieldStateRef.current
    setField(name, { ...field, focused: true })
  }

  const setVisited = () => {
    const { field } = fieldStateRef.current
    setField(name, { ...field, visited: true })
  }

  const onChange = event => {
    setValueWithEffect(event.target.value, { touch: true })
  }

  const onBlur = () => {
    const { bypassParseDueToFocus, value, field } = fieldStateRef.current
    if (bypassParseDueToFocus) setValue(name, parse(value))
    setField(name, { ...field, visited: true, focused: false })
  }

  const onFocus = () => setFocused(true)

  memoRef.current = { setValueWithEffect, setFocused, setVisited, onChange, onBlur, onFocus }
  return memoRef.current
}

export default ({ name, validators = [], parse = DEFAULT_PARSE, format = DEFAULT_FORMAT, parseWhenFocused = true, custom }) => {
  const { setValueWithField, setField, setValue, stateRef, rerunFieldValidationRef } = useFieldSetup({ name, validators })
  const fieldStateRef = useRef()
  const prevValueRef = useRef()
  fieldStateRef.current = computeFieldState({ stateRef, name, parseWhenFocused })
  const { field, meta, value, cleanValue } = fieldStateRef.current

  const actions = useFieldActions({ name, validators, setValueWithField, setValue, setField, fieldStateRef, rerunFieldValidationRef, custom, parse, prevValueRef })

  useEffect(() => {
    if (value !== prevValueRef.current || rerunFieldValidationRef.current || !field.registered) {
      actions.setValueWithEffect(value)
    }
  })

  return {
    setValue: actions.setValueWithEffect,
    setVisited: actions.setVisited,
    setFocused: actions.setFocused,
    onChange: actions.onChange,
    onBlur: actions.onBlur,
    onFocus: actions.onFocus,

    value: format(value),
    ...field,
    submitted: meta.submitted,
    cleanValue
  }
}
