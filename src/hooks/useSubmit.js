import useForm from './useForm'

export default () => {
  const { submit, onSubmit } = useForm({ shouldUpdate: () => false })
  return { submit, onSubmit }
}
