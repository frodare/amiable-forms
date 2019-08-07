import React, { useState, useRef, useEffect } from 'react'
import set from 'lodash/set'
import isEqual from 'lodash/isEqual'
import flatten from '../util/flatten'

export const formContext = React.createContext({})

const reduceFieldToValues = (values, [name, field]) => set(values, name, field.value)

const hasFlag = (fields, name) => Object.values(fields).reduce((flag, field) => flag || field[name] || false, false)

const compileValues = fields =>
  Object.entries(fields).reduce(reduceFieldToValues, {})

const valuesToFields = (values, previousFields, keepMeta) => {
  const flattenedValues = flatten(values)
  const fields = Object.entries(flattenedValues).reduce((fields, [name, value]) => ({
    ...fields,
    [name]: {
      ...(keepMeta ? { ...previousFields[name], touched: true, visited: true } : {}),
      value
    }
  }), {})
  return fields
}

const Form = props => {
  const { children, process = () => {}, processInvalid = () => {}, validate = () => true, initialValues = {}, transformer = f => f.next } = props
  const [fields, _setFields] = useState({})
  const setFields = setter => _setFields(current => {
    const next = setter(current)
    return transformer({ current, next })
  })
  useEffect(() => setValues(initialValues), [])
  const cleanValuesContainer = useRef({})
  const metaContainer = useRef({
    visited: false,
    submitted: false
  })
  const values = compileValues(fields)

  const setValues = (changedValues, { keepMeta = false, merge = false } = {}) => {
    return setFields(fields => {
      const mergedValues = merge ? { ...values, ...changedValues } : changedValues
      const newFields = valuesToFields(mergedValues, fields, keepMeta)
      return newFields
    })
  }

  const setField = (name, field) => setFields(fields => ({ ...fields, [name]: field }))

  const runValidations = () => {
    const fieldsAreValid = Object.values(fields).reduce((valid, field) => valid && (field.valid === undefined ? true : !!field.valid), true)
    const formIsvalid = !!validate(values)
    return fieldsAreValid && formIsvalid
  }

  const touched = hasFlag(fields, 'touched')
  const visited = metaContainer.current.visited || hasFlag(fields, 'visited')
  const submitted = metaContainer.current.submitted

  if (!visited) {
    cleanValuesContainer.current = { ...values }
  }

  const dirty = !isEqual(values, cleanValuesContainer.current)
  const valid = runValidations()

  const resetField = name => setFields(fields => {
    const newFields = { ...fields }
    delete newFields[name]
    return newFields
  })

  const reset = () => setValues(cleanValuesContainer.current)
  const clear = () => setValues({})

  const meta = {
    touched,
    valid,
    dirty,
    visited,
    submitted
  }

  const submit = (...args) => {
    metaContainer.current.submitted = true
    if (valid) {
      process(values, ...args)
    } else {
      setFields(f => ({ ...f }))
      processInvalid(meta, fields)
    }
  }

  const onSubmit = ev => submit(values, props, ev)

  return (
    <formContext.Provider value={{
      fields,
      meta,
      values,
      setField,
      resetField,
      setFields,
      setValues,
      reset,
      clear,
      submit,
      onSubmit
    }}>
      {children}
    </formContext.Provider>
  )
}

export default Form
