import { useCallback } from 'react'
import * as metaKeys from '../state/metaKeys'
import get from '../util/get'
import set from '../util/set'

const NOOP = () => {}

const reduceFieldValue = allValues => (fieldValues, fieldName) => {
  const value = get(allValues, fieldName)
  if (!value) return fieldValues
  return set(fieldValues, fieldName, value)
}

const getFieldValues = (allValues, fields) => Object.keys(fields).reduce(reduceFieldValue(allValues), {})

export default ({ stateRef, actions, props }) => {
  const { process, processInvalid } = props

  const submit = useCallback((...args) => {
    const state = stateRef.current
    const processFn = (state.meta.valid ? process : processInvalid) || NOOP
    const fieldValues = getFieldValues(state.values, state.fields)
    processFn(fieldValues, { ...state }, ...args)
    actions.setMetaValue(metaKeys.SUBMITTED, true)
  }, [stateRef, actions, process, processInvalid])

  const onSubmit = useCallback(ev => {
    submit(props, ev)
  }, [submit])

  return { submit, onSubmit }
}
