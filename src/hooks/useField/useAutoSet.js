import { useEffect } from 'react'
import get from '../../util/get'

const isNull = v => v === null || v === undefined

const valueOutOfSync = ({ value, prevValue }) => {
  if (isNull(value) && isNull(prevValue)) return false
  return value !== prevValue
}

export default ({ name, fieldStateRef, actions }) => {
  useEffect(() => {
    const { prevValue, requestRerun, stateRef } = fieldStateRef.current
    const { values, fields } = stateRef.current
    const value = get(values, name, undefined)
    const field = fields[name] || {}

    let shouldAutoSet = false

    /*
     * check for out of sync value
     */
    if (valueOutOfSync({ value, prevValue })) {
      shouldAutoSet = true
    }

    /*
     * check if a rerun was requested by the pre-validation in shouldUpdate
     */
    if (requestRerun) {
      shouldAutoSet = true
      fieldStateRef.current.requestRerun = undefined
    }

    /*
     * check if the field has been registered
     */
    if (!field.registered) {
      shouldAutoSet = true
    }

    if (shouldAutoSet) {
      actions.setValueWithEffect(value)
    }
  })
}
