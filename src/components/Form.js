import React, { useState, useRef, useEffect, useReducer } from 'react'
import set from 'lodash/set'
import isEqual from 'lodash/isEqual'
import flatten from '../util/flatten'
import reducer, { initialState } from './reducer'
import * as actions from './actions'
import * as metaKeys from './metaKeys'

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

  // const [fields, setFields] = useState({})
  // const [values, setValues] = useState(initialValues || {})
  // const [meta, setMeta] = useState(defaultFormMeta)

  const [state, dispatch] = useReducer(reducer, initialState);

  // const ref = useRef({})
  // if (ref.current !== values) {
  //   console.log('************* VALUES CHANGED', values)
  //   ref.current = values
  // }

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

  //setFields(fields => ({ ...fields, [name]: field }))
  //setMeta(fields => ({ ...fields, [name]: value }))

  const setField = (name, field) => dispatch({ type: actions.SET_FIELD, name, ...field })
  const setValue = (name, value) => dispatch({ type: actions.SET_FIELD, name, value })
  const setMetaValue = (key, value) => dispatch({ type: actions.SET_META, key, value })
  const removeField = name => dispatch({ type: actions.REMOVE_FIELD, name })
  const reset = () => dispatch({ type: actions.RESET })
  const setValues = values => dispatch({ type: actions.SET_VALUES, values })
  const clear = () => setValues({})

  const submit = (...args) => {
    if (state.meta.valid) {
      process(state.values, ...args)
    } else {
      processInvalid(state.meta, state.fields)
    }
    setMetaValue(metaKeys.SUBMITTED, true)
  }

  const onSubmit = ev => submit(props, ev)

  const t1 = window.performance.now()
  console.log((t1 - t0).toFixed(2))

  return (
    <formContext.Provider value={{
      fields: state.fields,
      values: state.values,
      meta: state.meta,
      setField,
      removeField,
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
