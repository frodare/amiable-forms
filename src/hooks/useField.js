import { useEffect } from 'react'
import useForm from './useForm'

const useRegister = ({ name, setValue, resetField }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => resetField(name)
  }, [])
}

const defaultParse = value => !value && value !== 0 ? undefined : value

const defaultFormat = value => value || ''

export default ({ name, validators = [], parse = defaultParse, format = defaultFormat }) => {
  const { fields, setField, resetField, meta } = useForm()

  const field = fields[name] || {}

  const setValue = (val, { touch = false } = {}) => {
    const value = parse(val, name)
    const error = validators.reduce((error, validator) => error || validator(value), '')
    const valid = !error
    const touched = !!(field.touched || touch)
    const visited = touched || field.visited || false
    setField(name, { value, error, valid, touched, visited })
  }

  useRegister({ name, setValue, resetField })

  if (field.touched === undefined) {
    setValue(field.value)
  }

  const setVisited = () => {
    setField(name, { ...field, visited: true })
  }

  const onChange = event => {
    event.persist()
    setValue(event.target.value, { touch: true })
  }

  return {
    ...field,
    submitted: meta.submitted,
    setValue,
    setVisited,
    inputProps: {
      value: format(field.value),
      onChange,
      onFocus: setVisited
    }
  }
}
