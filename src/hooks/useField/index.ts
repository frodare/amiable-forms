import { useEffect, useRef, useMemo } from 'react'
import useForm from '../useForm'
import get from '../../util/get'
import valueChangedInState from '../../util/valueChangedInState'
import errorWillChangeInState from '../../util/errorWillChangeInState'
import normalizeEmpty from '../../util/normalizeEmpty'
import useAutoSet from './useAutoSet'
import validate from '../../util/validate'

const DEFAULT_PARSE: FieldParser = v => v === '' ? undefined : v
const DEFAULT_FORMAT: FieldParser = v => v === undefined || v === null ? '' : v

const DEFAULT_FIELD: Field = {
  error: undefined,
  valid: true,
  touched: false,
  visited: false,
  dirty: false,
  focused: false,
  registered: false,
  custom: undefined
}

const createShouldUpdate = (name: string, validators: Validator[], comm: FieldCommRef): ShouldUpdateHandler => {
  const errorCheck = errorWillChangeInState(name, validators, comm)
  const valueCheck = valueChangedInState(name)
  return state => errorCheck(state) || valueCheck(state)
}

const useField = ({ name, validators = [], parse = DEFAULT_PARSE, format = DEFAULT_FORMAT, parseWhenFocused = true, custom }: UseFieldArgs): UseFieldResult => {
  const comm: FieldCommRef = useRef({
    bypassParseDueToFocus: false,
    requestRerun: false,
    value: undefined,
    prevValue: undefined,
    cleanValue: undefined
  })

  const shouldUpdate = useMemo(() => createShouldUpdate(name, validators, comm), [name, validators, comm])
  const form = useForm({ shouldUpdate })

  const field = form.fields[name] === undefined ? DEFAULT_FIELD : form.fields[name]

  comm.current.prevValue = comm.current.value
  comm.current.value = normalizeEmpty(get(form.values, name, undefined))
  comm.current.cleanValue = normalizeEmpty(get(form.cleanValues, name, undefined))
  comm.current.bypassParseDueToFocus = field.focused && !parseWhenFocused

  useEffect(() => {
    if (form.stateRef.current.fields[name] !== undefined) {
      console.error('AmiableForm: field {', name, '} has already been registered, field names should be unique in a form.')
    }
    return () => form.removeField(name)
  }, [name])

  const setValue: FieldSetValue = (val, options) => {
    comm.current.requestRerun = false

    const touch = options === undefined ? false : options.touch
    const value = comm.current.bypassParseDueToFocus ? val : parse(val)
    const error = validate(validators)(value, form.values)
    const valid = error === undefined || error === ''
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    const dirty = comm.current.cleanValue !== value
    const focused = field.focused
    const newField = { error, valid, touched, visited, dirty, focused, custom, registered: true }

    form.setValueWithField(name, value, newField)
  }

  const setFocused: FieldSetFocused = focused => {
    form.setField(name, { ...field, focused: true })
  }

  const setVisited: FieldSetVisited = () => {
    form.setField(name, { ...field, visited: true })
  }

  const onChange: FieldOnChangeHandler = event => {
    setValue(event.target.value, { touch: true })
  }

  const onBlur: FieldOnBlurHandler = () => {
    if (comm.current.bypassParseDueToFocus) {
      form.setValue(name, parse(comm.current.value))
    }
    form.setField(name, { ...field, visited: true, focused: false })
  }

  const onFocus: FieldOnFocusHandler = () => setFocused(true)

  useAutoSet(name, comm, setValue, field, form)

  return {
    /*
     * Field Actions
     */
    setValue,
    setVisited,
    setFocused,
    onChange,
    onBlur,
    onFocus,

    /*
     * Field
     */
    ...field,

    /*
     * Field State Properties
     */
    value: format(comm.current.value),
    cleanValue: comm.current.cleanValue,

    /*
     * Form State Properties
     */
    submitted: form.stateRef.current.meta.submitted,
    submitCount: form.stateRef.current.meta.submitCount,
    submitting: form.stateRef.current.meta.submitting
  }
}

export default useField
