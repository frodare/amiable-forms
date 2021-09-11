import useForm from './useForm'

const shouldUpdate: ShouldUpdateHandler = ({ previous, current }) => {
  if (previous.values === current.values) return false
  return true
}

const useValues = (): Values => {
  const form = useForm({ shouldUpdate })
  return form.values
}

export default useValues
