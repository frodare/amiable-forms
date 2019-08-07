import React, { useState, useRef, useEffect } from 'react'
import set from 'lodash/set'
import isEqual from 'lodash/isEqual'
import flatten from '../util/flatten'

export const formContext = React.createContext({})

// const reduceFieldToValues = (values, [name, field]) => set(values, name, field.value)

// const hasFlag = (fields, name) => Object.values(fields).reduce((flag, field) => flag || field[name] || false, false)

// const compileValues = fields => Object.entries(fields).reduce(reduceFieldToValues, {})

// const valuesToFields = (values, previousFields, keepMeta) => {
//   const flattenedValues = flatten(values)
//   const fields = Object.entries(flattenedValues).reduce((fields, [name, value]) => ({
//     ...fields,
//     [name]: {
//       ...(keepMeta ? { ...previousFields[name], touched: true, visited: true } : {}),
//       value
//     }
//   }), {})
//   return fields
// }

const defaultProcess = () => {}
const defaultProcessInvalid = () => {}
const defaultValidate = () => true
const defaultTransformer = f => f.next
const defaultInitialValues = {}
const defaultFormMeta = {
  visited: false,
  submitted: false
}

const Form = props => {
  const t0 = window.performance.now()

  const {
    children,
    process = defaultProcess,
    processInvalid = defaultProcessInvalid,
    validate = defaultValidate,
    transformer = defaultTransformer,
    initialValues
  } = props

  const [fields, setFields] = useState({})
  const [values, setValues] = useState(initialValues || {})
  const [meta, setMeta] = useState(defaultFormMeta)
  const ref = useRef({})

  if (ref.current !== values) {
    console.log('************* VALUES CHANGED', values)
    ref.current = values
  }

  // TODO: transfer support
  // const setFields = setter => _setFields(current => {
  //   const next = setter(current)
  //   return transformer({ current, next })
  // })

  // TODO: initial Values
  // useEffect(() => setValues(initialValues), [])

  // TODO: clean / dirty system
  // const cleanValuesContainer = useRef({})
  // const reset = () => setValues(cleanValuesContainer.current)
  // if (!visited) {
  //   cleanValuesContainer.current = { ...values }
  // }
  // const dirty = !isEqual(values, cleanValuesContainer.current)

  // REPLACED WITH STATE
  // const setValues = (changedValues, { keepMeta = false, merge = false } = {}) => {
  //   return setFields(fields => {
  //     const mergedValues = merge ? { ...compileValues(fields), ...changedValues } : changedValues
  //     const newFields = valuesToFields(mergedValues, fields, keepMeta)
  //     return newFields
  //   })
  // }

  // const runValidations = () => {
  //   const fieldsAreValid = Object.values(fields).reduce((valid, field) => valid && (field.valid === undefined ? true : !!field.valid), true)
  //   // const formIsvalid = !!validate(values)
  //   return fieldsAreValid
  // }

  // KEEP META UPDATED
  // const touched = hasFlag(fields, 'touched')
  // const visited = metaContainer.current.visited || hasFlag(fields, 'visited')
  // const submitted = metaContainer.current.submitted
  // const valid = runValidations()

  // const meta = {
  //   touched,
  //   valid,
  //   dirty: false,
  //   visited,
  //   submitted
  // }

  const setField = (name, field) => setFields(fields => ({ ...fields, [name]: field }))
  const setMetaValue = (name, value) => setMeta(fields => ({ ...fields, [name]: value }))

  const removeField = name => setFields(fields => {
    const newFields = { ...fields }
    delete newFields[name]
    return newFields
  })

  const clear = () => setValues({})

  const reset = () => console.log('NOT YET SUPPORTED')

  const submit = (...args) => {
    if (meta.valid) {
      process(values, ...args)
    } else {
      processInvalid(meta, fields)
    }
    setMetaValue('submitted', true)
  }

  const onSubmit = ev => submit(props, ev)

  const t1 = window.performance.now()
  console.log((t1 - t0).toFixed(2))

  return (
    <formContext.Provider value={{
      fields,
      values,
      meta,
      setField,
      removeField,
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
