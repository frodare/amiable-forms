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
  const { children, process = () => {}, validate = () => true, initialValues = {} } = props
  const [fields, setFields] = useState({})
  useEffect(() => setValues(initialValues), [])
  const cleanValuesContainer = useRef({})
  const previousVisitedContainer = useRef(false)
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
    const fieldsAreValid = Object.values(fields).reduce((valid, field) => valid && (field.valid === undefined ? true : !!field.value), true)
    const formIsvalid = !!validate(values)
    return fieldsAreValid && formIsvalid
  }

  const touched = hasFlag(fields, 'touched')
  const visited = previousVisitedContainer.current || hasFlag(fields, 'visited')

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

  const onSubmit = () => process(values, props)

  const meta = {
    touched,
    valid,
    dirty,
    visited
  }

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
      onSubmit
    }}>
      {children}
    </formContext.Provider>
  )
}

export default Form
