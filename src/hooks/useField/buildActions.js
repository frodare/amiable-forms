import validate from '../../util/validate'

export default ({ name, validators, parse, fieldStateRef }) => {
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
