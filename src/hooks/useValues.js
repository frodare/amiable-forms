import useForm from './useForm'

const shouldUpdate = ({ previous, current }) => {
  if (previous.values === current.values) return false
  return true
}

export default () => {
  const form = useForm({ shouldUpdate })
  return form.values
}
