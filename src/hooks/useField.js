import { useEffect, useMemo } from 'react'
import useForm from './useForm'
import get from 'lodash/get'

const defaultParse = value => !value && value !== 0 ? undefined : value

const DEFAULT_FORMAT = value => value || ''
const DEFAULT_FIELD = {}

export default ({ name, validators = [], parse = defaultParse, format = DEFAULT_FORMAT }) => {
  const { values, fields, setField, setValue, removeField, meta } = useForm()
  const field = fields[name] || DEFAULT_FIELD
  const value = format(get(values, name))

  useEffect(() => () => removeField(name), [])

  return useMemo(() => {
    const _setValue = (val, { touch = false } = {}) => {
      const value = parse(val, name)
      const error = validators.reduce((error, validator) => error || validator(value), '')
      const valid = !error
      const touched = !!(field.touched || touch)
      const visited = touched || field.visited || false
      setField(name, { error, valid, touched, visited })
      setValue(name, value)
    }

    if (field.touched === undefined) {
      _setValue(value)
    }

    const setVisited = () => {
      setField(name, { ...field, visited: true })
    }

    const onChange = event => {
      event.persist()
      _setValue(event.target.value, { touch: true })
    }

    return {
      ...field,
      value,
      submitted: meta.submitted,
      setValue: _setValue,
      setVisited,
      inputProps: {
        value,
        onChange,
        onFocus: setVisited
      }
    }
  }, [field, value])
}
