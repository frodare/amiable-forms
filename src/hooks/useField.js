import { useEffect, useMemo } from 'react'
import useForm from './useForm'
import get from 'lodash/get'

const defaultParse = value => !value && value !== 0 ? undefined : value

const DEFAULT_FORMAT = value => value || ''
const DEFAULT_FIELD = {}

export default ({ name, validators = [], parse = defaultParse, format = DEFAULT_FORMAT }) => {
  const { values, fields, setField, setValue, removeField, meta, cleanValues } = useForm()
  const field = fields[name] || DEFAULT_FIELD
  const value = get(values, name)
  const cleanValue = get(cleanValues, name)

  useEffect(() => () => removeField(name), [])

  return useMemo(() => {
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
      event.persist()
      _setValue(event.target.value, { touch: true })
    }

    const formattedValue = format(value)

    return {
      ...field,
      value: formattedValue,
      submitted: meta.submitted,
      setValue: _setValue,
      setVisited,
      inputProps: {
        value: formattedValue,
        onChange,
        onBlur: setVisited
      }
    }
  }, [field, value, cleanValue])
}
