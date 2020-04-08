import useForm from './useForm'

const shouldUpdate = ({ previous, current }) => {
  if (previous.meta === current.meta) return false

  return previous.meta.submitCount !== current.meta.submitCount ||
    previous.meta.submitted !== current.meta.submitted ||
    previous.meta.submitting !== current.meta.submitting
}

export default () => {
  const { submit, onSubmit, meta } = useForm({ shouldUpdate })
  return {
    submit,
    onSubmit,
    submitted: meta.submitted,
    submitCount: meta.submitCount,
    submitting: meta.submitting
  }
}
