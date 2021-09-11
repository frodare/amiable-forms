import useForm from './useForm'

const shouldUpdate: ShouldUpdateHandler = ({ previous, current }) => {
  if (previous.meta === current.meta) return false
  return previous.meta.valid !== current.meta.valid
}

export default (): boolean => {
  const form = useForm({ shouldUpdate })
  return form.meta.valid
}
