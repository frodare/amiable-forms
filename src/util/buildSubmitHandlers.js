import * as metaKeys from '../state/metaKeys'

const NOOP = () => {}

export default ({ stateRef, actions, props }) => {
  const { process, processInvalid } = props

  const submit = (...args) => {
    const state = stateRef.current
    const processFn = (state.meta.valid ? process : processInvalid) || NOOP
    processFn(state.values, { ...state }, ...args)
    actions.setMetaValue(metaKeys.SUBMITTED, true)
  }

  const onSubmit = ev => submit(props, ev)
  return { submit, onSubmit }
}
