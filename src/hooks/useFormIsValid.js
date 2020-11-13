import useForm from './useForm'

const shouldUpdate = ({ previous, current }) => {
  if (previous.meta === current.meta) return false
  return previous.meta.valid !== current.meta.valid
}

export default () => {
  const form = useForm({ shouldUpdate })
  return form.meta.valid
}
