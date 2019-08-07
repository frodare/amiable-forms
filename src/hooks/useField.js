import { useEffect, useMemo } from 'react'
import useForm from './useForm'

const useRegister = ({ name, setValue, resetField }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => resetField(name)
  }, [])
}

const defaultParse = value => !value && value !== 0 ? undefined : value

const defaultFormat = value => value || ''

const defaultField = {}

const testField = {
  value: 'test',
  touched: false,
  visted: false,
  error: '',
  submitted: false,
  setValue: () => {},
  setVisited: () => {},
  inputProps: {
    value: 'testinput',
    onChange: () => {},
    onFocus: () => {}
  }
}

export default ({ name, validators = [], parse = defaultParse, format = defaultFormat }) => {
  const { fields, setField, resetField, meta } = useForm()
  const field = fields[name] || defaultField

  // useRegister({ name, setValue, resetField })

  return useMemo(() => {
    const t0 = window.performance.now()
    const setValue = (val, { touch = false } = {}) => {
      const value = parse(val, name)
      const error = validators.reduce((error, validator) => error || validator(value), '')
      const valid = !error
      const touched = !!(field.touched || touch)
      const visited = touched || field.visited || false
      setField(name, { value, error, valid, touched, visited })
    }

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

    const t1 = window.performance.now()
    console.log(name, (t1 - t0).toFixed(2))
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
  }, [field])
}
