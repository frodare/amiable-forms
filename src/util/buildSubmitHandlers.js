import * as metaKeys from '../state/metaKeys'

export default ({ stateRef, actions, props }) => {
  const { process, processInvalid } = props
  const submit = (...args) => {
    const state = stateRef.current
    if (state.meta.valid) {
      if (process) process(state.values, ...args)
    } else {
      if (processInvalid) processInvalid(state.values, state.meta, state.fields)
      actions.setValues(state.values, { keepMeta: true })
    }
    actions.setMetaValue(metaKeys.SUBMITTED, true)
  }

  const onSubmit = ev => submit(props, ev)
  return { submit, onSubmit }
}
