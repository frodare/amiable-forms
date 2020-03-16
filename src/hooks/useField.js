import { useEffect, useRef, useMemo } from 'react'
import useForm from './useForm'
import get from '../util/get'
import valueChangedInState from '../util/valueChangedInState'
import errorWillChangeInState from '../util/errorWillChangeInState'
import normalizeEmpty from '../util/normalizeEmpty'
import validate from '../util/validate'

// custom meta example broken

const DEFAULT_PARSE = v => v || v === 0 ? v : undefined
const DEFAULT_FORMAT = v => v || v === 0 ? v : ''
const DEFAULT_FIELD = {}

const createShouldUpdate = ({ name, validators, fieldStateRef }) => {
  const errorCheck = errorWillChangeInState({ name, validators, fieldStateRef })
  const valueCheck = valueChangedInState(name)
  return state => errorCheck(state) || valueCheck(state)
}

const buildFieldActions = args => {
  const {
    name,
    validators,
    parse,
    fieldStateRef
  } = args

  const setValueWithEffect = (val, { touch = false } = {}) => {
    fieldStateRef.current.requestRerun = undefined

    const { field, cleanValue, bypassParseDueToFocus } = fieldStateRef.current
    const { values } = fieldStateRef.current.stateRef.current

    const value = bypassParseDueToFocus ? val : parse(val, name)
    const error = validate({ value, values, validators })
    const valid = !error
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    const dirty = cleanValue !== value
    const focused = field.focused
    const newField = { error, valid, touched, visited, dirty, focused, custom: fieldStateRef.current.custom, registered: true }

    fieldStateRef.current.prevValue = value
    fieldStateRef.current.field = newField

    fieldStateRef.current.setValueWithField(name, value, newField)
  }

  const setFocused = focused => {
    const { field } = fieldStateRef.current
    fieldStateRef.current.setField(name, { ...field, focused: true })
  }

  const setVisited = () => {
    const { field, setField } = fieldStateRef.current
    setField(name, { ...field, visited: true })
  }

  const onChange = event => {
    setValueWithEffect(event.target.value, { touch: true })
  }

  const onBlur = () => {
    const { bypassParseDueToFocus, value, field, setValue, setField } = fieldStateRef.current
    if (bypassParseDueToFocus) setValue(name, parse(value))
    setField(name, { ...field, visited: true, focused: false })
  }

  const onFocus = () => setFocused(true)

  return { setValueWithEffect, setFocused, setVisited, onChange, onBlur, onFocus }
}

const useFieldSetup = ({ name, validators }) => {
  const fieldStateRef = useRef({})
  const shouldUpdate = useMemo(() => createShouldUpdate({ name, validators, fieldStateRef }), [name, validators, fieldStateRef])
  const form = useForm({ shouldUpdate })
  useEffect(() => () => form.removeField(name), [name])

  if (!fieldStateRef.current.setValue) {
    fieldStateRef.current = {
      ...fieldStateRef.current,
      ...form
    }
  }

  return fieldStateRef
}

const updateFieldState = ({ name, fieldStateRef, parseWhenFocused }) => {
  const { fields, values, cleanValues } = fieldStateRef.current.stateRef.current

  const field = fields[name] || DEFAULT_FIELD
  const value = normalizeEmpty(get(values, name, undefined))
  const cleanValue = normalizeEmpty(get(cleanValues, name, undefined))
  const bypassParseDueToFocus = field.focused && parseWhenFocused === false

  fieldStateRef.current.field = field
  fieldStateRef.current.value = value
  fieldStateRef.current.cleanValue = cleanValue
  fieldStateRef.current.bypassParseDueToFocus = bypassParseDueToFocus
}

export default ({ name, validators = [], parse = DEFAULT_PARSE, format = DEFAULT_FORMAT, parseWhenFocused = true, custom }) => {
  const fieldStateRef = useFieldSetup({ name, validators })
  updateFieldState({ name, fieldStateRef, parseWhenFocused })

  const actions = useMemo(() => buildFieldActions({ name, validators, parse, fieldStateRef }), [])

  useEffect(() => {
    const { prevValue, requestRerun, value, field } = fieldStateRef.current
    if (value !== prevValue || (requestRerun && value) || !field.registered) {
      fieldStateRef.current.requestRerun = undefined
      actions.setValueWithEffect(value, { noRerun: true })
    }
  })

  return {
    setValue: actions.setValueWithEffect,
    setVisited: actions.setVisited,
    setFocused: actions.setFocused,
    onChange: actions.onChange,
    onBlur: actions.onBlur,
    onFocus: actions.onFocus,

    value: format(fieldStateRef.current.value),
    ...fieldStateRef.current.field,
    submitted: fieldStateRef.current.meta.submitted,
    cleanValue: fieldStateRef.current.cleanValue
  }
}
