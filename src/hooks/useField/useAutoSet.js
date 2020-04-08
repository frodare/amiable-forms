import { useEffect } from 'react'

export default ({ name, fieldStateRef, actions }) => {
  useEffect(() => {
    const { prevValue, requestRerun, stateRef } = fieldStateRef.current
    const { values, fields } = stateRef.current
    const value = values[name]
    const field = fields[name] || {}

    let shouldAutoSet = false

    /*
     * check for out of sync value
     */
    if (value !== prevValue) {
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
