import { useEffect, useRef, useMemo } from 'react'
import useForm from '../useForm'
import get from '../../util/get'
import valueChangedInState from '../../util/valueChangedInState'
import errorWillChangeInState from '../../util/errorWillChangeInState'
import normalizeEmpty from '../../util/normalizeEmpty'
import buildActions from './buildActions'
import useAutoSet from './useAutoSet'

const DEFAULT_PARSE = v => v || v === 0 ? v : undefined
const DEFAULT_FORMAT = v => v || v === 0 ? v : ''
const DEFAULT_FIELD = {}

const createShouldUpdate = ({ name, validators, fieldStateRef }) => {
  const errorCheck = errorWillChangeInState({ name, validators, fieldStateRef })
  const valueCheck = valueChangedInState(name)
  return state => errorCheck(state) || valueCheck(state)
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

export default ({ name, validators = [], parse = DEFAULT_PARSE, format = DEFAULT_FORMAT, parseWhenFocused = true, custom }) => {
  const fieldStateRef = useFieldSetup({ name, validators })
  const actions = useMemo(() => buildActions({ name, validators, parse, fieldStateRef, custom }), [name, validators, parse, fieldStateRef, custom])

  const stateRef = fieldStateRef.current.stateRef
  const { fields, values, cleanValues } = stateRef.current
  const field = fields[name] || DEFAULT_FIELD
  const value = normalizeEmpty(get(values, name, undefined))
  const cleanValue = normalizeEmpty(get(cleanValues, name, undefined))
  const bypassParseDueToFocus = field.focused && parseWhenFocused === false

  fieldStateRef.current.field = field
  fieldStateRef.current.value = value
  fieldStateRef.current.cleanValue = cleanValue
  fieldStateRef.current.bypassParseDueToFocus = bypassParseDueToFocus

  useAutoSet({ name, fieldStateRef, actions })

  return {
    setValue: actions.setValueWithEffect,
    setVisited: actions.setVisited,
    setFocused: actions.setFocused,
    onChange: actions.onChange,
    onBlur: actions.onBlur,
    onFocus: actions.onFocus,

    value: format(fieldStateRef.current.value),
    ...fieldStateRef.current.field,
    submitted: stateRef.current.meta.submitted,
    cleanValue: stateRef.current.cleanValue,
    submitCount: stateRef.current.meta.submitCount,
    submitting: stateRef.current.meta.submitting
  }
}
